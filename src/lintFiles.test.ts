import {Lint, lintFiles, main} from "./lintFiles";
import {SourceFile, SourceReader} from "./utils/sourceReader";
import {mock} from "./utils/mock";
import {LanguageDetector} from "./utils/languageDetector";
import {Logger} from "./utils/logger";
import {LanguageSyntax, ParserResult} from "./models";
import {Parser} from "./parser/parser";

describe("lintFiles", () => {
    it("logs error if no source files", async () => {
        const logger = { log: mock(), error: mock() } satisfies Logger;
        const sourceReader = mock<SourceReader>().mockReturnValue({sourceFiles: []})
        await lintFiles({
            source: "nofile.ts",
            sourceReader,
            languageDetector: mock(),
            logger,
            parser: mock()
        } satisfies Lint);
        expect(logger.error).toHaveBeenCalled();
    });

    it("calls parse and logs result for valid source file", async () => {
        const logger = { log: mock(), error: mock() } satisfies Logger;
        const mockSourceFile = {
            name: "file.ts",
            path: "/file.ts",
            content: (async function*() { yield "const x = 1;"; })()
        } satisfies SourceFile;
        const sourceReader = mock<SourceReader>().mockReturnValue(
            { sourceFiles: [mockSourceFile] }
        );
        const dummyLanguageSyntax = {
            isBlank: () => true,
            isSingleLineComment: () => true,
            isBlockCommentStart: () => false,
            isBlockCommentEnd: () => true
        } satisfies LanguageSyntax
        const languageDetector = mock<LanguageDetector>(() => dummyLanguageSyntax);
        const parser = mock<Parser>().mockResolvedValue({
            linesOfCodeCount: 1,
            singleLineCommentsCount: 0,
            blankLinesCount: 0,
            multiLineCommentsCount: 0,
            totalLinesCount: 1,
        });

        const result = await lintFiles({
            source: "file.ts",
            sourceReader,
            languageDetector,
            logger,
            parser
        });

        expect(parser).toHaveBeenCalledWith({ sourceFile: mockSourceFile, languageSyntax: dummyLanguageSyntax });
        expect(result).toStrictEqual([
            {
                name: "file.ts",
                parserResult: {
                    linesOfCodeCount: 1,
                    singleLineCommentsCount: 0,
                    blankLinesCount: 0,
                    multiLineCommentsCount: 0,
                    totalLinesCount: 1
                } satisfies ParserResult
            }
        ])
    });

    it("handles unknown language", async () => {
        const logger = { log: mock(), error: mock() } satisfies Logger;
        const mockSourceFile = {
            name: "file.unknown",
            path: "/file.unknown",
            content: (async function*() { yield "???"; })()
        } satisfies SourceFile;
        const sourceReader = mock<SourceReader>(() => ({ sourceFiles: [mockSourceFile] }));
        const languageDetector = mock<LanguageDetector>(() => undefined);
        const parser = mock<Parser>();

        const result = await lintFiles({
            source: "file.unknown",
            sourceReader,
            languageDetector,
            logger,
            parser
        });

        expect(parser).not.toHaveBeenCalled();
        expect(result).toStrictEqual([
            { name: "file.unknown" }
        ]);
    });
});


describe("Integration - TypeScript", () => {
    it('lint files and gives the result', async () => {
        const result = await main('./src/testData/typescript/testSourceFile.ts');
        expect(result).toStrictEqual([
            {
                name: "testSourceFile.ts",
                parserResult: {
                    blankLinesCount: 2,
                    linesOfCodeCount: 15,
                    singleLineCommentsCount: 1,
                    multiLineCommentsCount: 2,
                    totalLinesCount: 17
                } satisfies ParserResult
            }
        ])
    })
})

