### File Extension
- Not enforced yet, but thinking about `.lang`.

### Semicolons?
- Yes, whitespace doesn't matter, and semicolons are the only way to signify the end of statements.

### Variable Declartion
- `num x = 5;`

### Variable Assignment
- Can reassign the value of variables with `x = 2;`
- Can increment with `x += 2;`

### Types
- `num`: Integer or float
- `list`: List
- `string`: String

#### String
- Can use either `"` or `'`.
- Can convert any type to string with `myInt.toString()`

#### List
- Declare with `list[num] myList = [1, 2, 3]`  *(can also declare as empty)*
- Access element with `myList.get(0)`
- Add element with `myList.add(4)`
- Modify element with `myList.set(0, 1234)`
- Get length with `myList.length()`

### Loops
- ```
    while(count < 10) {
        count += 1;
    }

### Math
- `+`: Addition
- `-`: Subtraction
- `*`: Multiplication
- `/`: Division
- `||`: Or
- `or`: Or
- `&&`: And
- `and`: And
- `![comparison]`: Not - the only way to use the not operation is to wrap a comparison around the not brackets. Also works for or and and, for instance `![a < 1 && b > 2]`

*Note that parentheses are not supported around comparisons or expressions.*

### Comments
- `#`: Single-line comment
- `## #`: Multi-line comment