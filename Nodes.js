function getIndent(level) {
    return ("....").repeat(level);
}

module.exports.BinaryOperatorExpression = class Node {
    constructor(operation, left, right) {
        this.children = [];

        this.operation = operation;
        this.left = left;
        this.right = right;

        this.children.push(left);
        this.children.push(right);
    }

    print(level) {
        return (
            getIndent(level) + "Expression Node! " +  
            this.left.print(level  + 1) + " " + 
            this.operation + " " + 
            this.right.print(level + 1)
        );
    }
}

module.exports.Num = class Node {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        return "[Num! " + this.value + "]";
    }
}