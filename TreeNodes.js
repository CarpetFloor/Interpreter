/**
 * Every variable is:
 * string varName, whateverType value
 */
const variables = new Map();
const listTypes = new Map();
const debugStatementList = false;

function getIndent(level) {
    return ("....").repeat(level);
}

module.exports.Program = class Program {
    constructor(children) {
        this.children = children;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Program! "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        for(let child of this.children) {
            let check = child.run();
            
            if(check == undefined) {
                break;
            }
        }

    }
}

// statements

module.exports.WhileLoop = class WhileLoop {
    constructor(comparison, body) {
        this.children = [];

        this.comparison = comparison;
        this.children.push(comparison);

        this.body = body;
        for(let element of body) {
            this.children.push(element);
        }
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "While Loop! " + 
            this.comparison.print(level + 1) + 
            "\n" + getIndent(level) + "_____BODY_____"
        );

        for(let element of this.body) {
            output += element.print(level + 1)
        }

        return output;
    }

    run() {
        let comparisonEval = this.comparison.run();

        while(comparisonEval) {
            for(let statement of this.body) {
                statement.run();
            }

            comparisonEval = this.comparison.run();
        }

        return true;
    }
}

module.exports.IfLoop = class IfLoop {
    constructor(comparison, body) {
        this.children = [];

        this.comparison = comparison;
        this.children.push(comparison);
        this.elseStatement = null;

        this.body = body;
        for(let element of body) {
            this.children.push(element);
        }
    }

    addElse(elseStatement) {
        this.elseStatement = elseStatement;
        this.children.push(elseStatement);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "If Loop! " + 
            this.comparison.print(level + 1) + 
            "\n" + getIndent(level) + "_____BODY_____"
        );

        for(let element of this.body) {
            output += element.print(level + 1)
        }

        output += "\n" + getIndent(level) + "_____ELSE_STATEMENT_____";

        if(this.elseStatement == null) {
            output += "\n" + getIndent(level + 1) + "!!!!NONE!!!!";
        }
        else {
            output += this.elseStatement.print(level + 1);
        }

        return output;
    }

    run() {
        let comparisonEval = this.comparison.run();

        if(comparisonEval) {
            for(let statement of this.body) {
                statement.run();
            }

            return true;
        }
        else if(this.elseStatement != null) {
            this.elseStatement.run();

            return true;
        }
        else {
            return true;
        }
    }
}

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

    run() {
        for(let child of this.children) {
            if(debugStatementList) {
                console.log("\t", child.constructor.name);
            }

            let check = child.run();

            if(debugStatementList) {
                console.log("\t\t", check);
            }
            
            if(check == undefined) {
                break;
            }
        }
        
        return true;
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

    run() {
        let actualValue = this.value.run(this.type);
        if(actualValue == undefined) {
            return undefined;
        }

        try {
            variables.set(this.varName, actualValue);

            if(this.type == "list") {
                listTypes.set(this.varName, this.value.type);
            }

            return true;
        }
        catch(exception) {
            console.log(exception.message);
            return undefined;
        }
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

    run() {
        // first make sure variable exists
        let value = variables.get(this.varName);

        if(value == undefined) {
            console.error("!!!!!Variable " + this.varName + " does not exist!!!!!");
            return undefined;
        }

        variables.set(this.varName, this.value.run());
        return true;
    }
}

module.exports.ListAssignment = class ListAssignement {
    constructor(varName, values) {
        this.children = [];

        this.varName = varName;
        this.values = values;

        this.children = values;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Assignment! " + 
            "varName: " + this.varName + ", "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        let oldList = variables.get(this.varName);;
        
        if(oldList == undefined) {
            console.error("!!!!!Varibale " + this.varName + " doesn't exist!!!!!");
            return undefined;
        }

        let newList = [];
        let type = listTypes.get(this.varName);

        for(let child of this.children) {
            let value = child.run();

            switch(type) {
                case "num":
                    if((typeof value) != "number") {
                        console.error("!!!!!List value must be of type num!!!!!");
                        return undefined;
                    }

                    break;
                
                case "string":
                    if((typeof value) != "string") {
                        console.error("!!!!!List value must be of type string!!!!!");
                        return undefined;
                    }

                    break;

                case "bool":
                    if((typeof value) != "boolean") {
                        console.error("!!!!!List value must be of type bool!!!!!");
                        return undefined;
                    }

                    break;
            }

            newList.push(value);
        }

        variables.set(this.varName, newList);
        return true;
    }
}

module.exports.MultIncrementAssignment = class MultIncrementAssignment {
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
            "Multiplaction Increment Assignment! " + 
            "varName: " + this.varName + ", " + 
            "multiply by: "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        // first make sure variable exists
        let value = variables.get(this.varName);

        if(value == undefined) {
            console.error("!!!!!Variable " + this.varName + " does not exist!!!!!");
            return undefined;
        }

        variables.set(this.varName, value * this.increment.run());
        return true;
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

    run() {
        // first make sure variable exists
        let value = variables.get(this.varName);

        if(value == undefined) {
            console.error("!!!!!Variable " + this.varName + " does not exist!!!!!");
            return undefined;
        }

        variables.set(this.varName, value + this.increment.run());
        return true;
    }
}

module.exports.DecrementAssignment = class DecrementAssignment {
    constructor(varName, decrement) {
        this.children = [];

        this.varName = varName;
        this.decrement = decrement;

        this.children.push(decrement);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Decrement Assignment! " + 
            "varName: " + this.varName + ", " + 
            "decrement by: "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        // first make sure variable exists
        let value = variables.get(this.varName);

        if(value == undefined) {
            console.error("!!!!!Variable " + this.varName + " does not exist!!!!!");
            return undefined;
        }

        variables.set(this.varName, value - this.decrement.run());
        return true;
    }
}

module.exports.Print = class Print {
    constructor(stringexpression) {
        this.stringexpression = stringexpression;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Print! " + 
            this.stringexpression.print(level + 1)
        );

        return output;
    }

    run() {
        console.log(this.stringexpression.run());
        return true;
    }
}

