import { HydeRetriever } from "@langchain/classic/retrievers/hyde";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { embeddings, chatModel } from "./openAI";

const VECTOR_STORE_CONFIG = {
    url: process.env.QDRANT_URL!,
    collectionName: process.env.QDRANT_COLLECTION_NAME!,
};

function getVectorStore() {
    return QdrantVectorStore.fromExistingCollection(embeddings, VECTOR_STORE_CONFIG);
}

// ─── 1. QUERY REWRITING ──────────────────────────────────────────────────────

export async function queryRewriting(query: string) {
    const systemPrompt = `You are a query rewriting assistant. Given a user's question, produce a JSON object with:
- "stepBack": a broader, more general version of the question
- "rewritten": the same question with typos/grammar fixed, made explicit and clear
- "subQueries": exactly 3 focused sub-questions that together cover the original question

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await chatModel.invoke([
        ["system", systemPrompt],
        ["human", query],
    ]);

    const content = typeof response.content === "string" ? response.content : "";
    const parsed = JSON.parse(content);

    return {
        stepBack: parsed.stepBack as string,
        rewritten: parsed.rewritten as string,
        subQueries: parsed.subQueries as string[],
    };
}

// ─── 2. HyDE ─────────────────────────────────────────────────────────────────

export async function hydeDocument(query: string) {
    const vectorStore = await getVectorStore();

    const retriever = new HydeRetriever({
        vectorStore,
        llm: chatModel,
        k: 3,
    });

    return retriever.invoke(query);
}

// ─── 3. RECIPROCAL RANK FUSION ───────────────────────────────────────────────

export async function reciprocalRankFusion(
    rankedLists: Array<{ label: string; hits: Document[] }>,
    k: number = 60
) {
    const scoreMap = new Map<string, { score: number; doc: Document; matchedBy: Set<string> }>();

    for (const list of rankedLists) {
        for (let i = 0; i < list.hits.length; i++) {
            const doc = list.hits[i];
            const key = doc?.pageContent;

            if (!scoreMap.has(key)) {
                scoreMap.set(key, { score: 0, doc, matchedBy: new Set() });
            }

            const entry = scoreMap.get(key)!;
            entry.score += 1 / (k + i + 1);
            entry.matchedBy.add(list.label);
        }
    }

    return Array.from(scoreMap.values())
        .sort((a, b) => b.score - a.score)
        .map((entry) => ({
            doc: entry.doc,
            rrfScore: entry.score,
            matchedBy: Array.from(entry.matchedBy),
        }));
}

// ─── 4. MULTI-QUERY RETRIEVAL ────────────────────────────────────────────────

export async function retrieveChunks(query: string) {
    const { stepBack, rewritten, subQueries } = await queryRewriting(query);
    const hydeDocs = await hydeDocument(query);

    const vectorStore = await getVectorStore();

    const hydeText = hydeDocs.length > 0 ? hydeDocs[0].pageContent : query;

    const allQueryVariants = [
        { label: "rewritten", query: rewritten },
        { label: "stepBack", query: stepBack },
        { label: "hyde", query: hydeText },
        ...subQueries.map((sq, i) => ({ label: `subQuery${i + 1}`, query: sq })),
    ];

    const rankedLists = await Promise.all(
        allQueryVariants.map(async (variant) => {
            const hits = await vectorStore.similaritySearch(variant.query, 5);
            return { label: variant.label, hits };
        })
    );

    const fused = await reciprocalRankFusion(rankedLists);

    const finalK = 5;
    const topChunks = fused.slice(0, finalK);

    return {
        queries: {
            original: query,
            rewritten,
            stepBack,
            hyde: hydeText,
            subQueries,
        },
        chunks: topChunks.map((item, i) => ({
            id: item.doc.metadata?._id ?? i,
            text: item.doc.pageContent,
            source: item.doc.metadata?.source ?? "",
            chunkIndex: item.doc.metadata?.loc?.pageNumber ?? item.doc.metadata?.chunksIndex ?? 0,
            rrfScore: item.rrfScore,
            matchedBy: item.matchedBy,
        })),
    };
}

// ─── 5. RAG ANSWER PIPELINE ──────────────────────────────────────────────────

export const answerQuery = async (query: string) => {
    const { queries, chunks } = await retrieveChunks(query);

    const context = chunks
        .map((c, i) => `[Source ${i + 1}] (${c.source}, chunk ${c.chunkIndex}):\n${c.text}`)
        .join("\n\n---\n\n");

    const response = await chatModel.invoke([
        [
            "system",
            "You are a helpful assistant. Answer the user's question using ONLY the provided context. " +
            "If the context does not contain enough information, say so. " +
            "Cite sources by their number like [Source 1].",
        ],
        ["human", `Context:\n${context}\n\nQuestion: ${query}`],
    ]);

    return {
        answer: typeof response.content === "string" ? response.content : "",
        queries,
        sources: chunks,
    };
};
