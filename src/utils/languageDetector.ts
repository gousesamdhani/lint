import {LanguageSyntax} from "../models";
import {typeScriptSyntax} from "../syntaxLibrary";

export interface LanguageDetector {
    (source: string): LanguageSyntax | undefined
}

export const languageDetector: LanguageDetector = (filePath: string) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'ts':
        case 'tsx':
            return typeScriptSyntax;
        // Add more cases here for other languages as needed
        default:
            throw new Error(`Unsupported or unknown source language for file: ${filePath}`);
    }
}