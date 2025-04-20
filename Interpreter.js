const fs = require("fs");
const lexer = require("./Lexer");
const parser = require("./Parser");
const runner = require("./Runner");

const programName = "SimpleRunner";
const programFile = "SamplePrograms/" + programName + ".lang";

const show = {
    lexer: true, 
    parser: true
}

// if(process.argv.length >= 3) {
//     programFile = process.argv[2];
// }

fs.readFile(programFile, "utf-8", function(error, data) {
    if(error) {
        console.log("ERROR READING FILE: " + programFile);
        console.log("WITH ERROR: " + error.message);
    }
    else {
        console.log("READ FILE: " + programFile + " SUCCESSFUL!")
        const program = data;

        if(show.lexer) {
            console.log("\nSTARTED LEXING");
        }
        
        const tokens = lexer.lex(program);
        
        if(show.lexer) {
            console.log("FINISHED LEXING");
            console.log("\nTOKEN STREAM: ");
            console.log(tokens);
        }
        
        if(show.parser) {
            console.log("\nSTARTED PARSING");
        }
        
        const parseTree = parser.parse(tokens);
        
        if(show.parser) {
            console.log("\nFINISHED PARSING");
            console.log("\nPARSE TREE:");
            parser.print();
        }
        
        console.log("\nSTARTED RUNNING");
        runner.run(parseTree);
    }
});