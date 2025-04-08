### File Extension
- Whatever you want

### Semicolons?
- Yes, whitespace doesn't matter, and semicolons are the only way to signify the end of statements

### Variable Declartion
- `num x = 5;`
- Note that variables can only contain letters, but can be any mix of lowercase or uppercase letters
- Also note that variables cannot start with a type in the name *(for instance stringList is not a valid variable name, but myStringList is)*

### Variable Assignment
- Can reassign the value of variables with `x = 2;`
- Can increment with `x += 2;`

### Types
- `bool`: boolean
- `num`: Integer or float
- `string`: String
- `list`: List

#### Boolean
- Values are either `true` or `false`, cannot use comparison or not operator as part of declaration or assignment
- Have to explicity compare to `true` or `false` in comparisons (*for instance have to do `while(a == true)` can't just do `while(a)`*)
- Cannot use not operator directly on a boolean for declarations and assignments *(for instance cannot do `bool a = ![b]`)*, as well as for comparisons *(for instance have to do `while(![a == true])`)*

#### String
- Can use either `"` or `'`.
- Can convert any type to string with `myInt.toString()`
- Can concatenate two strings with `+`

#### List
- Declare with `list[num] myList = [1, 2, 3]`  *(can also declare as empty, and each value can also be an expression)*
- Can reassign with `myList = [4]`
- Access element with `myList.get(index)` *(can also be an expression)*
- Add element with `myList.add(value)` *(can also be an expression)*
- Remove element with `myList.remove(index)` *(can also be an expression)*
- Modify element with `myList.set(index, value)` *(both can also be an expression)*
- Get length with `myList.length()`
- The only two supported list types are num and string
- Nested lists? No
- Multi-dimensional lists? NO

### Loops
- ```
    while(count < 10) {
        count += 1;
    }

### Functions
- No

### Math
- `+`: Addition
- `-`: Subtraction
- `*`: Multiplication
- `/`: Division
- `||`: Or
- `or`: Or
- `&&`: And
- `and`: And
- `![comparison]`: Not operator - the only way to use the not operation is to wrap a comparison around the not brackets. Also works for or and and, for instance `![a < 1 && b > 2]`

*Note that parentheses are not supported around comparisons or expressions*

### Nesting?
- Yes, up to infinity for everything except for lists

### Scope?
- No, everything is just global

### Comments
- `#`: Single-line comment
- `## comment here #`: Multi-line comment