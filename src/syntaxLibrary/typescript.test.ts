import {typeScriptSyntax} from "./typescript";

describe('typescript syntax', () => {
    describe('isSingleLineComment', () => {
        it('returns true for // comment', () => {
            expect(typeScriptSyntax.isSingleLineComment('// comment')).toBe(true);
        });
        it('returns false for non-comment', () => {
            expect(typeScriptSyntax.isSingleLineComment('const x = 1;')).toBe(false);
        });
    });

    describe('isBlank', () => {
        it('returns true for empty string', () => {
            expect(typeScriptSyntax.isBlank('')).toBe(true);
        });
        it('returns true for whitespace', () => {
            expect(typeScriptSyntax.isBlank('   ')).toBe(true);
        });
        it('returns false for non-blank', () => {
            expect(typeScriptSyntax.isBlank('let x')).toBe(false);
        });
    });

    describe('isBlockCommentStart', () => {
        it('returns true for /* comment', () => {
            expect(typeScriptSyntax.isBlockCommentStart('/* comment')).toBe(true);
        });
        it('returns false for non-block comment', () => {
            expect(typeScriptSyntax.isBlockCommentStart('// comment')).toBe(false);
        });
    });

    describe('isBlockCommentEnd', () => {
        it('returns true for comment ending with */', () => {
            expect(typeScriptSyntax.isBlockCommentEnd('end of comment */')).toBe(true);
        });
        it('returns false for comment not ending with */', () => {
            expect(typeScriptSyntax.isBlockCommentEnd('/* comment')).toBe(false);
        });
    });
});
