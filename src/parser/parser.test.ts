import {parser} from "./parser";
import {LanguageSyntax, ParserResult} from "../models";
import {Readable} from "stream";
import {SourceFile} from "../utils/sourceReader";

function createStreamFromString(lines: string[]): Readable {
    // Emit each line as a separate chunk to simulate real stream behavior
    return Readable.from(lines.map(line => line + '\n'));
}

const mockSyntax: LanguageSyntax = {
    isBlank: (line) => line === "",
    isSingleLineComment: (line) => line.startsWith("//"),
    isBlockCommentStart: (line) => line.trim().startsWith('/*'),
    isBlockCommentEnd: (line) => line.trim().endsWith('*/')
};

describe("parser", () => {
    it("counts blank lines, comments, and total number of lines", async () => {
        const content = [
            "import x from 'y';",
            "",
            "/* multiline start",
            "* middle",
            "* end */",
            "// comment",
            "const a = 1;",
            ""
        ];
        const sourceFile = {
            name: "test.ts",
            path: "/test.ts",
            content: createStreamFromString(content)
        } satisfies SourceFile;

        const result = await parser({sourceFile, languageSyntax: mockSyntax});
        expect(result).toStrictEqual({
            linesOfCodeCount: 6,
            singleLineCommentsCount: 1,
            blankLinesCount: 2,
            multiLineCommentsCount: 1,
            totalLinesCount: 8
        } satisfies ParserResult);
    });

    it("handles file with only blank lines", async () => {
        const content = [
            "",
            ""
        ];
        const sourceFile = {
            name: "blank.ts",
            path: "/blank.ts",
            content: createStreamFromString(content)
        } satisfies SourceFile;

        const result = await parser({sourceFile, languageSyntax: mockSyntax});
        expect(result).toStrictEqual({
            linesOfCodeCount: 0,
            singleLineCommentsCount: 0,
            blankLinesCount: 2,
            multiLineCommentsCount: 0,
            totalLinesCount: 2,
        } satisfies ParserResult);
    });

    it("handles file with only comments", async () => {
        const content = [
            "//",
            "//"
        ];
        const sourceFile = {
            name: "comments.ts",
            path: "/comments.ts",
            content: createStreamFromString(content)
        } satisfies SourceFile;

        const result = await parser({sourceFile, languageSyntax: mockSyntax});
        expect(result).toStrictEqual({
            linesOfCodeCount: 2,
            singleLineCommentsCount: 2,
            blankLinesCount: 0,
            multiLineCommentsCount: 0,
            totalLinesCount: 2,
        } satisfies ParserResult);
    });

    it("handles file with no content", async () => {
        const sourceFile = {
            name: "empty.ts",
            path: "/empty.ts",
            content: createStreamFromString([])
        } satisfies SourceFile;

        const result = await parser({sourceFile, languageSyntax: mockSyntax});
        expect(result).toStrictEqual({
            linesOfCodeCount: 0,
            singleLineCommentsCount: 0,
            blankLinesCount: 0,
            multiLineCommentsCount: 0,
            totalLinesCount: 0
        } satisfies ParserResult);
    });
});

