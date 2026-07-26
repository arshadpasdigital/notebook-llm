import { QdrantClient } from '@qdrant/js-client-rest';

// Initialize connection (use localhost or your Qdrant Cloud cluster URL)
const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});

export async function initCollection() {
    const collectionName = process.env.QDRANT_COLLECTION_NAME!;
    console.log("inside the init collection for qdrant")
    const existCollection = await client.collectionExists(collectionName);
    if (!existCollection.exists) {

        try {
            await client.createCollection(collectionName, {
                vectors: {
                    size: Number(process.env.EMBEDDING_DIMENSIONS) || 1536,         // Dimension size (e.g., 1536 for OpenAI text-embedding-3-small)
                    distance: 'Cosine'
                }
            });
            console.log(`Collection "${collectionName}" created successfully.`);
        } catch (error) {
            console.error('Failed to create collection:', error);
        }
    }
    return collectionName;
}


