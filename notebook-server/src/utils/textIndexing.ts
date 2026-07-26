import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { initCollection } from "./qdrant"
import { embeddingAndIndexText } from "./openAI";

const getChunks = async (text: string) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const allSplits = await textSplitter.splitText(text);
    return allSplits;
}

export const textIndexOf = async ({ source, text }: { source: string, text: string }) => {
    await initCollection();
    const chunks = await getChunks(text);
    await embeddingAndIndexText(chunks);
    return chunks

}