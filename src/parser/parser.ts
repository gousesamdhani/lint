import {LanguageSyntax, ParserResult} from "../models";
import {SourceFile} from "../utils/sourceReader";

export interface ParserParams {
    readonly sourceFile: SourceFile,
    readonly languageSyntax: LanguageSyntax;
}

export interface Parser {
    (params: ParserParams): Promise<ParserResult>;
}

export const parser: Parser = async ({sourceFile, languageSyntax}) => {
    const fileContent = sourceFile.content;

    let blankLinesCount = 0;
    let singleLineCommentsCount = 0;
    let linesOfCodeCount = 0;
    let multiLineCommentsCount = 0;
    let insideBlock = false;

    for await (let rawLine of fileContent) {
        const line = rawLine.trim();

        if (languageSyntax.isBlank(line)) {
            blankLinesCount++;
            continue;
        }

        if (languageSyntax.isSingleLineComment(line) && !insideBlock) {
            singleLineCommentsCount++;
        }

        if (languageSyntax.isBlockCommentStart(line) && !insideBlock) {
            insideBlock = true;
        }

        if (insideBlock && languageSyntax.isBlockCommentEnd(line)) {
            insideBlock = false;
            multiLineCommentsCount++;
        }

        linesOfCodeCount++;
    }

    return {
        linesOfCodeCount,
        singleLineCommentsCount,
        blankLinesCount,
        multiLineCommentsCount,
        totalLinesCount: linesOfCodeCount + blankLinesCount
    }
}