// expression 

module.exports.Not = class Not {
    constructor(comparison) {
        this.children = [];

        this.comparison = comparison;
        this.children.push(comparison);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Not! "
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        return !(this.comparison.run());
    }
}

module.exports.Comparison = class Comparison {
    constructor(comparison, left, right) {
        this.children = [];
        this.comparison = comparison;

        this.left = left;
        this.right = right;

        this.children.push(left);
        this.children.push(right);
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Comparison! " + 
            "compare operator: " + this.comparison
        );

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        let leftValue = this.left.run();
        if(leftValue == undefined) {
            return undefined;
        }

        let rightValue = this.right.run();
        if(rightValue == undefined) {
            return undefined;
        }

        switch(this.comparison) {
            case "==":
                return (leftValue == rightValue);

            case ">":
                return (leftValue > rightValue);
            
            case ">=":
                return (leftValue >= rightValue);

            case "<":
                return (leftValue < rightValue);
            
            case "<=":
                return (leftValue <= rightValue);
        }
    }
}

module.exports.BoolValue = class BoolValue {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Boolean Value! " + 
            this.value
        );

        return output;
    }

    run() {
        return (this.value == "true");
    }
}

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

    run() {
        switch(this.operator) {
            case "+":
                return this.left.run() + this.right.run();
                break;
            
            case "-":
                return this.left.run() - this.right.run();
                break;
            
            case "*":
                return this.left.run() * this.right.run();
                break;
            
            case "/":
                let leftValue = this.left.run();
                let rightValue = this.right.run();

                if(rightValue == 0) {
                    console.error("Cannot divide by 0!");
                    return undefined;
                }

                return leftValue / rightValue;
                break;
        }

        return undefined;
    }
}

module.exports.Term = class Term {
    constructor(child) {
        this.child = child;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Term!"
        );

        output += this.child.print(level + 1);

        return output;
    }

    run() {
        return this.child.run();
    }
}

module.exports.Factor = class Factor {
    constructor(child) {
        this.child = child;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "Factor!"
        );

        output += this.child.print(level + 1);

        return output;
    }

    run() {
        return this.child.run();
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

    run() {
        let value = null;

        try {
            value = variables.get(this.id);
        }
        catch(exception) {
            console.error("Variable " + this.id + " does not exist!");
            return undefined;
        }

        value = variables.get(this.id);
        return value;
    }
}

