import fs from "fs";
import readline from 'readline';
import path from "node:path";

export type SourceFileContent = AsyncIterable<string>

export interface SourceFile {
    readonly name: string,
    readonly path: string,
    readonly content: SourceFileContent
}

export interface SourceReader {
    (source: string): {
        readonly sourceFiles: readonly SourceFile[]
    }
}

// TODO: Add support to accept a directory as source
export const sourceReader: SourceReader = (source: string) => {
    if (!fs.existsSync(source)) {
        return {
            sourceFiles: []
        };
    }
    const fileStream = fs.createReadStream(source);
    return {
        sourceFiles: [{
            name: path.basename(source),
            path: source,
            content: readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity, // handles both \n and \r\n
            })
        }]
    };
}