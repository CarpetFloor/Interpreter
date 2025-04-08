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

function parseInnerWhileLoop(loopsList, tokens) {
    let debug = false;

    if(debug) {
        console.log("_____{=}{=}{=}{=}{=}_____");
        console.log("_____{=}{=}{=}{=}{=}_____");
        console.log("_____{=}{=}{=}{=}{=}_____");
        console.log("_____{=}{=}{=}{=}{=}_____");
        console.log("_____{=}{=}{=}{=}{=}_____");
        console.log("PARSING INNER WHILE LOOP");
    }

    // get comparison
    let comparisonIndices = {
        start: 2,
        end: -1
    };

    for(let i = 2; i < tokens.length; i++) {
        if(tokens[i].name == "CLOSEPAREN") {
            comparisonIndices.end = i;
            break;
        }
    }

    if(comparisonIndices.end == -1) {
        return false;
    }

    let comparisonTokens = tokens.slice(comparisonIndices.start, comparisonIndices.end);

    if(debug) {
        console.log("COMPARISON TOKENS");
        console.log(comparisonTokens);
    }
    
    // check comparison
    let comparisonCheck = parseLoop(comparisonTokens, "comparison");

    if(debug) {
        console.log("COMPARISON CHECK");
        console.log(comparisonCheck);
    }

    if(comparisonCheck == undefined) {
        return false;
    }

    // get body
    let body = tokens.slice(comparisonIndices.end + 2, tokens.length);

    if(debug) {
        console.log("BODY TOKENS");
        console.log(body);
    }

    /**
     * Check if there is a while loop in the body to recursivelly 
     * call this function again. Otherwise, check if body is a 
     * valid statement list. If it is, then the end of the entire 
     * loop with nested while loops can be verified.
     */
    let lastNestedLoop = true;
    for(let token of body) {
        if(token.name == "WHILE") {
            lastNestedLoop = false;
            break;
        }
    }

    if(debug) {
        console.log("LAST NESTED LOOP?", lastNestedLoop);
    }

    // check if entire body is valid statement list
    if(lastNestedLoop) {
        if(debug) {
            console.log("DOING LAST NESTED LOOP CHECK STUFF");
            console.log("BODY BEING PASSED INTO STATEMENT LIST CHECK:");
        }
        
        let bodyForStatementListCheck = [...(body.slice(0, body.length - 1))];
        
        if(debug) {
            console.log(bodyForStatementListCheck);
        }
        
        let statementListCheck = parseLoop(bodyForStatementListCheck, "statementlist");
        
        if(debug) {
            console.log("ARE WE HERE?");
        }

        if(debug) {
            console.log("STATEMENT LIST CHECK");
            console.log(statementListCheck);
        }

        if(statementListCheck == undefined) {
            return false;
        }
        else {
            if(debug) {
                console.log("_____");
                console.log("CHECKING WHILE LOOP PARTS");
                console.log(comparisonCheck[1]);
                console.log("_____");
                console.log(statementListCheck[1]);
            }

            let whileloop = new nodes.WhileLoop(comparisonCheck[1], [statementListCheck[1]]);
            loopsList.push(whileloop);

            return true;
        }
    }
    else {
        if(debug) {
            console.log("GOING THROUGH BODY");
            console.log("BODY:");
            console.log(body);
            console.log("_____\n");
        }

        let bodyElements = [];
            let currentTokens = [];;

            for(let i = 0; i < body.length; i++) {
                if(debug) {
                    console.log("\t", i, body[i]);
                }

                if(body[i].name == "WHILE") {
                    let statementListCheck = parseLoop(currentTokens, "statementlist");

                    if(debug) {
                        console.log("VALID STATEMENT LIST CHECK?");
                        console.log("TOKENS:");
                        console.log(currentTokens);
                        console.log("--");
                        console.log(statementListCheck);
                        console.log("--DONE");
                    }

                    if(statementListCheck == undefined) {
                        return false;
                    }

                    if(statementListCheck[1].children.length > 0) {
                        bodyElements.push(statementListCheck[1]);
                    }
                    
                    currentTokens = [];

                    let loopIndex = {
                        start: i,
                        end: -1
                    };

                    /**
                     * Need to differentiate between a while loop directly succeeding another 
                     * while loop, and a while loop nested within another while loop. To do so, 
                     * parse through tokens from start of inner while loop until a closing curly 
                     * bracket is found and the number of open and curly brackets found is equal.
                     */
                    let openCurlyCount = 0;
                    let closeCurlyCount = 0;

                    for(let j = loopIndex.start + 1; j < body.length - 1; j++) {
                        if(debug) {
                            console.log("\tTRYING TO FIND CLOSECURLY", j, body[j].name);
                        }

                        if(body[j].name == "OPENCURLY") {
                            ++openCurlyCount;
                        }

                        if(body[j].name == "CLOSECURLY") {
                            ++closeCurlyCount;

                            if(openCurlyCount == closeCurlyCount) {
                                if(debug) {
                                    console.log("FOUND");
                                }
                                

                                loopIndex.end = j;
                                break;
                            }
                        }

                    }

                    if(debug) {
                        console.log("LOOP INDICES");
                        console.log(loopIndex.start, loopIndex.end);
                    }

                    if(loopIndex.end == -1) {
                        return false;
                    }

                    let innerLoopTokens = body.slice(loopIndex.start, loopIndex.end + 1);

                    if(debug) {
                        console.log("\nINNER LOOP TOKENS");
                        console.log(innerLoopTokens);
                    }

                    let valid = parseInnerWhileLoop(bodyElements, innerLoopTokens);
                    
                    if(!(valid)) {
                        return false;
                    }

                    i += innerLoopTokens.length - 1;
                }
                else if(i == body.length - 1) {
                    let statementListCheck = parseLoop(currentTokens, "statementlist");

                    if(statementListCheck == undefined) {
                        return false;
                    }

                    if(statementListCheck[1].children.length > 0) {
                        bodyElements.push(statementListCheck[1]);
                    }

                    if(debug) {
                        console.log("\n\n\t\tADDED BOTTOM");
                        console.log(statementListCheck[1].children.length);
                    }
                }
                else {
                    currentTokens.push(body[i]);
                }

            }

            if(debug) {
                console.log("COMBINING BODY ELEMENTS");
            }

            // combine while loops
            for(let i = bodyElements.length - 1; i > 0; i--) {
                if(bodyElements[i].name == "WHILE") {
                    let loop = bodyElements[i];

                    if(bodyElements[i - 1].name == "WHILE") {
                        bodyElements[i - 1].body.push(loop);
                    }

                    bodyElements.splice(i, 1);
                }
            }

            let whileloop = new nodes.WhileLoop(
                comparisonCheck[1], 
                bodyElements
            );
            loopsList.push(whileloop);

            if(debug) {
                console.log("FINAL WHILE LOOP");
                console.log(whileloop);
            }
            
            return true;

    }

    return false;

}

