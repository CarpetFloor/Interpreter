let fs = require("fs");

fs.readFile("program.lang", "utf-8", function(error, data) {
    if(error) {
        console.log("ERROR reading program file:", error);
    }
    else {
        const program = data;
        console.log(program);
    }
});