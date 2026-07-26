import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { initCollection } from "./qdrant";
import { embeddingAndIndexingYoutube } from "./openAI";
import { Innertube } from 'youtubei.js';


type CaptionTrack = {
    baseUrl: string;
    languageCode?: string;
    name?: {
        simpleText?: string;
        runs?: Array<{ text?: string }>;
    };
};

const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
    if (!match?.[1]) {
        throw new Error("Invalid YouTube URL. Could not find a video id.");
    }

    return match[1];
};

const getYoutubeTranscriptDirect = async (videoId: string) => {
    const yt = await Innertube.create({ lang: 'en', location: 'US', generate_session_locally: true });
    const info = await yt.getInfo(videoId);

    const track = info.captions?.caption_tracks?.find(t => t.language_code === 'en')
        ?? info.captions?.caption_tracks?.[0];

    if (!track) throw new Error('No caption track found.');

    const res = await fetch(track.base_url + '&fmt=json3');
    const data = await res.json();

    const fullText = data.events
        ?.filter((e: any) => e.segs)
        .map((e: any) => e.segs.map((s: any) => s.utf8).join(''))
        .join(' ');

    return fullText;
};


const getTextFromYoutubeVideo = async (url: string) => {
    try {
        const videoId = extractVideoId(url)
        const videoFullText = await getYoutubeTranscriptDirect(videoId)
        console.log("get the docs of after the loader youtube")
        // console.log({ docs })
        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
        const chunks = await splitter.splitText(videoFullText);

        console.log(`Split into ${chunks.length} chunks.`);
        return chunks;
    } catch (error) {
        console.error("get error on get Text from youtube video ")
        throw new Error(`Unable to load YouTube transcript. Make sure the video has public captions/transcript available. ${error instanceof Error ? error.message : String(error)}`);
    }
}



export const youtubeVideoIndexOf = async (url: string) => {
    try {
        console.log('inside the youtube video index of ')
        console.log(`the url be like ===> ${url}`)
        await initCollection();
        const chunks = await getTextFromYoutubeVideo(url);
        await embeddingAndIndexingYoutube(chunks, url);
        return chunks;
    } catch (error) {
        console.log("error in youtubeVideo indexing ")
        console.log(error)
        throw error;
    }
}