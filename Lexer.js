function Pattern(name, pattern) {
    this.name = name;
    this.pattern = pattern;
}

const tokens = [
    new Pattern(
        "NUMTYPE", 
        /(int)/
    ), 

    new Pattern(
        "ID", 
        /[a-zA-Z]+/
    ), 
    
    new Pattern(
        "ASSIGN", 
        /(=)/
    ), 
    
    new Pattern(
        "NUM", 
        /[0-9]+/
    ), 

    new Pattern(
        "SEMICOLON", 
        /(;)/
    )
];

const tokensWithValue = [
    "NUMTYPE", "ID", "NUM"
];

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

module.exports.lex = function(program) {
    let tokenStream = [];
    
    let startIndex = 0;
    
    while(startIndex < program.length) {
        let current = program.substring(startIndex);
        let token = getToken(current);

        if(token != null) {
            let matchedFull = current.match(token.pattern);
            let matched = matchedFull[0];
            let tokenStart = current.indexOf(matched);
            let tokenEnd = tokenStart + matched.length;

            let value = null;
            if(tokensWithValue.includes(token.name)) {
                value = matched;
            }

            tokenStream.push(new Token(token.name, value));

            startIndex += tokenEnd;
        }
        else {
            console.log("ERROR: Lexing failed at index ", startIndex, "with: ", current);
            break;
        }
    }

    return tokenStream;
}