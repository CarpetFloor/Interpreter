const fs = require("fs");
const lexer = require("./Lexer");
const parser = require("./Parser");
const runner = require("./Runner");

// const programName = "SimpleRunner";
// const programFile = "SamplePrograms/" + programName + ".lang";

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

if(process.argv.length >= 3) {
    programFile = process.argv[2];
}
else {
    console.error("!!!!!Must include path to file to run!!!!!");
    return;
}

if(process.argv.length > 3) {
    if(process.argv.length < 7) {
        console.error("!!!!!Must include values for extra options (show file operation info, show lexer info, show parser info, and show runner info)!!!!!");
        return;
    }

    if(process.argv.length > 7) {
        console.error("!!!!!Must only include values for extra options (show file operation info, show lexer info, show parser info, and show runner info), and nothing more!!!!!");
        return;
    }

    for(let i = 3; i < 7; i++) {
        let newValue = true;

        if(process.argv[i] == "f") {
            newValue = false;
        }
        else if(process.argv[i] != "t") {
            console.error("!!!!!Invalid extra option value, must be either t or f!!!!!");
            return;
        }

        switch(i) {
            case 3:
                show.fileOperations = newValue;
                break;
            case 4:
                show.lexer = newValue;
                break;
            case 5:
                show.parser = newValue;
                break;
            case 6:
                show.runner = newValue;
                break;
        }
    }
}

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
        
        let parseTree = parser.parse(tokens);

        /**
         * Sometimes parser will try to parse a syntatically-incorrect 
         * program, and won't fail but will return undefined. This only 
         * happens in a few cases though, and more often than not 
         * parseTree will be false from the parser failing to parse when 
         * given a syntatically-incorrect program.
         */
        if(parseTree == undefined) {
            parseTree = false;
        }
        
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