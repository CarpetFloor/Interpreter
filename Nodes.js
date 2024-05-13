module.exports.BinaryOperator = class Node {
    constructor(context, operation, left, right) {
        this.context = context;
        this.children = [];

        this.operation = operation;

        this.children.push(left);
        this.children.push(right);
    }

    print(level) {
        console.log("Expression Node!" + this.left + " " + this.operation + " " + this.right);
    }
}