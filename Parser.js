// make sure checking if non terminal equals non terminal listed in cfg rule

let nodes = require("./TreeNodes");

// context-free grammar class
class Rule {
    // elems is an array of the terminals and/ or nonterminals that make up this rule
    constructor(name, parts, generateNode) {
        this.name = name;
        this.parts = parts;
        this.generateNode = generateNode;
    }
}

// context-free grammar class
class Terminal {
    constructor(tokenName) {
        this.tokenName = tokenName;
        this.value = null;
    }

    setValue(value) {
        this.value = value;
    }
}

// context-free grammar class
class NonTerminal {
    constructor(name) {
        this.name = name;
    }
}

/*
let cfgFoundDebug = true;
class GenerateNode {
    constructor(context) {
        this.context = context;
        this.debug = false;
    }
    expression() {
        let left = [];
        let right = [];
        let onleft = true;
        let possibleOperations = ["PLUS", "MINUS"];
        let operationMap = new Map();
        operationMap.set("PLUS", "+");
        operationMap.set("MINUS", "-");
        let operation = null;

        if(this.debug) {
            console.log("\nCONTEXT:");
            console.log(this.context);
        }

        let foundOperation = false;
        for(let i = 0; i < this.context.length; i++) {
            if(onleft && possibleOperations.includes(this.context[i].name)) {
                foundOperation = true;
                onleft = false;
                operation = operationMap.get(this.context[i].name);
            }
            else if(onleft) {
                left.push(this.context[i]);
            }
            else {
                right.push(this.context[i]);
            }
        }

        if(foundOperation) {
            if(this.debug) {
                console.log("LEFT / RIGHT:");
                console.log(left);
                console.log(right);
            }

            if(left.length == 1) {
                let node = new nodes.Num(left[0].value);
                left = node;
            }
            else {
                let node = (new GenerateNode(left)).expression();
                left = node;
            }

            if(right.length == 1) {
                let node = new nodes.Num(right[0].value);
                right = node;
            }
            else {
                let node = (new GenerateNode(right)).expression();
                right = node;
            }

            if(this.debug) {
                console.log("\n");
            } 

            if(cfgFoundDebug) {
                console.log("PARSED expression");
            }

            return new nodes.BinaryOperatorExpression(operation, left, right);
        }
        else {
            return (new GenerateNode(this.context)).term();
        }
    }
    term() {
        let left = [];
        let right = [];
        let onleft = true;
        let possibleOperations = ["TIMES", "DIVIDES"];
        let operationMap = new Map();
        operationMap.set("TIMES", "*");
        operationMap.set("DIVIDES", "/");
        let operation = null;

        if(this.debug) {
            console.log("\nCONTEXT:");
            console.log(this.context);
        }

        let foundOperation = false;
        for(let i = 0; i < this.context.length; i++) {
            if(onleft && possibleOperations.includes(this.context[i].name)) {
                foundOperation = true;
                onleft = false;
                operation = operationMap.get(this.context[i].name);
            }
            else if(onleft) {
                left.push(this.context[i]);
            }
            else {
                right.push(this.context[i]);
            }
        }

        if(foundOperation) {
            if(this.debug) {
                console.log("LEFT / RIGHT:");
                console.log(left);
                console.log(right);
            }

            if(left.length == 1) {
                let node = new nodes.Num(left[0].value);
                left = node;
            }
            else {
                let node = (new GenerateNode(left)).expression();
                left = node;
            }

            if(right.length == 1) {
                let node = new nodes.Num(right[0].value);
                right = node;
            }
            else {
                let node = (new GenerateNode(right)).expression();
                right = node;
            }

            if(this.debug) {
                console.log("\n");
            }

            if(cfgFoundDebug) {
                console.log("PARSED term");
            }

            return new nodes.BinaryOperatorExpression(operation, left, right);
        }
    }
}
*/

// create context-free grammar
let cfg = [];

// the actual CFG rules are defined here
function generateCFG() {
    let rule = null;
    
    rule = new Rule("expression", [
        new NonTerminal("expression"), 
        new Terminal("PLUS"), 
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        console.log("Parsed expression");

        let left = [];
        parseLoop(left, nonTerminals[0], "expression");
        console.log("=====");
        console.log("AFTER");
        console.log(left);

        let right = [];
        parseLoop(right, nonTerminals[1], "expression");
        
        return new nodes.BinaryOperatorExpression(
            "+", 
            left[0], 
            right[0]
        );
    });
    cfg.push(rule);

    rule = new Rule("expression", [
        new NonTerminal("expression"), 
        new Terminal("MINUS"), 
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        console.log("Parsed expression");
        
        let left = [];
        parseLoop(left, nonTerminals[0]), "expression";

        let right = [];
        parseLoop(right, nonTerminals[1], "expression");
        
        return new nodes.BinaryOperatorExpression(
            "-", 
            left[0], 
            right[0]
        );
    });
    cfg.push(rule);

    rule = new Rule("expression", [
        new NonTerminal("term")
    ], 
    function(nonTerminals, terminals) {
        console.log("Parsed expression");
        let all = [];
        parseLoop(all, nonTerminals[0], "term");

        return new nodes.Term(all[0]);
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new NonTerminal("factor")
    ], 
    function(nonTerminals, terminals) {
        console.log("Parsed term")

        return new nodes.Num(nonTerminals[0][0].value);
    }
    )
    cfg.push(rule);
}
generateCFG();

