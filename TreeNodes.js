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
            "varName: " + this.varName + ", " + 
            "value: "
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

module.exports.IncrementAssignment = class IncrementAssignment {
    constructor(varName, increment) {
        this.children = [];

        this.varName = varName;
        this.increment = increment;

        this.children.push(increment);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Increment Assignment! " + 
            "varName: " + this.varName + ", " + 
            "increment by: "
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

// expression 

module.exports.BinaryOperatorExpression = class BinaryOperatorExpression {
    constructor(operator, left, right) {
        this.children = [];
        this.operator = operator;

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
            "Operator: " + this.operator
        );

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
        let output = (
            "\n" + 
            getIndent(level) + 
            "Term!"
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.Factor = class Factor {
    constructor(children) {
        this.children = [children];
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Factor!"
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }
}

module.exports.IdReference = class IdReference {
    constructor(id) {
        this.id = id;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Id Reference! " + 
            "Id = " + this.id
        );

        return output;
    }
}

module.exports.ListElementReference = class ListElementReference {
    constructor(list, index) {
        this.list = list;
        this.index = index;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Element Reference! " + 
            "List = " + this.list + ", Index = " + 
            this.index.print(level + 1)
        );

        return output;
    }
}

module.exports.ListElementSet = class ListElementSet {
    constructor(list, index, value) {
        this.list = list;
        this.index = index;
        this.value = value;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Element Set! " + 
            "List = " + this.list + ", Index = " + 
            this.index.print(level + 1) + 
            "\n" + getIndent(level) + 
            "Value = " + this.value.print(level + 1)
        );

        return output;
    }
}

module.exports.ListAdd = class ListAdd {
    constructor(list, value) {
        this.list = list;
        this.value = value;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Add! " + 
            "List = " + this.list + 
            "Value = " + this.value.print(level + 1)
        );

        return output;
    }
}

module.exports.StringTerm = class StringTerm {
    constructor(children) {
        this.children = [children];
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "String Term!"
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

module.exports.List = class List {
    constructor(type) {
        this.children = [];
        this.elements = [];
        this.type = type;
    }

    print(level) {
        let output = "\n" + getIndent(level) + "List! ";
        output += "List Type: " + this.type + ", " + " Elements:";

        for(let i = 0; i < this.elements.length; i++) {
            output += "\n...." + this.elements[i];
        }

        return output;
    }
}