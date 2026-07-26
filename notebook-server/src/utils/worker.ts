import { Worker } from 'bullmq';
import { connection } from '../db/jobConnection'
import { indexOf } from './indexer';
import { answerQuery } from './answerQuery';
import { youtubeVideoIndexOf } from './youtubeIndixing';
import { websiteUrlIndexOf } from './websiteIndexing';
import { textIndexOf } from './textIndexing';

const indexingWorker = new Worker("indexing", async (job) => {
    console.log(`📥 Indexing job ${job.id}: ${job.data.originalName}`);

    const result = await indexOf({
        filePath: job.data.filePath,
        fileName: job.data.fileName,
    })
    console.log(`   → ${result?.pagesCount} chunk(s) indexed`);
    return result;

}, {
    connection, concurrency: 2
})


const indexingYoutubeVideo = new Worker('indexing-youtube', async (job) => {
    console.log("inside the indexing of Youtube video");
    console.log(job.data)
    const result = await youtubeVideoIndexOf(job.data.url)
    console.log(`   → ${result?.length} chunk(s) indexed`);
    return result;
}, { connection, concurrency: 4 })


const indexingWebsiteUrl = new Worker('indexing-website', async (job) => {
    const result = await websiteUrlIndexOf(job.data.website)
    console.log(`   → ${result?.length} chunk(s) indexed`);
    return result;
}, { connection, concurrency: 4 })

const indexingText = new Worker("indexing-text", async (job) => {
    const result = await textIndexOf({
        source: "text",
        text: job.data.text
    })
    console.log(`   → ${result?.length} chunk(s) indexed`);
    return result;
}, { connection, concurrency: 4 })

// const indexingVTTFile = new Worker('indexing-vvt-file', async (job) => {
//     const result = await vttFileIndexOf({
//         source: "vvt",
//         filePath: job.data.filePath,
//         fileName: job.data.fileName,
//     })
// }, { connection, concurrency: 4 })

const queryWorker = new Worker('query', async (job) => {
    console.log(`🔎 Query job ${job.id}: ${JSON.stringify(job.data.query)}`);
    const result = await answerQuery(job.data.query);
    console.log(`   → answered using chunk(s)`);
    return result;
}, { connection, concurrency: 4 });




for (const [name, worker] of [
    ["indexing", indexingWorker],
    ["indexing-youtube", indexingYoutubeVideo],
    ["query", queryWorker]
]) {
    worker.on("completed", (job) => console.log(`✅ [${name}] job ${job.id} completed`));
    worker.on("failed", (job, err) => console.error(`❌ [${name}] job ${job?.id} failed:`, err.message));
}

console.log("👷 Workers started (indexing + query). Waiting for jobs...");
