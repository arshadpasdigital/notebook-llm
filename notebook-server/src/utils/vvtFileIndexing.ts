import { initCollection } from "./qdrant"

interface VttFileIndexOfProps {
    source: string,
    fileName: string,
    filePath: string
}

export const vttFileIndexOf = async ({ source, fileName, filePath }: VttFileIndexOfProps) => {
    await initCollection();

}