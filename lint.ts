import minimist from 'minimist';
import {main} from "./src";

interface Args {
    readonly filePath: string;
}

const args = minimist<Args>(process.argv.slice(2));

if(args.filePath) {
    const result = await main(args.filePath);
    if (!result) {
        console.log('unable to extract result');
        process.exit(1);
    }
    result.forEach(({name, parserResult}) => {
        if (parserResult) {
            console.log(`
------------------------------------------------------------------------------------------------------------------------------------------------------------
File: ${name}
------------------------------------------------------------------------------------------------------------------------------------------------------------
Blank: ${parserResult.blankLinesCount}
Single Line Comments: ${parserResult.singleLineCommentsCount}
Multi Line Comments: ${parserResult.multiLineCommentsCount}
Code: ${parserResult.linesOfCodeCount}
Total: ${parserResult.totalLinesCount}
`
            )
        }
    })
}
