// make sure checking if non terminal equals non terminal listed in cfg rule

const { debug } = require("console");
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

    rule = new Rule("statementlist", [
        new NonTerminal("statement"), 
        new NonTerminal("statementlist")
    ], 
    function(nonTerminals, terminals) {
        console.log("RECEIVING");
        console.log(nonTerminals);

        return new nodes.StatementList(nonTerminals);
    });
    // cfg.push(rule);

    rule = new Rule("statementlist", [
        new NonTerminal("statement")
    ], 
    function(nonTerminals, terminals) {
        console.log("SECOND");
        return new nodes.StatementList(nonTerminals);
    });
    // cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("NUMTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("NUM"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let type = terminals[0];
        let varName = terminals[1];
        let value = new nodes.Num(terminals[3]);
        
        return new nodes.DeclarationAssignment(
            type, 
            varName, 
            value
        )
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("STRINGTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("STRING"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let type = terminals[0];
        let varName = terminals[1];
        let value = new nodes.String(terminals[3]);
        
        return new nodes.DeclarationAssignment(
            type, 
            varName, 
            value
        )
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("NUM"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let varName = terminals[0];
        let value = new nodes.Num(terminals[2]);
        
        return new nodes.Assignment(
            varName, 
            value
        )
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("STRING"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        console.log(terminals);
        let varName = terminals[0];
        let value = new nodes.String(terminals[2]);
        
        return new nodes.Assignment(
            varName, 
            value
        )
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("PRINT"), 
        new Terminal("OPENPAREN"), 
        new Terminal("NUM"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let value = new nodes.Num(terminals[2]);
        
        return new nodes.Print(
            value
        )
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("PRINT"), 
        new Terminal("OPENPAREN"), 
        new Terminal("STRING"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let value = new nodes.String(terminals[2]);
        
        return new nodes.Print(
            value
        )
    });
    cfg.push(rule);
}
generateCFG();

let debugParseLoop = false;
function parseLoop(context, nonTerminal) {
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
                let actualContext = [...context];
                let match = true;
                let lastContextIndex = 0;
                let nonTerminals = [];

                for(let i = 0; i < parts.length; i++) {
                    let check = parseLoop(actualContext, parts[0].name);

                    if((check != undefined) && (parts[i].name != nonTerminal)) {
                        nonTerminals.push(check[1]);
                        ++check[0];
                        lastContextIndex += check[0];

                        actualContext.splice(0, check[0]);

                        if((actualContext.length < 1) && (i < parts.length - 1)) {
                            match = false;

                            break;
                        }
                    }
                    else {
                        match = false;

                        break;
                    }

                }

                if(match) {
                    return [lastContextIndex, cfg[index].generateNode(nonTerminals, terminals)]
                }
                else {
                    foundMatch = false;
                    ++index;
                }
            }
            else {
                let terminalsCount = 0;
                for(let i = 0; i < parts.length; i++) {
                    if(parts[i].constructor.name == "Terminal") {
                        ++terminalsCount;
                    }
                }

                lastContextIndex = 0;

                for(let i = 0; i < context.length; i++) {
                    if(partIndex > parts.length - 1) {
                        foundMatch = false;
                        
                        break;
                    }

                    let partType = parts[partIndex].constructor.name;
                    
                    if(debugParseLoop) {
                        console.log("context, part");
                        console.log("partIndex", partIndex);
                        console.log("partType", partType)
                        console.log(context[i])
                        console.log(parts[partIndex]);
                        console.log("-----");
                    }
                    
                    if(partType == "Terminal") {
                        if(parts[partIndex].tokenName == context[i].name) {
                            foundMatch = true;

                            if(currentNonTerminal.length > 0) {
                                nonTerminals.push(currentNonTerminal);
                                currentNonTerminal = [];
                            }

                            if(context[i].value != null) {
                                terminals.push(context[i].value);
                            }
                            else {
                                terminals.push(context[i].name);
                            }

                            ++partIndex;

                            ++lastContextIndex;
                        }
                        else {
                            foundMatch = false;

                            break;
                        }
                    }
                    else {
                        currentNonTerminal.push(context[i]);
                        
                        ++lastContextIndex;
                    }
                }

                if(terminals.length != terminalsCount) {
                    foundMatch = false;

                    ++index;
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
            ++index
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

    console.log("\n");
    console.log("original check");
    console.log(check);

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