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
- Can convert numbers and/ or variables to string with `toString[a + 5]`
- Can concatenate two strings with `+`
- Can concatenate a string with a number with `+`, but the first term must be a string

#### List
- Declare with `list[num] myList = [1, 2, 3]`
- Can reassign with `myList = [4, 3]`
- Access element with `get|myList, index|`
- Add element with `myList.add(value)`
- Remove element with `myList.remove(index)`
- Modify element with `myList.set(index, value)`
- Get length with `length|myLength|`
- The only two supported list types are num and string *(for instance **cannot** use `a = get|myList, i + 1|`)*
- List indices and values **cannot** be expressions or string expressions
- Nested lists? No, including getting values 
- Multi-dimensional lists? No
- Negative index values? No

### Loops
- ```
    while(count < 10) {
        count += 1;
    }

### Conditionals
- ```
    if(a > 0) {
        a -= 1;
    }
    else {
        a += 1;
    }

### Functions
- No

### Nesting?
- Yes, up to infinity for everything except lists

### Scope?
- No, everything is just global

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

### Comments
- `#`: Single-line comment
- `## comment here #`: Multi-line comment