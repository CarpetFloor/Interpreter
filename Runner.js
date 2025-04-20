module.exports.run = function(tree) {
    console.log("Running");
    console.log("Parse tree");
    console.log(tree);
    console.log("__________");

    tree[0].run();
}