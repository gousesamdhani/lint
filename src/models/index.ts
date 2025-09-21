
export type SupportedSourceLanguages = 'typescript';

export interface ParserResult {
    readonly linesOfCodeCount: number;
    readonly singleLineCommentsCount: number;
    readonly multiLineCommentsCount: number;
    readonly blankLinesCount: number;
    readonly totalLinesCount: number;
}

export interface DetectLine {
    (line: string): boolean
}

export interface LanguageSyntax {
    readonly isBlank: DetectLine;
    readonly isSingleLineComment: DetectLine;
    readonly isBlockCommentStart: DetectLine;
    readonly isBlockCommentEnd: DetectLine;
}

