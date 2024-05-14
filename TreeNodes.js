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

// expressions

module.exports.Expression = class Expression {
    constructor(children) {
        this.children = [children];
    }
    print(level) {
        let output = "\n" + getIndent(level) + "Expression! ";

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.Term = class Term {
    constructor(children) {
        this.children = [children];
    }
    print(level) {
        let output = "\n" + getIndent(level) + "Term! ";

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.BinaryOperatorExpression = class BinaryOperatorExpression {
    constructor(operation, left, right) {
        this.children = [];
        this.operation = operation;
        
        this.left = left;
        this.right = right;
        
        this.children.push(left);
        this.children.push(right);
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Binary Operator Expression! " + 
            this.left.constructor.name + " " + 
            this.operation + " " + 
            this.right.constructor.name
        );

        output += this.left.print(level + 1);
        output += this.right.print(level + 1);

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