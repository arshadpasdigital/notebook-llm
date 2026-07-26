import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { initCollection } from "./qdrant"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { HtmlToTextTransformer } from "@langchain/community/document_transformers/html_to_text";
import { embeddingAndIndexingWebsite } from "./openAI";


export const getTextFromWebsite = async (url: string) => {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200
    });
    const transformer = new HtmlToTextTransformer();

    // The sequence of text splitting followed by HTML to text transformation
    const sequence = await transformer.transformDocuments(docs);
    const chunks = await splitter.splitDocuments(sequence);

    return chunks;

}


export const websiteUrlIndexOf = async (websiteUrl: string) => {
    await initCollection();
    const chunks = await getTextFromWebsite(websiteUrl);
    await embeddingAndIndexingWebsite(chunks, websiteUrl);
    return chunks;
}