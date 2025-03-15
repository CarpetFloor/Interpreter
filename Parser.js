// make sure checking if non terminal equals non terminal listed in cfg rule

const { debug } = require("console");
let nodes = require("./TreeNodes");
const { stat } = require("fs");

class Rule {
    constructor(contents) {
        this.contents = contents;
    }
}

class NonTerminal {
    constructor(name, rulesList) {
        this.name = name;
        this.rulesList = rulesList;
    }

    create() {
        // defined by instanciated objectects
    }
}

class TreeNode {
    constructor(name, content) {
        this.name = name;
        this.content = content;
    }
}

let cfg = [];

function createStatement() {
    rulesList = [];
    
    rulesList.push(new Rule([
        "NUMTYPE", 
        "ID", 
        "ASSIGN", 
        "NUM", 
        "SEMICOLON"
    ]));

    let nonTerminal = new NonTerminal(
        "statement", 
        rulesList
    );

    nonTerminal.create = function(context) {
        tree.push(
            "statement",
            context
        );
    }

    cfg.push(nonTerminal);
}

function generateCFG() {
    createStatement();
}
generateCFG();

let tree = [];
let printAsDebug = false;
module.exports.parse = function(tokenStream) {
    let match = false;

    for(let nonTerminal of cfg) {
        console.log("----------");
        console.log("Checking", nonTerminal.name);

        for(let rule of nonTerminal.rulesList) {
            console.log("--")
            console.log("\nRule:");

            let tokenIndex = 0;
            let context = [];

            for(let ruleElement of rule.contents) {
                console.log(ruleElement, tokenStream[tokenIndex]);

                if(ruleElement == tokenStream[tokenIndex].name) {
                    context.push(tokenStream[tokenIndex].name);
                    ++tokenIndex;

                    // last rule element matches, so found match with rule, 
                    // and thus non-terminal
                    if(rule.contents.indexOf(ruleElement) == rule.contents.length - 1) {
                        match = true;
                        nonTerminal.create(context);
                    }
                }
                else {
                    match = false;
                    break;
                }
            }

            if(match) {
                break;
            }

        }

        if(match) {
            break;
        }

    }

    console.log("MATCH", match);

}

module.exports.print = function() {
    console.log(tree);
}