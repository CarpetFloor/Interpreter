let nodes = require("./Nodes");

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

// create context-free grammar
let cfg = [];

// the actual CFG rules are defined here
function generateCFG() {
    let name = "program";
    let rule = new Rule(name, [
        [
            new NonTerminal("expression")
        ]
    ], 
    );
    cfg.push(rule);

    name = "expression";
    rule = new Rule(name, [
        [
            new NonTerminal(name), 
            new Terminal("PLUS"), 
            new NonTerminal(name)
        ], 
        [
            new NonTerminal(name), 
            new Terminal("MINUS"), 
            new NonTerminal(name)
        ], 
        [
            new NonTerminal("term")
        ]
    ], 
    function(context) {
        let left = null;
        let right = null;
        let possibleOperations = ["PLUS", "MINUS"];
        let operationMap = new Map();
        operationMap.set("PLUS", "+");
        operationMap.set("MINUS", "-");
        let operation = null;

        for(let i = 0; i < context.length; i++) {
            if(possibleOperations.includes(context[i].name)) {
                left = new nodes.Num(context[i - 1].value);
                right = new nodes.Num(context[i + 1].value);
                
                operation = operationMap.get(context[i].name);
            }
        }

        return new nodes.BinaryOperatorExpression(operation, left, right);
    });
    cfg.push(rule);

    name = "term";
    rule = new Rule(name, [
        [
            new NonTerminal(name), 
            new Terminal("TIMES"), 
            new NonTerminal(name)
        ], 
        [
            new NonTerminal(name), 
            new Terminal("DIVIDES"), 
            new NonTerminal(name)
        ], 
        [
            new NonTerminal("factor")
        ]
    ], 
    name);
    cfg.push(rule);

    name = "factor";
    rule = new Rule(name, [
        [
            new Terminal("NUM")
        ]
    ], 
    name);
    cfg.push(rule);
}
generateCFG();

let tree = [];
let debugCFG = false;
module.exports.parse = function(tokenStream) {
    let index = 1;
    let context = tokenStream;

    // go through every rule in cfg to find a match
    // while(index < cfg.length) {
        let rules = cfg[index].parts;

        if(debugCFG) {
            console.log("\nRULES:");
            console.log(rules);
            console.log("__________");
        }
        
        let foundMatch = false;
        
        /**
         * Go through every part of the current rule. A part is the stuff between the ors. 
         * For instance, given the following rule:
         * expression -> expression PLUS expression | expression MINUS expression | term
         * there would be three parts: the plus part, the minus part, and the term part.
         */
        for(let currentPart = 0; currentPart < rules.length; currentPart++) {
            let terminalsCheck = [];

            // get all of the terminals in the current part of the current rule
            for(let indexOfCurrentPart = 0; indexOfCurrentPart < rules[currentPart].length; indexOfCurrentPart++) {
                if(debugCFG) {
                    console.log(rules[currentPart][indexOfCurrentPart]);
                }

                if(rules[currentPart][indexOfCurrentPart].constructor.name == "Terminal") {
                    terminalsCheck.push(rules[currentPart][indexOfCurrentPart].tokenName);
                }
            }

            /**
             * If there are any terminals that in the current part of the current rule, make sure 
             * that the current context contains all of those terminals
             */
            if(terminalsCheck.length > 0) {
                if(debugCFG) {
                    console.log("\nCONTEXT:");
                    console.log(context);

                    console.log("checking terminals:");
                    console.log(terminalsCheck);
                }

                for(let i = 0; i < context.length; i++) {
                    if(terminalsCheck.includes(context[i].name)) {
                        if(debugCFG) {
                            console.log("FOUND " + context[i].name);
                        }

                        let index = terminalsCheck.indexOf(context[i].name);
                        terminalsCheck.splice(index, 1);

                        if(debugCFG) {
                            console.log("terminals:");
                            console.log(terminalsCheck);
                        }
                    }
                }

                if(terminalsCheck.length == 0) {
                    if(debugCFG) {
                        console.log("MATCH");
                    }

                    foundMatch = true;
                    tree.push(cfg[index].generateNode(context));
                    
                    break;
                }
                else if(debugCFG) {
                    console.log("NO MATCH");
                }
            }
            /**
             * When there are no terminals in the current part of the current rule. 
             * Just have to simply create a new node with the same context as current context.
             */
            else {
                foundMatch = true;
                break;
            }

            if(debugCFG) {
                console.log(terminal, "(terminal?)");
                console.log(tree);

                console.log("-----");
            }
        }

        // ++index;
    // }
}

module.exports.print = function(parseTree) {
    for(let i = 0; i < tree.length; i++) {
        console.log(tree[i].print(0));
    }
}