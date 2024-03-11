/**
 * Context-Free Grammar Structure:
 * -Statement is a 
 */

// context-free grammar class
class Statement {
    constructor(name) {
        this.name = name;
        this.rules = [];
    }
}

// context-free grammar class
class Rule {
    // elems is an array of the terminals and/ or nonterminals that make up this rule
    constructor(elems) {
        this.elems = elems;
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

// everything in this function is only in a function so it can be collapsed
function generateCFG() {
    // reference to current statement, ussed for allowing easier adding of rules to statements when created
    let stmtn;
    // program is starting point
    stmtn = new Statement("program");

    stmtn.rules.push(new Rule([
        new NonTerminal("statement list")
    ]));

    cfg.push(stmtn);

    // --------------------

    stmtn = new Statement("statement list");

    stmtn.rules.push(new Rule([
        new NonTerminal("expression")
    ]));

    stmtn.rules.push(new Rule([
        new Terminal("NUMTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("expression"), 
        new Terminal("SEMICOLON")
    ]));
    
    stmtn.rules.push(new Rule([
        new Terminal("PRINT"), 
        new NonTerminal("expression")
    ]));

    cfg.push(stmtn);

    // --------------------

    stmtn = new Statement("expression");

    stmtn.rules.push(new Rule([
        new Terminal("ID")
    ]));

    stmtn.rules.push(new Rule([
        new NonTerminal("expression"), 
        new Terminal("PLUS"), 
        new NonTerminal("expression")
    ]));

    stmtn.rules.push(new Rule([
        new NonTerminal("expression"), 
        new Terminal("MINUS"), 
        new NonTerminal("expression")
    ]));
    
    cfg.push(stmtn);
}
generateCFG();

class Node {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.children = [];
    }

    print(level) {
        let indent = "";
        for(let i = 0; i < level; i++) {
            indent += "..";
        }
        
        console.log(indent + this.name + ": " + this.value);
        
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].print(level + 1);
        }
    }
}

let tree;
module.exports.parse = function(tokenStream) {
    tree = new Node("program", null);
}

module.exports.print = function(parseTree) {
    let level = 0;
    
    tree.print(level);
}