import { Document } from "@langchain/core/documents";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { v4 as uuid } from "uuid";


export const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.API_KEY,
    batchSize: 512,
    model: process.env.OPENAI_EMBEDDING_MODEL,
});

export const chatModel = new ChatOpenAI({
    apiKey: process.env.API_KEY,
    model: "gpt-4o-mini",
    temperature: 0,
});

const getVectorStore = async () => {
    return await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
    });
}


export const embeddingAndIndexing = async (chunks: any, fileName: string, source: string) => {
    const vectorStore = await getVectorStore();

    chunks.forEach((doc: any, i: number) => {
        doc.metadata = {
            ...doc,
            fileName,
            chunksIndex: i,
            source
        }
    });

    await vectorStore.addDocuments(chunks);
}

async function getYouTubeMetadata(url: string) {
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

        const response = await fetch(oembedUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.status}`);
        }

        const data = await response.json();
        console.log("get the youtube meta data")
        console.log(data)
        return data;
    } catch (error) {
        console.error("error inside the get YouTube MetaData")
        throw error;
    }
}


export const embeddingAndIndexingYoutube = async (chunks: any, url: string) => {
    try {
        const vectorStore = await getVectorStore();

        const youtubeVideoDetail: any = await getYouTubeMetadata(url);
        console.log(youtubeVideoDetail)


        const updatedChunks = chunks.map((doc: string, i: number) => new Document({
            pageContent: doc,
            metadata: {
                chunksIndex: i,
                title: youtubeVideoDetail?.title || "unknown",
                channel: youtubeVideoDetail?.channel || "unknown",
                source: "youtube"
            }
        }));

        await vectorStore.addDocuments(updatedChunks);
    } catch (error) {
        console.error("get error on embedding and Indexing in youtube")
        throw error;
    }
}

export const embeddingAndSimilarSearch = async (query: string) => {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
    });

    const retrievedDocs = await vectorStore.similaritySearch(query, 4);
    return retrievedDocs;
}

export const embeddingAndIndexingWebsite = async (chunks: any, url: string) => {
    try {
        const vectorStore = await getVectorStore();

        chunks.forEach((doc: any, i: number) => {
            doc.metadata = {
                ...doc,
                chunksIndex: i,
                website: url,
                source: "website"
            }
        });

        await vectorStore.addDocuments(chunks);
    } catch (error) {
        console.log("=== get error in embedding and indexing website ===")
        console.error(error);
        throw error;
    }
}


export const embeddingAndIndexText = async (chunks: string[]) => {
    const vectorStore = await getVectorStore();

    const doc = chunks.map((chunk: string) => (
        new Document({ pageContent: chunk, id: uuid() })))

    await vectorStore.addDocuments(doc);
}

