let fs = require("fs");
let lexer = require("./Lexer");

let programFile = "Programs/verySimple.lang";

fs.readFile(programFile, "utf-8", function(error, data) {
    if(error) {
        console.log("ERROR reading program file:", error);
    }
    else {
        const program = data;
        console.log("STARTED LEXING");
        const tokens = lexer.lex(program);
        console.log("FINISHED LEXING");
        console.log("TOKEN STREAM: ")
        console.log(tokens);
    }
});