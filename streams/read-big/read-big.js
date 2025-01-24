const fs = require("fs/promises");

(async () => {
    console.time("readBig");
    const fileHandleRead = await fs.open("./src.txt", "r");
    const fileHandleWrite = await fs.open("./test.txt", "w");

    const streamRead = fileHandleRead.createReadStream({
        /* highWaterMark: 16384 */
    });
    const streamWrite = fileHandleWrite.createWriteStream();
    let split = "";
    streamRead.on("data", chunk => {
        const numbers = chunk.toString("utf-8").split(" ");
        if (Number(numbers[0]) + 1 !== Number(numbers[1])) {
            numbers[0] = split + numbers[0];
        }

        if (Number(numbers.at(-1)) - 1 !== Number(numbers.at(-2))) {
            split = numbers.pop();
        }

        numbers.forEach(num => {
            if (Number(num) % 10 === 0) {
                const bol = streamWrite.write(num + " ");
                if (!bol) {
                    streamRead.pause();
                    console.log("Paused");
                }
            }
        });
        /*  if (!streamWrite.write(buff)) {
          streamRead.pause();
          console.log("Paused");
        } */
    });

    streamWrite.on("drain", () => {
        console.log("Drained!");
        streamRead.resume();
    });

    streamRead.on("end", () => {
        console.log("Ended!");
        console.timeEnd("readBig");
    });
})();
