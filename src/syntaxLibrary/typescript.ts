import {LanguageSyntax} from "../models";

export const typeScriptSyntax = {
    isSingleLineComment: (line) => line.startsWith('//'),
    isBlank: (line) => line.trim().length === 0,
    isBlockCommentStart: (line) => line.trim().startsWith('/*'),
    isBlockCommentEnd: (line) => line.trim().endsWith('*/')
} satisfies LanguageSyntax
