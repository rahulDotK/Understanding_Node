const fs = require("fs");
const content = fs.readFileSync("./text.txt");
console.log(content[0].toString(2));
