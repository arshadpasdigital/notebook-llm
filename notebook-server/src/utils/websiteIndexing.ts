import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { initCollection } from "./qdrant"
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { embeddingAndIndexingWebsite } from "./openAI";
import { Document } from "@langchain/core/documents";


export const getTextFromWebsite = async (url: string) => {
    try {

        const response = await fetch(url);
        const data = await response.text();
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });
        const transformer = new HtmlToTextTransformer();
        const doc = [new Document({ pageContent: data })]

        // The sequence of text splitting followed by HTML to text transformation
        const sequence = await transformer.transformDocuments(doc);
        const chunks = await splitter.splitDocuments(sequence);

        return chunks;
    } catch (error) {
        console.log("=== get error in get Text from website ===")
        console.error(error);
        throw error;
    }

}


export const websiteUrlIndexOf = async (websiteUrl: string) => {
    try {
        await initCollection();
        const chunks = await getTextFromWebsite(websiteUrl);
        await embeddingAndIndexingWebsite(chunks, websiteUrl);
        return chunks;
    } catch (error) {
        console.log("=== get error in website url index of ===")
        console.error(error);
        throw error;
    }
}