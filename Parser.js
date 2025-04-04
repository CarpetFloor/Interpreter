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

    rule = new Rule("whilelooplist", [
        new NonTerminal("whileloop"), 
        new NonTerminal("whilelooplist")
    ], 
    function(nonTerminals, terminals) {
        let whileloops = [];
        let passContext = [...nonTerminals];
        let whileloopCheck = parseLoop(passContext, "whileloop");
        
        while((whileloopCheck != undefined) || (passContext.length != 0)) {
            whileloops.push(whileloopCheck[1]);
            
            passContext.splice(0, whileloopCheck[0] + 1);

            whileloopCheck = parseLoop(passContext, "whileloop");
        }

        let match = true;
        for(let i = 0; i < whileloops.length; i++) {
            if(whileloops[i] == undefined) {
                match = false;
                break;
            }
        }

        if(match) {
            return new nodes.WhileLoopList(whileloops);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    // nested while loops
    rule = new Rule("whileloop", [
        new Terminal("WHILE"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("comparison"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("OPENCURLY"), 
        new NonTerminal("statementlist"),
        new Terminal("CLOSECURLY")
    ], 
    function(nonTerminals, terminals) {
        let whileloops = [];
        
        console.log("----------");
        console.log("----------");
        console.log("Parisng whilelooplist");
        console.log("----------");
        console.log("----------");

        console.log("\tnonTerminals");
        console.log(nonTerminals);
        console.log("-----");
        console.log("\tterminals");
        console.log(terminals);

        // first make sure comparison of outter while loop valid
        let comparisonCheck = parseLoop(nonTerminals[0], "comparison");
        if(comparisonCheck != undefined) {
            // make sure inner while loop exists
            let body = nonTerminals[1];
            let bodyElements = [];

            console.log("==========");
            console.log("==========");
            console.log("==========");
            console.log("==========");
            console.log("==========");

            console.log("\tCOMPARISON");
            console.log(comparisonCheck);

            /**
             * keep array that body elements are sequentially added to.
             * go through body
             */
            let currentTokens = [];
            for(let i = 0; i < body.length; i++) {
                console.log("\t", i, body[i]);

                if(body[i].name == "WHILE") {
                    // check if currentTokens is a valid statement list
                    let statementListCheck = parseLoop(currentTokens, "statementlist");
                    // console.log("STATEMENT LIST CHECK");
                    // console.log(currentTokens);
                    // console.log("--");
                    // console.log(statementListCheck);

                    if(statementListCheck == undefined) {
                        return undefined;
                    }

                    bodyElements.push(statementListCheck);
                    currentTokens = [];

                    // find entire inner-loop context
                    let loopIndex = {
                        start: i,
                        end: -1
                    };

                    for(let j = body.length - 1; j > loopIndex.start; j--) {
                        if(body[j].name == "CLOSECURLY") {
                            loopIndex.end = j;
                        }
                    }

                    console.log("LOOP INDICES:");
                    console.log(loopIndex.start, loopIndex.end);

                    if(loopIndex.end == -1) {
                        return undefined;
                    }

                    // recursively check inner while loops by calling method 
                    // and passing inner loop context
                }
                else if(i == body.length - 1) {
                    // NOT TESTED
                    let statementListCheck = parseLoop(currentTokens, "statementlist");

                    if(statementListCheck == undefined) {
                        return undefined;
                    }

                    bodyElements.push(statementListCheck);
                }
                else {
                    currentTokens.push(body[i]);
                }

            }

        }
        
        return undefined;
    });
    // cfg.push(rule);

    rule = new Rule("whileloop", [
        new Terminal("WHILE"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("comparison"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("OPENCURLY"), 
        new NonTerminal("statementlist"), 
        new Terminal("CLOSECURLY")
    ], 
    function(nonTerminals, terminals) {
        let comparisonCheck = parseLoop(nonTerminals[0], "comparison");
        let statementListCheck = parseLoop(nonTerminals[1], "statementlist");
        
        if(
            (comparisonCheck != undefined) && 
            (statementListCheck != undefined)
        ) {
            let comparison = comparisonCheck[1];

            let statementList = statementListCheck[1];

            return new nodes.WhileLoop(
                comparison, 
                statementList
            );
        }
        else {
            return undefined;
        }
    }
    );
    cfg.push(rule);

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
        new NonTerminal("stringexpression"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals[0], "stringexpression");

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
        new Terminal("LISTTYPE"), 
        new Terminal("OPENPIPE"), 
        new Terminal("NUMTYPE"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("OPENPIPE"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let varName = terminals[4];
        let listType = terminals[2];

        return new nodes.DeclarationAssignment(
            "list", 
            varName, 
            new nodes.List(listType)
        );
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("LISTTYPE"), 
        new Terminal("OPENPIPE"), 
        new Terminal("STRINGTYPE"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("OPENPIPE"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let varName = terminals[4];
        let listType = terminals[2];

        return new nodes.DeclarationAssignment(
            "list", 
            varName, 
            new nodes.List(listType)
        );
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("DOT"), 
        new Terminal("SET"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("expression"), 
        new Terminal("COMMA"), 
        new NonTerminal("expression"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let list = terminals[0];

        let indexCheck = parseLoop(nonTerminals[0], "expression");
        let setCheck = parseLoop(nonTerminals[1], "expression");

        if((indexCheck != undefined) && (setCheck != undefined)) {
            let index = indexCheck[1];
            let value = setCheck[1];
            
            return new nodes.ListElementSet(
                list, 
                index, 
                value
            );
        }
        else {
            return undefined;
        }

    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("DOT"), 
        new Terminal("ADDKEYWORD"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("expression"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let list = terminals[0];

        let check = parseLoop(nonTerminals[0], "expression");

        if(check != undefined) {
            let value = check[1];
            
            return new nodes.ListAdd(
                list, 
                value
            );
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
        new Terminal("MULTINCREMENTASSIGN"), 
        new NonTerminal("expression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals[0], "expression");
        
        if((check != undefined) && (check[1].children != undefined)) {
            let varName = terminals[0];
            let increment = check[1];
            
            return new nodes.MultIncrementAssignment(
                varName, 
                increment
            );
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
        
        if((check != undefined) && (check[1].children != undefined)) {
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

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("DECREMENTASSIGN"), 
        new NonTerminal("expression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals[0], "expression");
        
        if((check != undefined) && (check[1].children != undefined)) {
            let varName = terminals[0];
            let increment = check[1];
            
            return new nodes.DecrementAssignment(
                varName, 
                increment
            );
        }
        else {
            return undefined;
        }
        
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("INCREMENTASSIGN"), 
        new NonTerminal("stringexpression"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        console.log("string here");
        let check = parseLoop(nonTerminals[0], "stringexpression");
        
        if((check != undefined) && (check[1].children != undefined)) {
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
        new Terminal("ID"), 
        new Terminal("DOT"), 
        new Terminal("GET"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("expression"), 
        new Terminal("CLOSEPAREN")
    ], 
    function(nonTerminals, terminals) {
        let list = terminals[0];

        let check = parseLoop(nonTerminals[0], "expression");

        if(check != undefined) {
            let index = check[1];

            return new nodes.ListElementReference(
                list, 
                index
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
        new NonTerminal("expression"), 
        new Terminal("MINUS"), 
        new NonTerminal("term")
    ], 
    function(nonTerminals, terminals) {
        let left = parseLoop(nonTerminals[0], "expression");
        let right = parseLoop(nonTerminals[1], "expression");

        if((left != undefined) && (right != undefined)) {
            return new nodes.BinaryOperatorExpression("-", left[1], right[1]);
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

    rule = new Rule("comparison", [
        new NonTerminal("comparison"), 
        new Terminal("AND"),
        new NonTerminal("comparison")
    ], 
    function(nonTerminals, terminals) {
        let leftContext = [...nonTerminals[0]];
        let leftNames = [];
        for(let token of leftContext) {
            leftNames.push(token.name);
        }

        let rightContext = [...nonTerminals[1]];
        let rightNames = [];
        for(let token of rightContext) {
            rightNames.push(token.name);
        }

        // determine left comparison nots
        let leftNotCount = 0;

        while(
            (leftContext[0].name == "NOT") && 
            (leftContext[1].name == "OPENPIPE") && 
            (leftContext[leftContext.length - 1].name == "CLOSEPIPE")
        ) {
            ++leftNotCount;
            leftContext.splice(0, 2);
            leftContext.splice(leftContext.length - 1, 1);
        }

        // determine right comparison nots
        let rightNotCount = 0;

        while(
            (rightContext[0].name == "NOT") && 
            (rightContext[1].name == "OPENPIPE") && 
            (rightContext[rightContext.length - 1].name == "CLOSEPIPE")
        ) {
            ++rightNotCount;
            rightContext.splice(0, 2);
            rightContext.splice(rightContext.length - 1, 1);
        }

        // determine nots around entire or
        let outterNots = 0;

        while(
            (leftContext[0].name == "NOT") && 
            (leftContext[1].name == "OPENPIPE") && 
            (rightContext[rightContext.length - 1].name == "CLOSEPIPE")
        ) {
            ++outterNots;
            leftContext.splice(0, 2);
            rightContext.splice(rightContext.length - 1, 1);
        }

        let leftCheck = parseLoop(leftContext, "comparison");
        let rightCheck = parseLoop(rightContext, "comparison");


        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            let left = leftCheck[1];
                
            if((leftNotCount % 2) != 0) {
                left = new nodes.Not(left);
            }

            let right = rightCheck[1];
            
            if((rightNotCount % 2) != 0) {
                right = new nodes.Not(right);
            }

            let comparisonNode = new nodes.Comparison(
                "AND", 
                left, 
                right
            );
            
            if((outterNots % 2) == 0) {
                return comparisonNode;
            }
            else {
                return new nodes.Not(comparisonNode);
            }
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [
        new NonTerminal("comparison"), 
        new Terminal("OR"),
        new NonTerminal("comparison")
    ], 
    function(nonTerminals, terminals) {
        let leftContext = [...nonTerminals[0]];
        let leftNames = [];
        for(let token of leftContext) {
            leftNames.push(token.name);
        }

        let rightContext = [...nonTerminals[1]];
        let rightNames = [];
        for(let token of rightContext) {
            rightNames.push(token.name);
        }

        // determine left comparison nots
        let leftNotCount = 0;

        while(
            (leftContext[0].name == "NOT") && 
            (leftContext[1].name == "OPENPIPE") && 
            (leftContext[leftContext.length - 1].name == "CLOSEPIPE")
        ) {
            ++leftNotCount;
            leftContext.splice(0, 2);
            leftContext.splice(leftContext.length - 1, 1);
        }

        // determine right comparison nots
        let rightNotCount = 0;

        while(
            (rightContext[0].name == "NOT") && 
            (rightContext[1].name == "OPENPIPE") && 
            (rightContext[rightContext.length - 1].name == "CLOSEPIPE")
        ) {
            ++rightNotCount;
            rightContext.splice(0, 2);
            rightContext.splice(rightContext.length - 1, 1);
        }

        // determine nots around entire or
        let outterNots = 0;

        while(
            (leftContext[0].name == "NOT") && 
            (leftContext[1].name == "OPENPIPE") && 
            (rightContext[rightContext.length - 1].name == "CLOSEPIPE")
        ) {
            ++outterNots;
            leftContext.splice(0, 2);
            rightContext.splice(rightContext.length - 1, 1);
        }

        let leftCheck = parseLoop(leftContext, "comparison");
        let rightCheck = parseLoop(rightContext, "comparison");


        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            let left = leftCheck[1];
                
            if((leftNotCount % 2) != 0) {
                left = new nodes.Not(left);
            }

            let right = rightCheck[1];
            
            if((rightNotCount % 2) != 0) {
                right = new nodes.Not(right);
            }

            let comparisonNode = new nodes.Comparison(
                "OR", 
                left, 
                right
            );
            
            if((outterNots % 2) == 0) {
                return comparisonNode;
            }
            else {
                return new nodes.Not(comparisonNode);
            }
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [ 
        new Terminal("NOT"), 
        new Terminal("OPENPIPE"), 
        new NonTerminal("comparison"), 
        new Terminal("CLOSEPIPE")
    ], 
    function(nonTerminals, terminals) {
        console.log("DO WE EVER GET HERE???");
        console.log("DO WE EVER GET HERE???");
        console.log("DO WE EVER GET HERE???");
        console.log("DO WE EVER GET HERE???");
        console.log("DO WE EVER GET HERE???");

        // deal with directly-nested nots
        let context = [...nonTerminals[0]];
        
        console.log("\ncontext");
        console.log(nonTerminals);
        console.log("-----");
        console.log(context);

        let names = [];
        for(let token of context) {
            names.push(token.name);
        }

        let notCount = 1;
        if(
            (context[0].name == "NOT") && 
            !(names.includes("OR") || names.includes("AND"))
        ) {
            console.log("WE GOOD");
            console.log("WE GOOD");
            console.log("WE GOOD");
            console.log("WE GOOD");
            console.log("WE GOOD");
            while(
                (context[0].name == "NOT") && 
                (context[1].name == "OPENPIPE")
            ) {
                console.log("YUUUUUUUUUUP!");
                context.splice(0, 2);
                ++notCount;
            }
        }

        console.log("notCount", notCount);

        let comparisonCheck = parseLoop(context, "comparison");

        if(comparisonCheck != undefined) {
            let comparison = comparisonCheck[1];

            if((notCount % 2) == 0) {
                return comparison;
            }
            else {
                return new nodes.Not(
                    comparison
                );
            }
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [
        new NonTerminal("expression"), 
        new Terminal("LESSTHAN"),
        new NonTerminal("term")
    ], 
    function(nonTerminals, terminals) {
        let leftCheck = parseLoop(nonTerminals[0], "expression");
        let rightCheck = parseLoop(nonTerminals[1], "expression");

        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            return new nodes.Comparison(
                "<", 
                leftCheck[1], 
                rightCheck[1]
            );
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [
        new NonTerminal("expression"), 
        new Terminal("LESSTHAN"),
        new Terminal("ASSIGN"), 
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        let leftCheck = parseLoop(nonTerminals[0], "expression");
        let rightCheck = parseLoop(nonTerminals[1], "expression");

        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            return new nodes.Comparison(
                "<=", 
                leftCheck[1], 
                rightCheck[1]
            );
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [
        new NonTerminal("expression"), 
        new Terminal("GREATERTHAN"),
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        let leftCheck = parseLoop(nonTerminals[0], "expression");
        let rightCheck = parseLoop(nonTerminals[1], "expression");

        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            return new nodes.Comparison(
                ">", 
                leftCheck[1], 
                rightCheck[1]
            );
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [
        new NonTerminal("expression"), 
        new Terminal("GREATERTHAN"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        let leftCheck = parseLoop(nonTerminals[0], "expression");
        let rightCheck = parseLoop(nonTerminals[1], "expression");

        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            return new nodes.Comparison(
                ">=", 
                leftCheck[1], 
                rightCheck[1]
            );
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("comparison", [
        new NonTerminal("expression"), 
        new Terminal("ASSIGN"), 
        new Terminal("ASSIGN"), 
        new NonTerminal("expression")
    ], 
    function(nonTerminals, terminals) {
        let leftCheck = parseLoop(nonTerminals[0], "expression");
        let rightCheck = parseLoop(nonTerminals[1], "expression");


        if(
            (leftCheck != undefined) && 
            (rightCheck != undefined)
        ) {
            return new nodes.Comparison(
                "==", 
                leftCheck[1], 
                rightCheck[1]
            );
        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new NonTerminal("term"), 
        new Terminal("TIMES"), 
        new NonTerminal("factor")
    ], 
    function(nonTerminals, terminals) {
        let left = parseLoop(nonTerminals[0], "term");
        let right = parseLoop(nonTerminals[1], "term");

        if((left != undefined) && (right != undefined)) {
            return new nodes.BinaryOperatorExpression("*", left[1], right[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new NonTerminal("term"), 
        new Terminal("DIVIDES"), 
        new NonTerminal("factor")
    ], 
    function(nonTerminals, terminals) {
        let left = parseLoop(nonTerminals[0], "term");
        let right = parseLoop(nonTerminals[1], "term");

        if((left != undefined) && (right != undefined)) {
            return new nodes.BinaryOperatorExpression("/", left[1], right[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("term", [
        new NonTerminal("factor")
    ], 
    function(nonTerminals, terminals) {
        let check = parseLoop(nonTerminals, "factor");
        
        if(check != undefined) {
            return new nodes.Factor(check[1]);
        }
        else {
            return undefined;
        }
    });
    cfg.push(rule);

    rule = new Rule("factor", [
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
                            break;
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
                                            secondNonTerminal = [];
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
                    let check = cfg[index].generateNode(nonTerminals, terminals);
                    if(check != undefined) {
                        if(debugParseLoop) {
                            console.log("found MATCH");
                        }

                        return [lastContextIndex, check];
                    }
                    else {
                        if(debugParseLoop) {
                            console.log("did NOT find match");
                        }

                        ++index;
                    }

                }
                else {
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
let printAsDebug = false;
module.exports.parse = function(tokenStream) {
    let check = parseLoop(tokenStream, "");
    if(check != undefined) {
        tree.push(check[1]);
    }

    if(printAsDebug) {
        for(let i = 0; i < tree.length; i++) {
            debugPrint(tree[i], 0);
        }
    }
}

module.exports.print = function() {
    if(!(failed)) {
        for(let i = 0; i < tree.length; i++) {
            console.log(tree[i].print(0));
        }
    }
}