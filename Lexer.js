function Pattern(name, pattern) {
    this.name = name;
    this.pattern = pattern;
}

// regex patterns and coresponding token name
const tokens = [
    // whitespace
    new Pattern(
        "_WHITESPACE_", 
        /\s/
    ), 

    // comments

    // multi-line
    new Pattern(
        "_WHITESPACE_", 
        /(##)[^#]*(#)/
    ), 

    // single-line
    new Pattern(
        "_WHITESPACE_", 
        /(#)[^\n]*/
    ), 

    // keywords

    new Pattern(
        "BOOLTYPE", 
        /bool/
    ), 

    new Pattern(
        "TRUEVALUE", 
        /true/
    ),

    new Pattern(
        "FALSEVALUE", 
        /false/
    ),

    new Pattern(
        "NUMTYPE", 
        /num/
    ), 

    new Pattern(
        "LISTTYPE", 
        /list/
    ), 

    new Pattern(
        "STRINGTYPE", 
        /string/
    ), 

    new Pattern(
        "GET", 
        /get/
    ), 

    new Pattern(
        "SET", 
        /set/
    ), 

    new Pattern(
        "REMOVE", 
        /remove/
    ), 

    new Pattern(
        "LENGTH", 
        /length/
    ), 

    new Pattern(
        // so as to not be confused with addition
        "ADDKEYWORD", 
        /add/
    ), 

    new Pattern(
        "WHILE", 
        /while/
    ), 

    new Pattern(
        "METHOD_TOSTRING", 
        /toString\(\)/
    ), 

    new Pattern(
        "OR", 
        /or/
    ), 

    new Pattern(
        "AND", 
        /and/
    ), 

    // groupings

    new Pattern(
        "or", 
        /or/
    ), 

    new Pattern(
        "OPENPIPE", 
        /\[/
    ), 

    new Pattern(
        "CLOSEPIPE", 
        /\]/
    ), 

    new Pattern(
        "OPENPAREN", 
        /\(/
    ), 

    new Pattern(
        "CLOSEPAREN", 
        /\)/
    ), 

    new Pattern(
        "OPENCURLY", 
        /\{/
    ), 

    new Pattern(
        "CLOSECURLY", 
        /\}/
    ), 

    new Pattern(
        "ID", 
        /[a-zA-Z]+/
    ), 
    
    new Pattern(
        "ASSIGN", 
        /=/
    ), 

    new Pattern(
        "DOT", 
        /\./
    ), 

    new Pattern(
        "COMMA", 
        /\,/
    ), 
    
    // types

    new Pattern(
        "NUM", 
        /[0-9]+/
    ), 

    new Pattern(
        "STRING", 
        /(")[^"]*(")/
    ), 

    new Pattern(
        "STRING", 
        /(')[^']*(')/
    ), 

    new Pattern(
        "INCREMENTASSIGN", 
        /\+=/
    ), 

    new Pattern(
        "DECREMENTASSIGN", 
        /\-=/
    ), 

    new Pattern(
        "MULTINCREMENTASSIGN", 
        /\*=/
    ), 

    // math

    new Pattern(
        "PLUS", 
        /(\+)/
    ), 

    new Pattern(
        "MINUS", 
        /(\-)/
    ), 

    new Pattern(
        "TIMES", 
        /(\*)/
    ), 

    new Pattern(
        "DIVIDES", 
        /(\/)/
    ), 

    // comparison

    new Pattern(
        "LESSTHAN", 
        /</
    ), 

    new Pattern(
        "GREATERTHAN", 
        />/
    ), 

    new Pattern(
        "OR", 
        /\|\|/
    ), 

    new Pattern(
        "AND", 
        /&&/
    ), 

    new Pattern(
        "NOT",
        /!/
    ), 

    // semicolon

    new Pattern(
        "SEMICOLON", 
        /;/
    ), 

    // error fallback
    new Pattern(
        "_ERROR_", 
        /./
    )
];

const tokensWithValue = [
    "NUMTYPE", "ID", "NUM", "_ERROR_", "STRING"
];

/**
 * 
 * Go through each token and find the first the index of it's
 * first match in text. If the index is less than the smallest 
 * index and not -1 (no match is found), and the index is less 
 * than the smallest index found so far, then update the smallest
 * index found so far and update match (the token that coresponds
 * to smallest). Respects precedence of tokens by order listed
 * out in tokens array. For instance, for int as NUMTYPE to not
 * count as i for an ID, because NUMTYPE is listed higher up in 
 * tokens array, that would update smallest before ID does. So, 
 * when the ID does find a match with i at same index as int for 
 * NUMTYPE, smallest would not be updated because the indexes are 
 * the same.
 * 
 * @param text: the current substring of program looking at to find the next token
 * @returns the token, as an object, of the token found
 */
function getToken(text) {
    let smallest = text.length + 2;
    let match = null;

    for(let i = 0; i < tokens.length; i++) {
        let check = text.search(tokens[i].pattern);
        
        if((check < smallest) && (check != -1)) {
            smallest = check;
            match = tokens[i];
        }
    }

    return match;
}

function Token(name, value) {
    this.name = name;
    this.value = value;
}

function checkForSpecialValue(tokenName, value) {
    switch(tokenName) {
        case "STRING":
            let after = value.replace(
                /["']/g, 
                ""
            );
            return after;
        default:
            return value;
    }
}

module.exports.lex = function(program) {
    let tokenStream = [];
    
    let startIndex = 0;
    let lexingFailed = false;
    
    while(startIndex < program.length) {
        // current substring of text to look at to find the next token
        let current = program.substring(startIndex);
        // object that has a name (ie. NUMTYPE), and it's corresponding regex pattern
        // regex pattern needed for match done below (also explained further below)
        let token = getToken(current);

        // token would only be null when even error fallback can't match to anything, basically something has gone very wrong
        if(token != null ) {
            // get the actual substring of what the token matches to (found using its pattern), but the return value of the match method gives extra stuff that is not needed, so use matched below to get only the actual substring.
            let matchedFull = current.match(token.pattern);
            let matched = matchedFull[0];
            // the index at witch matched starts at in current
            let tokenStart = current.indexOf(matched);
            let tokenEnd = tokenStart + matched.length;

            // only actually add token and, if required, it's value if not white space
            if(token.name != "_WHITESPACE_") {
                let value = null;
                if(tokensWithValue.includes(token.name)) {
                    value = matched;

                    // some values should be something different than the literal regex match
                    value = checkForSpecialValue(token.name, value);
                }

                // if(token.name == "_ERROR_") {
                    tokenStream.push(new Token(token.name, value));
                // }
            }

            // update startIndex so the next substring of program will move past the token just found
            startIndex += tokenEnd;
        }
        // only completely fail lexing if can't match to anything, including error fallback
        else {
            lexingFailed = true;
            console.log("ERROR: Lexing failed at index ", startIndex, "with: ", current);
            break;
        }
    }

    if(lexingFailed) {
        return [null];
    }
    else {
        return tokenStream;
    }
}