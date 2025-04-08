let fs = require("fs");
let lexer = require("./Lexer");
let parser = require("./Parser");

let programFile = "SamplePrograms/Print.lang";

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

        console.log("\nSTARTED LEXING");
        const tokens = lexer.lex(program);
        console.log("FINISHED LEXING");
        
        console.log("\nTOKEN STREAM: ");
        console.log(tokens);
        
        console.log("\nSTARTED PARSING");
        const parseTree = parser.parse(tokens);
        console.log("\nFINISHED PARSING");

        console.log("\nPARSE TREE:");
        parser.print();
    }
});