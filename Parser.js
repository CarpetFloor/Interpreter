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

function createProgram() {
    rulesList = [];
    
    rulesList.push(new Rule([
        "statementlist"
    ]));

    let nonTerminal = new NonTerminal(
        "program", 
        rulesList
    );

    nonTerminal.create = function(context) {
        tree.push(
            "program",
            context
        );
    }

    cfg.push(nonTerminal);
}

function createStatementList() {
    rulesList = [];

    // rulesList.push(new Rule([
    //     "statement", 
    //     "statementlist"
    // ]));
    
    rulesList.push(new Rule([
        "statement"
    ]));

    let nonTerminal = new NonTerminal(
        "statementlist", 
        rulesList
    );

    nonTerminal.create = function(context) {
        tree.push(
            "statement list",
            context
        );
    }

    cfg.push(nonTerminal);
}

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
    createProgram();
    createStatementList();
    createStatement();
}
generateCFG();

let tree = [];
let printAsDebug = false;

function recursiveParseNonTerminal(nonTerminal, tokenStream) {
    // find the non-terminal element in the cfg that matches the 
    // provided non-terminal name
    let nonTerminalIndex = -1;
    for(let i = 0; i < cfg.length; i++) {
        if(cfg[i].name == nonTerminal) {
            nonTerminalIndex = i;
            break;
        }
    }

    console.log("==========");
    console.log("RECURSIVE PARSE NON TERMINAL:", nonTerminal);
    console.log(tokenStream);

    // then parse through all rule lists of non-terminal
    for(let rule of cfg[nonTerminalIndex].rulesList) {
        let tokenIndex = 0;
        let context = [];
        let recursiveContextLength = 0;

        console.log("_____");

        console.log("RULE");
        console.log(rule);

        // go through each element of each rule
        for(let ruleElement of rule.contents) {
            // first check if rule element is a non-terminal or terminal
            // by if it's uppercase or lowercase

            if(ruleElement == ruleElement.toUpperCase()) {
                if(ruleElement == tokenStream[tokenIndex].name) {
                    context.push(tokenStream[tokenIndex].name);
                    ++tokenIndex;
                    ++recursiveContextLength;

                    // last rule element matches, so found match with rule, 
                    // and thus non-terminal
                    if(rule.contents.indexOf(ruleElement) == rule.contents.length - 1) {
                        console.log("FOUND MATCH");
                        return new TreeNode(
                            nonTerminal,
                            context
                        );
                    }
                }
                else {
                    break;
                }
            }
            else {
                let matchCheck = recursiveParseNonTerminal(
                    ruleElement,
                    tokenStream
                );

                if(!(!(matchCheck))) {
                    return new TreeNode(
                        nonTerminal,
                        matchCheck
                    );
                }
                else {
                    return false;
                }
            }
        }

        console.log("_____");
    }

    return false;
}

module.exports.parse = function(tokenStreamReceived) {
    let tokenStream = [...tokenStreamReceived];
    let match = false;

    for(let nonTerminal of cfg) {
        let matchCheck = recursiveParseNonTerminal(nonTerminal.name, tokenStream);

        if(!(!(matchCheck))) {
            match = true;

            console.log("MATCH CHECK");
            tree.push(matchCheck);
            break;
        }
    }

}

module.exports.print = function() {
    console.log(tree);

    if(tree.length == 0) {
        console.log("NO MATCH FOUND");
    }
}