// create context-free grammar
let cfg = [];

// the actual CFG rules are defined here
function generateCFG() {
    let rule = null;

    /**
     * Most top-level node that will go through the entire top-level 
     * of the file. Basically identify and match everything that is 
     * in the global block and not within a while or conditional 
     * block.
     * Works similar to how while loop parses the body.
     */
    rule = new Rule("program", [
        new NonTerminal("everything")
    ], 
    function(nonTerminals, terminals) {
        let tokens = [...nonTerminals];

        console.log("=====");
        console.log("=====");
        console.log("=====");
        console.log("=====");
        console.log("=====");
        console.log("PARSING PROGRAM");
        console.log("TOKENS");
        console.log(tokens);

        let currentTokens = [];
        let bodyElements = [];

        console.log("\n_____");
        console.log("GOING THROUGH TOKENS");

        // go through tokens
        for(let i = 0; i < tokens.length; i++) {
            let token = tokens[i];

            console.log("\t", token.name);
            
            if(token.name == "WHILE") {
                console.log("_____");
                console.log("CHECKING WHILE LOOP");
                console.log("_____");

                // first check if current tokens valid statement list
                let statementListCheck = parseLoop(currentTokens, "statementlist");
                console.log("FIRST CHECKING STATEMENT LIST");
                console.log("TOKENS");
                console.log(currentTokens);
                console.log("CHECK");
                console.log(statementListCheck);
                console.log("_____");

                if(statementListCheck == undefined) {
                    return undefined;
                }

                bodyElements.push(statementListCheck[1]);
                currentTokens = [];
                
                let loopIndices = {
                    start: tokens.indexOf(token), 
                    end: -1
                };

                let openCurlyCount = 0;
                let closeCurlyCount = 0;

                /**
                 * Parse through tokens until a close curly is found 
                 * while the number of close curlys is equal to the 
                 * number of open curlys.
                 */
                for(let i = loopIndices.start + 1; i < tokens.length; i++) {
                    if(tokens[i].name == "OPENCURLY") {
                        ++openCurlyCount;
                    }
                    else if(tokens[i].name == "CLOSECURLY") {
                        ++closeCurlyCount;

                        if(openCurlyCount == closeCurlyCount) {
                            loopIndices.end = i;
                            break;
                        }
                    }

                }

                console.log("LOOP INDICES");
                console.log(loopIndices.start, loopIndices.end);

                if(loopIndices.end == -1) {
                    return undefined;
                }

                let whileTokens = tokens.slice(loopIndices.start, loopIndices.end + 1);
                console.log("WHILE TOKENS");
                console.log(whileTokens);

                let whileLoopCheck = parseLoop(whileTokens, "whileloop");

                console.log("WHILE LOOP CHECK");
                console.log(whileLoopCheck);

                if(whileLoopCheck == undefined) {
                    return undefined;
                }

                bodyElements.push(whileLoopCheck[1]);
                currentTokens = [];
                i = loopIndices.end;
            }
            else if(tokens.indexOf(token) == tokens.length - 1) {
                console.log("_____");
                console.log("REACHED END");

                currentTokens.push(token);

                console.log("STATEMENT LIST CHECK");
                console.log("TOKENS");
                console.log(currentTokens);

                let statementListCheck = parseLoop(currentTokens, "statementlist");

                if(statementListCheck == undefined) {
                    return undefined;
                }

                bodyElements.push(statementListCheck[1]);
            }
            else {
                currentTokens.push(token);
            }

        }

        // create program node
        return new nodes.Program(bodyElements);
    });
    cfg.push(rule);

    rule = new Rule("whileloop", [
        new Terminal("WHILE"), 
        new Terminal("OPENPAREN"), 
        new NonTerminal("comparison"), 
        new Terminal("CLOSEPAREN"), 
        new Terminal("OPENCURLY"), 
        new NonTerminal("statementlist"),
    ], 
    function(nonTerminals, terminals) {
        let whileloops = [];
        
        // console.log("----------");
        // console.log("----------");
        // console.log("Parisng nested while loop");
        // console.log("----------");
        // console.log("----------");

        // console.log("\tnonTerminals");
        // console.log(nonTerminals);
        // console.log("-----");
        // console.log("\tterminals");
        // console.log(terminals);
        // console.log("-")

        // first make sure comparison of outter while loop valid
        let comparisonCheck = parseLoop(nonTerminals[0], "comparison");
        // console.log("\tCOMPARISON")
        // console.log(parseLoop(nonTerminals[0], "comparison"));
        if(comparisonCheck != undefined) {
            // make sure inner while loop exists
            let body = nonTerminals[1];
            let bodyElements = [];

            // console.log("==========");
            // console.log("==========");
            // console.log("==========");
            // console.log("==========");
            // console.log("==========");

            /**
             * keep array that body elements are sequentially added to.
             * go through body
             */
            let currentTokens = [];
            // check to make sure that a while loop list isn't parsed like 
            // nested while loops by checking if the first "inner" while token 
            // is found before the first open curly is closed
            let openCurlyCount = 1;
            let closeCurlyCount = 0;

            for(let i = 0; i < body.length; i++) {
                // console.log("\t", i, body[i]);

                if(body[i].name == "WHILE") {
                    // console.log(openCurlyCount, closeCurlyCount);
                    // detect while loop list instead of nested while loops
                    if(openCurlyCount == closeCurlyCount) {
                        return undefined;
                    }

                    // check if currentTokens is a valid statement list
                    let statementListCheck = parseLoop(currentTokens, "statementlist");
                    // console.log("STATEMENT LIST CHECK");
                    // console.log(currentTokens);
                    // console.log("--");
                    // console.log(statementListCheck);

                    if(statementListCheck == undefined) {
                        return undefined;
                    }

                    if(statementListCheck[1].children.length > 0) {
                        bodyElements.push(statementListCheck[1]);
                    }
                    currentTokens = [];

                    // find entire inner-loop context
                    let loopIndex = {
                        start: i,
                        end: -1
                    };

                    let innerOpenCurlyCount = 0;
                    let innerCloseCurlyCount = 0;

                    for(let j = loopIndex.start + 1; j < body.length - 1; j++) {
                        if(debug) {
                            // console.log("\tTRYING TO FIND CLOSECURLY", j, body[j].name);
                        }

                        if(body[j].name == "OPENCURLY") {
                            ++innerOpenCurlyCount;
                        }

                        if(body[j].name == "CLOSECURLY") {
                            ++innerCloseCurlyCount;

                            if(innerOpenCurlyCount == innerCloseCurlyCount) {
                                if(debug) {
                                    // console.log("FOUND");
                                }
                                

                                loopIndex.end = j;
                                break;
                            }
                        }
                        
                    }

                    // console.log("LOOP INDICES:");
                    // console.log(loopIndex.start, loopIndex.end);

                    if(loopIndex.end == -1) {
                        return undefined;
                    }

                    // recursively check inner while loops by calling method 
                    // and passing inner loop context
                    let innerLoopTokens = body.slice(loopIndex.start, loopIndex.end + 1);

                    // console.log("TOKENS");
                    // console.log(innerLoopTokens);
                    let valid = parseInnerWhileLoop(bodyElements, innerLoopTokens);

                    // console.log("\n__________\n\tVALID CHECK");
                    // console.log(valid);
                    
                    if(!(valid)) {
                        return undefined;
                    }

                    i += innerLoopTokens.length - 1;
                }
                else if(i == body.length - 1) {
                    let statementListCheck = parseLoop(currentTokens, "statementlist");

                    if(statementListCheck == undefined) {
                        return undefined;
                    }

                    if(statementListCheck[1].children.length > 0) {
                        bodyElements.push(statementListCheck[1]);
                    }
                }
                else {
                    if(body[i].name == "OPENCURLY") {
                        ++openCurlyCount;
                    }
                    else if(body[i].name == "CLOSECURLY") {
                        ++closeCurlyCount;
                    }

                    currentTokens.push(body[i]);
                }

            }

            // console.log("-----");
            // console.log("\tDONE");
            // console.log("-----");
            // console.log("\tBODY ELEMENTS");
            // console.log(bodyElements);
            // console.log("-----");
            // console.log("\tCOMPARISON")
            // console.log(comparisonCheck[1])
            // console.log("-----");

            // combine while loops
            for(let i = bodyElements.length - 1; i > 0; i--) {
                if(bodyElements[i].name == "WHILE") {
                    let loop = bodyElements[i];

                    if(bodyElements[i - 1].name == "WHILE") {
                        bodyElements[i - 1].body.push(loop);
                    }

                    bodyElements.splice(i, 1);
                }
            }

            // console.log("=====");
            // console.log("NEW ELEMENTS");
            // console.log(bodyElements);

            return new nodes.WhileLoop(
                comparisonCheck[1], 
                bodyElements
            );

        }
        
        return undefined;
    });
    cfg.push(rule);

    rule = new Rule("statementlist", [
        new NonTerminal("statement"), 
        new NonTerminal("statementlist")
    ], 
    function(nonTerminals, terminals) {
        // console.log("\n\n\n\n\nSTATEMENT LIST CHECk");
        let statements = [];
        let passContext = [...nonTerminals];
        // console.log("PASS CONTEXT");
        // console.log(passContext);
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

    // num list declaration
    rule = new Rule("statement", [
        new Terminal("LISTTYPE"), 
        new Terminal("OPENPIPE"), 
        new Terminal("NUMTYPE"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("OPENPIPE"), 
        new NonTerminal("values"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        console.log("\n_____");
        console.log("LIST DECLARATION");
        console.log("_____");
        console.log("\nNON TERMINALS");
        console.log(nonTerminals);

        // validate declaration values
        let valueTokens = nonTerminals[0];
        let values = [];
        let currentTokens = [];

        console.log("\n_____");
        console.log("GOING THROUGH VALUES");

        for(let token of valueTokens) {
            console.log("\t", token.name);

            if((token.name == "COMMA") || (valueTokens.indexOf(token) == valueTokens.length - 1)) {
                if(valueTokens.indexOf(token) == valueTokens.length - 1) {
                    currentTokens.push(token);
                }

                console.log("CHECKING FOR EXPRESSION");
                console.log("TOKENS");
                console.log(currentTokens);
                let expressionCheck = parseLoop(currentTokens, "expression");
                console.log("EXPRESSION CHECK");
                console.log(expressionCheck)
                
                if(expressionCheck == undefined) {
                    return undefined;
                }

                values.push(expressionCheck[1]);
                currentTokens = [];
            }
            else {
                currentTokens.push(token);
            }
        }


        let varName = terminals[4];
        let listType = terminals[2];

        return new nodes.DeclarationAssignment(
            "list", 
            varName, 
            new nodes.List(listType, values)
        );
    });
    cfg.push(rule);

    // string list declaration
    rule = new Rule("statement", [
        new Terminal("LISTTYPE"), 
        new Terminal("OPENPIPE"), 
        new Terminal("STRINGTYPE"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("OPENPIPE"),
        new NonTerminal("values"),  
        new Terminal("CLOSEPIPE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        console.log("\n\nSTRING LIST DECLARATION");
        console.log("+++++");
        console.log("+++++");
        console.log("+++++");
        console.log("+++++");
        console.log("+++++");
        let currentTokens = [];
        let valueTokens = nonTerminals[0];
        let values = [];

        for(let token of valueTokens) {
            if((token.name == "COMMA") || (valueTokens.indexOf(token) == valueTokens.length - 1)) {
                if(valueTokens.indexOf(token) == valueTokens.length - 1) {
                    currentTokens.push(token);
                }
                
                let stringExpressionCheck = parseLoop(currentTokens, "stringexpression");
                if(stringExpressionCheck == undefined) {
                    return undefined;
                }

                values.push(stringExpressionCheck[1]);
                currentTokens = [];
            }
            else {
                currentTokens.push(token);
            }
        }

        console.log("VALUES");
        console.log(values);

        let varName = terminals[4];
        let listType = terminals[2];

        return new nodes.DeclarationAssignment(
            "list", 
            varName, 
            new nodes.List(listType, values)
        );
    });
    cfg.push(rule);

    // num list assignment
    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("OPENPIPE"), 
        new NonTerminal("values"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let valueTokens = nonTerminals[0];
        let values = [];
        let currentTokens = [];

        for(let token of valueTokens) {
            if((token.name == "COMMA") || (valueTokens.indexOf(token) == valueTokens.length - 1)) {
                if(valueTokens.indexOf(token) == valueTokens.length - 1) {
                    currentTokens.push(token);
                }
                
                let expressionCheck = parseLoop(currentTokens, "expression");
                
                if(expressionCheck == undefined) {
                    return undefined;
                }

                values.push(expressionCheck[1]);
                currentTokens = [];
            }
            else {
                currentTokens.push(token);
            }
        }


        let varName = terminals[0];
        let listType = terminals[2];

        console.log("VALUES");
        console.log(values);

        return new nodes.ListAssignment(
            varName, 
            values
        );
    });
    cfg.push(rule);

    // list assignment for both num and string
    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("OPENPIPE"), 
        new NonTerminal("values"), 
        new Terminal("CLOSEPIPE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let valueTokens = nonTerminals[0];
        let values = [];
        let currentTokens = [];

        // console.log("*****");
        // console.log("*****");
        // console.log("*****");
        // console.log("*****");
        // console.log("*****");
        // console.log("LIST ASASIGNMENT")

        for(let token of valueTokens) {
            if((token.name == "COMMA") || (valueTokens.indexOf(token) == valueTokens.length - 1)) {
                if(valueTokens.indexOf(token) == valueTokens.length - 1) {
                    currentTokens.push(token);
                }
                
                let expressionCheck = parseLoop(currentTokens, "expression");
                
                if(expressionCheck == undefined) {
                    let stringExpressionCheck = parseLoop(currentTokens, "stringexpression");

                    if(stringExpressionCheck == undefined) {
                        return undefined;
                    }

                    values.push(stringExpressionCheck[1]);
                    currentTokens = [];
                }
                else {
                    values.push(expressionCheck[1]);
                    currentTokens = [];
                }
            }
            else {
                currentTokens.push(token);
            }
        }


        let varName = terminals[0];
        let listType = terminals[2];

        console.log("VALUES");
        console.log(values);

        return new nodes.ListAssignment(
            varName, 
            values
        );
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
        let varName = terminals[0];

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
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("TRUEVALUE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let varName = terminals[0];
        let boolValue = new nodes.BoolValue("true");

        return new nodes.Assignment(
            varName, 
            boolValue
        );
        
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("FALSEVALUE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {
        let varName = terminals[0];
        let boolValue = new nodes.BoolValue("false");

        return new nodes.Assignment(
            varName, 
            boolValue
        );
        
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
        new Terminal("BOOLTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("TRUEVALUE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {        
        let type = "bool";
        let varName = terminals[1];
        let value = new nodes.BoolValue("true");
        
        return new nodes.DeclarationAssignment(
            type, 
            varName, 
            value
        );
        
    });
    cfg.push(rule);

    rule = new Rule("statement", [
        new Terminal("BOOLTYPE"), 
        new Terminal("ID"), 
        new Terminal("ASSIGN"), 
        new Terminal("FALSEVALUE"), 
        new Terminal("SEMICOLON")
    ], 
    function(nonTerminals, terminals) {        
        let type = "bool";
        let varName = terminals[1];
        let value = new nodes.BoolValue("false");
        
        return new nodes.DeclarationAssignment(
            type, 
            varName, 
            value
        );
        
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

    rule = new Rule("comparison", [
        new NonTerminal("expression"), 
        new Terminal("ASSIGN"), 
        new Terminal("ASSIGN"), 
        new Terminal("TRUEVALUE")
    ], 
    function(nonTerminals, terminals) {
        let leftCheck = parseLoop(nonTerminals[0], "expression");

        if(leftCheck != undefined) {
            return new nodes.Comparison(
                "==", 
                leftCheck[1], 
                new nodes.BoolValue("true")
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