// lists

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

    run() {
        let list = variables.get(this.list);

        if(list == undefined) {
            console.error("!!!!!Variable " + this.list + " doesn't exist!!!!!");
            return undefined;
        }

        let index = this.index.run();
        let value = list[index];

        if(value == undefined) {
            console.error("!!!!!Index " + index + " is out of bounds!!!!!");
            return undefined;
        }

        return value;
    }
}

module.exports.ListLength = class ListLength {
    constructor(list) {
        this.list = list;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Length! " + 
            "List = " + this.list
        );

        return output;
    }

    run() {
        let list = variables.get(this.list);

        if(list == undefined) {
            console.log("!!!!!Variable " + list + " list doesn't exist!!!!!");
            return undefined;
        }

        return list.length;
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

    run() {
        let list = variables.get(this.list);

        if(list == undefined) {
            console.error("!!!!!Variable " + list + " doesn't exist!!!!!");
            return undefined;
        }

        let type = listTypes.get(this.list);

        let value = this.value.run();

        switch(type) {
            case "num":
                if((typeof value) != "number") {
                    console.error("!!!!!Value must be of type num!!!!!");
                    return undefined;
                }

                break;
            
            case "string":
                if((typeof value) != "string") {
                    console.error("!!!!!Value must be of type string!!!!!");
                    return undefined;
                }

                break;

            case "bool":
                if((typeof value) != "boolean") {
                    console.error("!!!!!List value must be of type bool!!!!!");
                    return undefined;
                }

                break;
        }

        list.push(value);

        return true;
    }
}

module.exports.ListRemove = class ListRemove {
    constructor(list, index) {
        this.list = list;
        this.index = index;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Remove! " + 
            "List = " + this.list + 
            "Index = " + this.index.print(level + 1)
        );

        return output;
    }

    run() {
        let list = variables.get(this.list);

        if(list == undefined) {
            console.error("!!!!!Variable " + list + " doesn't exist!!!!!");
            return undefined;
        }

        let index = this.index.run();

        list.splice(index, 1);

        return true;
    }
}

module.exports.ListSetValue = class ListSetValue {
    constructor(list, index, value) {
        this.list = list;
        this.index = index;
        this.value = value;
    }
    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "List Set! " + 
            "List = " + this.list + 
            "\n" + getIndent(level + 1) + 
            "Index = " + this.index.print(level + 2) + 
            "\n" + getIndent(level + 1) + 
            "Value = " + this.value.print(level + 2)
        );

        return output;
    }

    run() {
        let list = variables.get(this.list);

        if(list == undefined) {
            console.error("!!!!!Variable " + list + " doesn't exist!!!!!");
            return undefined;
        }

        let index = this.index.run();

        let type = listTypes.get(this.list);

        let value = this.value.run();

        switch(type) {
            case "num":
                if((typeof value) != "number") {
                    console.error("!!!!!Value must be of type num!!!!!");
                    return undefined;
                }

                break;
            
            case "string":
                if((typeof value) != "string") {
                    console.error("!!!!!Value must be of type string!!!!!");
                    return undefined;
                }

                break;

            case "bool":
                if((typeof value) != "boolean") {
                    console.error("!!!!!List value must be of type bool!!!!!");
                    return undefined;
                }

                break;
        }

        list[index] = value;

        return true;
    }
}

module.exports.StringTerm = class StringTerm {
    constructor(child) {
        this.child = child;
    }

    print(level) {
        let output = (
            "\n" + 
            getIndent(level) + 
            "String Term!"
        );

        output += this.child.print(level + 1);

        return output;
    }

    run() {
        return this.child.run();
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

    run() {
        return parseInt(this.value);
    }
}

module.exports.String = class String {
    constructor(value) {
        this.value = value;
    }

    print(level) {
        return "\n" + getIndent(level) + "String! " + this.value;
    }

    run() {
        return this.value;
    }
}

module.exports.List = class List {
    constructor(type, elements) {
        this.elements = elements;
        this.type = type;
        this.children = elements;
    }

    print(level) {
        let output = "\n" + getIndent(level) + "List! ";
        output += "List Type: " + this.type + ", " + " Elements:";

        for(let i = 0; i < this.children.length; i++) {
            output += this.children[i].print(level + 1);
        }

        return output;
    }

    run() {
        let list = [];

        for(let child of this.children) {
            let value = child.run();
            
            // type checking is handled during parsing
            list.push(value);
        }

        return list;
    }
}