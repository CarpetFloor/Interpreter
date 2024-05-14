function getIndent(level) {
    return ("....").repeat(level);
}

module.exports.Expression = class Expression {
    constructor(children) {
        this.children = children;
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
        this.children = children;
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
            "BinaryOperatorExpression! " + 
            this.left.constructor.name + " " + 
            this.operation + " " + 
            this.right.constructor.name
        );

        output += this.left.print(level + 1);
        output += this.right.print(level + 1);

        return output;
    }
}

module.exports.Num = class Num {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        return "\n" + getIndent(level) + "Num! " + this.value;
    }
}