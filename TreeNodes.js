const { default: test } = require("node:test");

function getIndent(level) {
    return ("..").repeat(level);
}

module.exports.BinaryOperatorExpression = class BinaryOperatorExpression {
    constructor(operation, left, right) {
        this.children = [];
        this.operation = operation;
        this.left = left;
        this.right = right;
    }

    print(level) {
        let output = (
            getIndent(level) + 
            "BinaryOperatorExpression! " + 
            this.left.constructor.name + " " + 
            this.operation + " " + 
            this.right.constructor.name
        );
        output += "\n";

        output += this.left.print(level + 1) + "\n";
        output += this.right.print(level + 1);

        return output;
    }
}

module.exports.Num = class Num {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        return (
            getIndent(level) + 
            "Num! " + this.value
        );
    }
}