// for(let i = 0; i < cfg.length; i++) {
//     console.log("++");
//     console.log(cfg[i].name);
//     console.log("++");
// }


function parseLoop(addTo, context, nonTerminal) {
    console.log("parsing");
    let index = 0;

    // go through every rule in cfg to find a match
    while(index < cfg.length) {
        console.log("_____\nCHECKING:");
        console.log(context);
        console.log("NON-TERMINAL: " + nonTerminal);

        console.log((cfg[index].name == nonTerminal) || (nonTerminal == ""));
        console.log(cfg[index].name);

        if(
            (cfg[index].name == nonTerminal) || 
            (nonTerminal == "")
        ) {
            let parts = cfg[index].parts;

            
                console.log("PARTS:");
                console.log(parts);
            
            let foundMatch = false;

            let terminalsCheck = [];
            let nonTerminalsCheck = [];

            for(let i = 0; i < parts.length; i++) {
                if(parts[i].constructor.name == "Terminal") {
                    terminalsCheck.push(parts[i].tokenName);
                }
                else {
                    nonTerminalsCheck.push(parts[i].name);
                }
            }
            
            if(debugCFG) {
                console.log("terminals check:");
                console.log(terminalsCheck);
                console.log("non terminals check:");
                console.log(nonTerminalsCheck);
            }

            let terminals = [];
            let nonTerminals = [];

            if(terminalsCheck.length > 0) {
                let current = [];
                
                for(let i = 0; i < context.length; i++) {
                    // console.log("\n-----\ncurrent context token:");
                    // console.log(context[i]);

                    if(terminalsCheck.includes(context[i].name)) {
                        // console.log("part IS a terminal");

                        let value = (context[i].value == null) ? 
                            context[i].name : context[i].value;
                        
                        terminals.push(value);
                        nonTerminals.push(current);

                        current = [];
                    }
                    else {
                        current.push(context[i]);
                        // console.log("part is NOT a terminal");
                    }
                }
                if(current.length > 0) {
                    nonTerminals.push(current);
                }

                console.log("\nTERMINALS / NON-TERMINALS:");
                console.log(terminals);
                console.log(nonTerminals);

                console.log("\n");
                if(
                    (terminals.length == terminalsCheck.length) && 
                    (nonTerminals.length == nonTerminalsCheck.length)
                ) {
                    console.log("FOUND MATCH");
                    
                    foundMatch = true;
                    addTo.push(cfg[index].generateNode(nonTerminals, terminals));
                }
                else {
                    console.log("NO MATCH");
                    
                    foundMatch = false;
                }
            }
            else {
                console.log("there are no terminals");

                nonTerminals.push(context);
                
                foundMatch = true;
                addTo.push(cfg[index].generateNode(nonTerminals, terminals));
            }

            ++index;

            if(foundMatch) {
                break;
            }
        }
        else {
            ++index
        }
    }
}

// function checkParseAgain(check) {
//     for(let i = 0; i < check.children.length; i++) {
//         if(check.children[i].constructor.name == "Token") {
//             return [true];
//         }
//         else {
//             let innerCheck = checkParseAgain(check.children[i]);
//             if(innerCheck) {
//                 return true;
//             }
//         }
//     }

//     return [false];
// }

function tempPrint(toPrint, level) {
    console.log(("....").repeat(level), toPrint);

    for(let i = 0; i < toPrint.children.length; i++) {
        tempPrint(toPrint.children[i], level + 1);
    }
}

let tree = [];
let debugCFG = false;
module.exports.parse = function(tokenStream) {
    parseLoop(tree, tokenStream, "");

    console.log("\n\nTREE:");
    for(let i = 0; i < tree.length; i++) {
        tempPrint(tree[i], 0);
    }
    // console.log(tree);

    // check if need to parse again
    // let again = [];

    // for(let i = 0; i < tree.length; i++) {
    //     again = checkParseAgain(tree[i]);

    //     if(again[0]) {
    //         break;
    //     }
    // }

    // if(again[0]) {

    // }

    // console.log("Again?", again);
}

module.exports.print = function(parseTree) {
    for(let i = 0; i < tree.length; i++) {
        try {
            console.log(tree[i].print(0));
        }
        catch(exception) {
            console.error("FAILED TO PARSE:");
            console.log("AT: " + tree[i]);
            console.log(exception);
        }
    }
    
    let a = 5;
}