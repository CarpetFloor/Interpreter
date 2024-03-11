let fs = require("fs");
let lexer = require("./Lexer");
let parser = require("./Parser");

let programFile = "SamplePrograms/SimpleMath.lang";

fs.readFile(programFile, "utf-8", function(error, data) {
    if(error) {
        console.log("ERROR READING FILE: " + programFile);
        console.log("WITH ERROR: " + error.message);
    }
    else {
        console.log("READ FILE: " + programFile + " SUCCESSFUL!")
        const program = data;

        console.log("STARTED LEXING");
        const tokens = lexer.lex(program);
        console.log("FINISHED LEXING");
        
        console.log("TOKEN STREAM: ");
        console.log(tokens);
        
        console.log("STARTED PARSING");
        const parseTree = parser.parse(tokens);
        console.log("FINISHED PARSING");

        console.log("PARSE TREE:");
        parser.print();
    }
});