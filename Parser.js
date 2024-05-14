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

// create context-free grammar
let cfg = [];

// the actual CFG rules are defined here
function generateCFG() {
    let rule = null;

    rule = new Rule("statement", [
        new Terminal("NUMTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("term"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        console.log("NT");
        console.log(nonTerminals);

        let type = terminals[0];

        let varName = terminals[1];

        let value = [];
        parseLoop(value, nonTerminals[3], "expression");

        return new nodes.DeclarationAssignment(
            type, 
            varName, 
            value[0]
        );
    });
    cfg.push(rule);
    
    rule = new Rule("expression", [
        new NonTerminal("expression"), 
        new Terminal("PLUS"), 
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        console.log("Parsed plus expression");

        let left = [];
        parseLoop(left, nonTerminals[0], "expression");

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
        console.log("Parsed minus expression");

        let left = [];
        parseLoop(left, nonTerminals[0], "expression");

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
        console.log("Parsed expression to be term");
        let all = [];
        parseLoop(all, nonTerminals[0], "term");

        return new nodes.Term(all[0]);
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new NonTerminal("factor")
    ], 
    function(nonTerminals, terminals) {
        console.log("Parsed term to be factor");
        if(nonTerminals[0].length == 1) {
            return new nodes.Num(nonTerminals[0][0].value);
        }
        else {
            throw new Error("Parsing failed");
        }
    }
    )
    cfg.push(rule);
}
generateCFG();


function parseLoop(addTo, context, nonTerminal) {
    let index = 0;

    // go through every rule in cfg to find a match
    while(index < cfg.length) {
        console.log("-----");
        console.log("checking");
        console.log(context);
        console.log("nonTerminal = " + nonTerminal);

        if(
            (cfg[index].name == nonTerminal) || 
            (nonTerminal == "")
        ) {
            let parts = cfg[index].parts;
            console.log("parts");
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

            let terminals = [];
            let nonTerminals = [];

            if(terminalsCheck.length > 0) {
                let current = [];
                
                let foundTerminal = false;
                for(let i = 0; i < context.length; i++) {
                    if(
                        terminalsCheck.includes(context[i].name) && 
                        terminals.length < terminalsCheck.length
                    ) {
                        foundTerminal = true;

                        let value = (context[i].value == null) ? 
                            context[i].name : context[i].value;
                        
                        terminals.push(value);
                        nonTerminals.push(current);

                        current = [];
                    }
                    else {
                        current.push(context[i]);
                    }
                }
                if(current.length > 0) {
                    nonTerminals.push(current);
                }

                if(foundTerminal && (terminals.length == terminalsCheck.length)) {
                    console.log("found match");
                    foundMatch = true;
                    addTo.push(cfg[index].generateNode(nonTerminals, terminals));
                }
                else {
                    console.log("no match");
                    foundMatch = false;
                }
            }
            else {
                console.log("found match");
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
            console.log("no match");
            ++index
        }

        console.log("\n");
    }
}

function debugPrint(toPrint, level) {
    console.log(("....").repeat(level), toPrint);

    try {
        for(let i = 0; i < toPrint.children.length; i++) {
            debugPrint(toPrint.children[i], level + 1);
        }
    }
    catch {
        console.log(("....").repeat(level + 1) + " no children");
    }
}

let tree = [];
module.exports.parse = function(tokenStream) {
    parseLoop(tree, tokenStream, "");

    console.log("\n");
    for(let i = 0; i < tree.length; i++) {
        debugPrint(tree[i], 0);
    }
}

module.exports.print = function(parseTree) {
    for(let i = 0; i < tree.length; i++) {
        console.log(tree[i].print(0));
        // try {
        // }
        // catch(exception) {
        //     console.error("\nFAILED TO PARSE:");
        //     console.log(tree[i]);
        // }
    }
}