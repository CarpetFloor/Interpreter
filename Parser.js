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

// create context-free grammar
let cfg = [];

// the actual CFG rules are defined here
function generateCFG() {
    let name = "";
    let rule = null;
    
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
    function(context) {return (new GenerateNode(context)).expression();});
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
    function(context) {return (new GenerateNode(context)).expression();});
    cfg.push(rule);

    name = "fator";
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
    function(context) {return (new GenerateNode(context)).expression();});
    cfg.push(rule);
}
generateCFG();

let tree = [];
let debugCFG = false;
module.exports.parse = function(tokenStream) {
    let index = 0;
    let context = tokenStream;

    // go through every rule in cfg to find a match
    while(index < cfg.length) {
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
                if(debugCFG) {
                    console.log("SINGLE NON-TERMINAL MATCH");
                }

                foundMatch = true;
                tree.push(cfg[index].generateNode(context));
                break;
            }

            if(debugCFG) {
                console.log(tree);

                console.log("-----");
            }
        }

        ++index;
        
        if(foundMatch) {
            break;
        }
    }
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
}