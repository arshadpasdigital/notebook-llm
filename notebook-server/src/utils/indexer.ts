import { initCollection } from "./qdrant"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddingAndIndexing, embeddingAndIndexText } from "./openAI";

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

const getDocumentChunks = async (docs: any) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const allSplits = await textSplitter.splitDocuments(docs);
    return allSplits;
}

const getTextChunks = async (text: any) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    })
    const allSplits = await textSplitter.splitText(text);
    return allSplits;
}

export const pdfIndexOf = async ({ fileName, filePath }: { fileName: string, filePath: string }) => {
    try {
        await initCollection();
        const pdfData = await extractTextFromPDF(filePath);
        const chunks = await getDocumentChunks(pdfData.docs)
        await embeddingAndIndexing(chunks, fileName, "This is the course")
        return pdfData;
    } catch (error) {
        console.error("get error in pdfIndexOf")
        console.error(error)
        throw error;
    }
}




