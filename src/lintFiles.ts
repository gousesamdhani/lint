import {languageDetector, LanguageDetector} from "./utils/languageDetector";
import {sourceReader, SourceReader} from "./utils/sourceReader";
import {consoleLogger, Logger} from "./utils/logger";
import {Parser, parser} from "./parser/parser";

export interface Lint {
    readonly source: string;
    readonly languageDetector: LanguageDetector;
    readonly sourceReader: SourceReader;
    readonly logger: Logger;
    readonly parser: Parser
}

export async function lintFiles({
   source,
   languageDetector,
   logger,
   parser,
   sourceReader
}: Lint) {
    const {sourceFiles} = sourceReader(source);
    if (sourceFiles.length === 0) {
        logger.error(`unable to access the source provided: ${source}`)
        return;
    }
    return await Promise.all(
        sourceFiles.map(async (sourceFile) => {
            const languageSyntax = languageDetector(sourceFile.name);
            if (!languageSyntax) {
                return {
                    name: sourceFile.name
                };
            }
            return {
                name: sourceFile.name,
                parserResult: await parser({
                    sourceFile,
                    languageSyntax
                })
            }
        }
    ));
}

export const main = async (source: string) => {
    return await lintFiles({
        source,
        sourceReader,
        languageDetector,
        logger: consoleLogger,
        parser
    });
}