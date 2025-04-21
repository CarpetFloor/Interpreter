module.exports.run = function(tree) {
    const debug = false;
    
    if(debug) {
        console.log("Running");
        console.log("Parse tree");
        console.log(tree);
        console.log("__________");
    }

    tree[0].run();
}