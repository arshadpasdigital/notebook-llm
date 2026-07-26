import { initCollection } from "./qdrant"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddingAndIndexing } from "./openAI";

async function extractTextFromPDF(filePath: string) {
    // 1. Initialize the PDF loader with the file path
    const loader = new PDFLoader(filePath);

    // 2. Load the document pages
    // This returns an array of Document objects (one per page)
    const docs = await loader.load();

    // 3. Extract and combine text from all pages
    const fullText = docs.map(doc => doc.pageContent).join("\n");

    return {
        docs,
        fullText,
        pagesCount: docs.length,
        sampleMetadata: docs[0]?.metadata // Contains metadata like page numbers
    };
}

const getTextChunks = async (docs: any) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const allSplits = await textSplitter.splitDocuments(docs);
    return allSplits;
}

export const indexOf = async ({ fileName, filePath }: { fileName: string, filePath: string }) => {
    try {
        await initCollection();
        const pdfData = await extractTextFromPDF(filePath);
        const chunks = await getTextChunks(pdfData.docs)
        await embeddingAndIndexing(chunks, fileName, "This is the course")
        return pdfData;
    } catch (error) {

    }
}





