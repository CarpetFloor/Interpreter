function getIndent(level) {
    return ("....").repeat(level);
}

// statements

module.exports.StatementList = class StatementList {
    constructor(statements) {
        this.children = statements;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Statement List! "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.DeclarationAssignment = class DeclarationAssignment {
    constructor(type, varName, value) {
        this.children = [];

        this.type = type;
        this.varName = varName;
        this.value = value;

        this.children.push(value);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Declaration Assignment! " + 
            "type: " + this.type + ", " + 
            "varName: " + this.varName + ", "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.Assignment = class Assignement {
    constructor(varName, value) {
        this.children = [];

        this.varName = varName;
        this.value = value;

        this.children.push(value);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Assignment! " + 
            "varName: " + this.varName + ", "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.Print = class Print {
    constructor(value) {
        this.children = [];
        this.value = value;

        this.children.push(value);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Print! "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

// types

module.exports.Num = class Num {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        return "\n" + getIndent(level) + "Num! " + this.value;
    }
}

module.exports.String = class String {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        return "\n" + getIndent(level) + "String! " + this.value;
    }
}