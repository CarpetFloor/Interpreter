// make sure checking if non terminal equals non terminal listed in cfg rule

const { debug } = require("console");
let nodes = require("./TreeNodes");
const { stat } = require("fs");

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

// context-free grammar expressionclass
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

    rule = new Rule("statementlist", [
        new NonTerminal("statement"), 
        new NonTerminal("statementlist")
    ], 
    function(nonTerminals, terminals) {
        let statements = [];
        let passContext = [...nonTerminals];
        let statementCheck = parseLoop(passContext, "statement");
        
        while((statementCheck != undefined) || (passContext.length != 0)) {
            statements.push(statementCheck[1]);
            
            passContext.splice(0, statementCheck[0] + 1);

            statementCheck = parseLoop(passContext, "statement");
        }

        let match = true;
        for(let i = 0; i < statements.length; i++) {
            if(statements[i] == undefined) {
                match = false;
                break;
            }
        }

        if(match) {
            return new nodes.StatementList(statements);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("PRINT"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("expression"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals[0], "expression");
        if(check != undefined) {
            let value = check[1];

            return new nodes.Print(
                value
            )
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("expression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let varName = terminals[1];

        let check = parseLoop(nonTerminals[0], "expression");
        if(check != undefined) {
            let value = check[1];
            
            return new nodes.Assignment(
                varName, 
                value
            )
        }
        else {
            return undefined;
        }
        
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("NUMTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("expression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {        
        let type = terminals[0];
        let varName = terminals[1];

        let check = parseLoop(nonTerminals[0], "expression");
        if(check != undefined) {
            let value = check[1];
            
            return new nodes.DeclarationAssignment(
                type, 
                varName, 
                value
            )
        }
        else {
            return undefined;
        }
        
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("INCREMENTASSIGN"), 
        new NonTerminal("expression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals[0], "expression");
        
        if(check != undefined) {
            let varName = terminals[0];
            let increment = check[1];
            
            return new nodes.IncrementAssignment(
                varName, 
                increment
            );
        }
        else {
            return undefined;
        }
        
    });
    cfg.push(rule);

    rule = new Rule("expression", [
        new NonTerminal("expression"), 
        new Terminal("PLUS"), 
        new NonTerminal("term")
    ], 
    function(nonTerminals, terminals) {
        let left = parseLoop(nonTerminals[0], "expression");
        let right = parseLoop(nonTerminals[1], "expression");

        if((left != undefined) && (right != undefined)) {
            return new nodes.BinaryOperatorExpression("+", left[1], right[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("expression", [
        new NonTerminal("term")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals, "term");
        
        if(check != undefined) {
            return new nodes.Term(check[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new Terminal("NUM")
    ], 
    function(nonTerminals, terminals) {
        return new nodes.Num(terminals[0]);
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new Terminal("ID")
    ], 
    function(nonTerminals, terminals) {
        return new nodes.IdReference(terminals[0]);
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("STRINGTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("stringexpression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {        
        let type = terminals[0];
        let varName = terminals[1];

        let check = parseLoop(nonTerminals[0], "stringexpression");
        if(check != undefined) {
            let value = check[1];
            
            return new nodes.DeclarationAssignment(
                type, 
                varName, 
                value
            )
        }
        else {
            return undefined;
        }
        
    });
    cfg.push(rule);

    rule = new Rule("stringexpression", [
        new NonTerminal("stringterm"), 
        new Terminal("PLUS"), 
        new NonTerminal("stringexpression")
    ], 
    function(nonTerminals, terminals) {
        let left = parseLoop(nonTerminals[0], "stringexpression");
        let right = parseLoop(nonTerminals[1], "stringexpression");

        if((left != undefined) && (right != undefined)) {
            return new nodes.BinaryOperatorExpression("+", left[1], right[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("stringexpression", [
        new NonTerminal("stringterm")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals, "stringterm");
        
        if(check != undefined) {
            return new nodes.StringTerm(check[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("stringterm", [
        new Terminal("STRING")
    ], 
    function(nonTerminals, terminals) {
        return new nodes.String(terminals[0]);
    });
    cfg.push(rule);

    rule = new Rule("stringterm", [
        new Terminal("ID")
    ], 
    function(nonTerminals, terminals) {
        return new nodes.IdReference(terminals[0]);
    });
    cfg.push(rule);
}
generateCFG();

let debugParseLoop = false;
let failed = false;

function parseLoop(context, nonTerminal) {
    if(!(failed)) {
        let lastIndex = -1;

        try {
            let index = 0;

            // go through every rule in cfg to find a match
            while(index < cfg.length) {
                if(debugParseLoop) {
                    console.log("-----");
                    console.log("checking");
                    console.log(context);
                    console.log("nonTerminal = " + nonTerminal);
                }
                
                let foundMatch = true;
                let nonTerminals = [];
                let terminals = [];
                let lastContextIndex = 0;

                if(
                    (cfg[index].name == nonTerminal) || 
                    (nonTerminal == "")
                ) {
                    let parts = cfg[index].parts;
                    lastIndex = index;

                    if(debugParseLoop) {
                        console.log("parts");
                        console.log(parts);
                    }

                    let currentNonTerminal = [];
                    let partIndex = 0;

                    if(debugParseLoop) {
                        console.log("__________");
                    }

                    let noTerminals = true;
                    for(let i = 0; i < parts.length; i++) {
                        if(parts[i].constructor.name == "Terminal") {
                            noTerminals = false;
                        }
                    }

                    if(debugParseLoop) {
                        console.log("");
                        console.log("noTerminals?", noTerminals);
                        console.log("");
                    }

                    if(noTerminals) {
                        nonTerminals = context;

                        foundMatch = true;
                    }
                    else {
                        let terminalsCount = 0;
                        for(let i = 0; i < parts.length; i++) {
                            if(parts[i].constructor.name == "Terminal") {
                                ++terminalsCount;
                            }
                        }

                        lastContextIndex = 0;
                        let currentNonTerminal = [];
                        let secondNonTerminal = [];

                        for(let i = 0; i < context.length; i++) {
                            if(parts[partIndex].constructor.name == "Terminal") {
                                if(context[i].name == parts[partIndex].tokenName) {
                                    ++partIndex

                                    if(context[i].value != null) {
                                        terminals.push(context[i].value);
                                    }
                                    else {
                                        terminals.push(context[i].name);
                                    }
                                }
                                else {
                                    foundMatch = false;
                                    break;
                                }
                            }
                            else {
                                if(i == 0) {
                                    currentNonTerminal.push(context[i]);
                                }
                                if(partIndex < parts.length - 1) {
                                    if(context[i].name == parts[partIndex + 1].tokenName) {
                                        partIndex += 2;

                                        if(secondNonTerminal.length > 0) {
                                            nonTerminals.push(secondNonTerminal);
                                        }
                                        else {
                                            nonTerminals.push(currentNonTerminal);
                                        }
                                        currentNonTerminal = [];

                                        if(context[i].value != null) {
                                            terminals.push(context[i].value);
                                        }
                                        else {
                                            terminals.push(context[i].name);
                                        }
                                    }
                                    else {
                                        secondNonTerminal.push(context[i]);
                                    }
                                }
                                else {
                                    currentNonTerminal.push(context[i]);
                                }
                            }

                            if(partIndex > parts.length - 1) {
                                break;
                            }

                            ++lastContextIndex;
                        }

                        if(currentNonTerminal.length > 0) {
                            nonTerminals.push(currentNonTerminal);
                        }

                        if(terminals.length != terminalsCount) {
                            foundMatch = false;
                        }
                        else if(debugParseLoop) {
                            console.log("terminals");
                            console.log(terminals);
                            console.log("nonTerminals");
                            console.log(nonTerminals);
                        }
                    }
                }
                else {
                    foundMatch = false;
                }

                if(foundMatch) {
                    if(debugParseLoop) {
                        console.log("found MATCH");
                    }

                    return [lastContextIndex, cfg[index].generateNode(nonTerminals, terminals)];
                }else {
                    if(debugParseLoop) {
                        console.log("did NOT find match");
                    }

                    ++index;
                    
                    if(debugParseLoop) {
                        console.log("\n");
                    }

                }
            }
        }
        catch(exception) {
            failed = true;

            console.log("");

            console.log("FAILED PARSING");
            console.log("\nGiven context:");
            console.log(context);

            if(nonTerminal.length > 0) {
                console.log("\nTrying to find");
                console.log(nonTerminal);
            }

            if(lastIndex != -1) {
                console.log("\nTrying to match with:");
                console.log(cfg[lastIndex].name);
                console.log(cfg[lastIndex].parts);
            }

            console.log("");
        }
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
    let check = parseLoop(tokenStream, "");
    if(check != undefined) {
        tree.push(check[1]);
    }

    // console.log("\n");
    // console.log("original check");
    // console.log(check);

    // for(let i = 0; i < tree.length; i++) {
    //     debugPrint(tree[i], 0);
    // }
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