const fs = require("fs");
const lexer = require("./Lexer");
const parser = require("./Parser");
const runner = require("./Runner");

const programName = "SimpleRunner";
const programFile = "SamplePrograms/" + programName + ".lang";

const show = {
    fileOperations: false, 
    lexer: false, 
    parser: false, 
    /**
     * Still prints the program output regardless, 
     * but when false doesn't print "STARTED RUNNING"
     */ 
    runner: false
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
        if(show.fileOperations) {
            console.log("READ FILE: " + programFile + " SUCCESSFUL!")
        }
        
        const program = data;

        if(show.lexer) {
            console.log("\nSTARTED LEXING");
        }
        
        const tokens = lexer.lex(program);
        
        if(show.lexer) {
            console.log("FINISHED LEXING");
            console.log("\nTOKEN STREAM:\n");
            console.log(tokens);
        }
        
        if(show.parser) {
            console.log("\nSTARTED PARSING");
        }
        
        const parseTree = parser.parse(tokens);
        
        if(parseTree != false) {
            if(show.parser) {
                console.log("\nFINISHED PARSING");
                console.log("\nPARSE TREE:");
                parser.print();
            }
            
            if(show.runner) {
                console.log("\nSTARTED RUNNING\n");
            }

            runner.run(parseTree);

            if(show.runner) {
                console.log("\nFINISHED RUNNING");
            }
        }

    }
});