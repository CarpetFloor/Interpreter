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

function createStatementList() {
    rulesList = [];
    
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
    console.log("RECURSIVE PARSE NON TERMINAL");
    console.log(nonTerminal);
    console.log(nonTerminalIndex);
    console.log(tokenStream);

    // then parse through all rule lists of non-terminal
    for(let rule of cfg[nonTerminalIndex].rulesList) {
        let tokenIndex = 0;
        let context = [];

        console.log("_____");

        console.log("RULE");
        console.log(rule);

        console.log("_____");

        // go through each element of each rule
        for(let ruleElement of rule.contents) {
            // first check if rule element is a non-terminal or terminal
            // by if it's uppercase or lowercase
            console.log(ruleElement);

            if(ruleElement == ruleElement.toUpperCase()) {
                console.log("terminal");
                if(ruleElement == tokenStream[tokenIndex].name) {

                    context.push(tokenStream[tokenIndex].name);
                    ++tokenIndex;

                    // last rule element matches, so found match with rule, 
                    // and thus non-terminal
                    if(rule.contents.indexOf(ruleElement) == rule.contents.length - 1) {
                        return new TreeNode(
                            cfg[nonTerminalIndex].name, 
                            context
                        );
                    }
                }
                else {
                    break;
                }
            }
            else {
                console.log("non-terminal");
                recursiveParseNonTerminal(
                    ruleElement,
                    context.slice(tokenIndex + 1)
                );
            }
        }
    }

    return false;
}

module.exports.parse = function(tokenStream) {
    let match = false;

    // go through non-terminals listed in cfg for match
    for(let nonTerminal of cfg) {
        // go through each rule list of non-terminal for match
        for(let rule of nonTerminal.rulesList) {
            let tokenIndex = 0;
            let context = [];

            // go through each element of each rule
            for(let ruleElement of rule.contents) {
                // first check if rule element is a non-terminal or terminal
                // by if it's uppercase or lowercase
                if(ruleElement == ruleElement.toUpperCase()) {
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
                else {
                    let matchCheck = recursiveParseNonTerminal(
                        ruleElement,
                        tokenStream.slice(tokenIndex)
                    );

                    // if matchCheck is not false
                    // can't just check for true because if not false
                    // matchCheck will contain the context
                    if(!(!(matchCheck))) {
                        match = true;

                        nonTerminal.create(matchCheck);
                    }

                    console.log("matchCheck", matchCheck);
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

    if(tree.length == 0) {
        console.log("NO MATCH FOUND");
    }
}