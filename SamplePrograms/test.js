let upTo = 10;
let sequence = [];

let count = 0;
while(count < upTo) {
    
    if(count < 2) {
        sequence.push(count);
    }
    else {
        let a = sequence[count - 2];
        let b = sequence[count - 1];

        sequence.push(a + b);
    }

    count += 1;
}

let output = "";
count = 0;
while(count < sequence.length) {
    output += sequence[count];
    
    if(count < sequence.length - 1) {
        output += ", ";
    }

    count += 1;
}

console.log("First " + upTo + " terms of the Fibonacci Sequence:");
console.log(output);