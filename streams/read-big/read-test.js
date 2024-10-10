const fs = require("fs/promises");
const { styleText } = require("util");
(async () => {
  const fileHandleRead = await fs.open("./test.txt", "r");

  const streamRead = await fileHandleRead.createReadStream();

  streamRead.on("data", chunk => {
    const numbers = chunk.toString("utf-8").split(" ");

    numbers.forEach((number, index) => {
        if(index * 10 !== Number(number)) console.log("Something went wrong at", { number, index})
    });
  });
})();
