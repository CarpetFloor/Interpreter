# Interpreter
 My attempt at creating a simple JS-based interpreter. The goal for this was to create a simple language, largely as a learning experience and for fun, that would be able to calculate the Fibonacci sequence up to n. It contains common basic language features, but is missing a lot of features that countless languages have, in addition to being very far from optimal (for instance, garbage college was not implemented). 

# Instructions
To run the interpreter, run `node Interpreter.js [relative file path]`.

Check out [Syntax.md](Syntax.md) for the syntax of this language.\
Also check out [CFG.json](CFG.json) to view the context-free grammar for this language (which the implementation is based upon). To actually open the grammar, you can use [this](https://github.com/thereisatablehere/CFG_Planner) tool.

# Roadmap
&#9745; Context-Free Grammar\
&#9745; Lexer\
&#9744; Parser\
&#9744; Runner
