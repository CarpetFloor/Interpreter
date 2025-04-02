### File Extension
- Whatever you want

### Semicolons?
- Yes, whitespace doesn't matter, and semicolons are the only way to signify the end of statements

### Variable Declartion
- `num x = 5;`
- Note that variables can only contain letters, but can be any mix of lowercase or uppercase letters

### Variable Assignment
- Can reassign the value of variables with `x = 2;`
- Can increment with `x += 2;`

### Types
- `num`: Integer or float
- `string`: String
- `list`: List

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
- Yes, up to infinity for everything

### Scope?
- No, everything is just global

### Comments
- `#`: Single-line comment
- `## comment here #`: Multi-line comment