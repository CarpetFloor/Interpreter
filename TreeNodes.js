function getIndent(level) {
    return ("....").repeat(level);
}

// statements

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