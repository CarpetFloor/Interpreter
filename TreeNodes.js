function getIndent(level) {
    return ("..").repeat(level);
}

module.exports.Expression = class Expression {
    constructor(children) {
        this.children = children;
    }
    print(level) {
        let output = (
            getIndent(level) + 
            "Expression! "
        );
        output += "\n";

        for(let i = 0; i < this.children.length; i++) {
            output += "...." + this.left;

            if(i < this.children.length - 1) {
                output += "\n";   
            }
        }

        return output;
    }
}

module.exports.Term = class Term {
    constructor(children) {
        this.children = children;
    }
    print(level) {
        let output = (
            getIndent(level) + 
            "Expression! "
        );
        output += "\n";

        for(let i = 0; i < this.children.length; i++) {
            output += "...." + this.left;

            if(i < this.children.length - 1) {
                output += "\n";   
            }
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