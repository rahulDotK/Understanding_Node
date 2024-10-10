// Promises API
/* const fsPromise = require("fs/promises");

(async () => {
  try {
    const fileHandler = await fsPromise.open("./writeMany.txt", "w");
    let curr = 0;
    console.time("writeMany");
    while (curr < 100000) {
      await fileHandler.write(curr + " ");
      curr++;
    }
    console.timeEnd("writeMany");
    await fileHandler.close();
  } catch (error) {
    console.log(error);
  }
})(); */

// Callback API
/* const fs = require("fs");
(() => {
  fs.open("./writeMany.txt", "w", (err, fd) => {
    let curr = 0;
    console.time("writeMany");
    console.log({ fd });
    while (curr < 100000) {
      // fs.write(fd, curr + " ", () => {});
      const buff = Buffer.from(curr + " ", "utf-8");
      fs.writeSync(fd, buff);
      curr++;
    }
    console.timeEnd("writeMany");
  });
})(); */

// Promises API + STREAMS
/* const fsPromise = require("fs/promises");

(async () => {
  try {
    const fileHandler = await fsPromise.open("./writeMany.txt", "w");
    const stream = fileHandler.createWriteStream();
    let curr = 0;
    console.time("writeMany");
    while (curr < 100000) {
      const buff = Buffer.from(curr + " ", "utf-8");
      stream.write(buff);
      curr++;
    }
    console.timeEnd("writeMany");
    await fileHandler.close();
  } catch (error) {
    console.log(error);
  }
})(); */

// Promise + Streams with Memory issue fix
const fsPromise = require("fs/promises");

(async () => {
  try {
    const fileHandler = await fsPromise.open("./src.txt", "w");
    const stream = fileHandler.createWriteStream();
    // 8 bits = 1 bytes
    // 1000 bytes = 1 KB
    // 1000 KB = 1 MB
    // const buff = Buffer.alloc(16383, 10);
    // console.log(buff);
    // console.log(stream.write(buff));
    // console.log(stream.write(Buffer.alloc(1, 0)));

    // stream.on("drain", () => {
    //     console.log(stream.write(Buffer.alloc(16384, 0)));

    //     console.log(stream.writableLength);
    //   console.log("We are now safe to write more");
    // });

    let curr = 0;
    const numOfWrites = 100000;
    const loop = () => {
      while (curr < numOfWrites) {
        const buff = Buffer.from(curr + " ", "utf-8");
        if (curr === numOfWrites - 1) {
          console.log(buff.toString("utf-8"));
          return stream.end(buff); // To emit "finish" event
        }
        curr++;

        if (!stream.write(buff)) break;
      }
      return;
    };
    console.time("writeMany");
    loop();
    stream.on("drain", () => {
      // console.log("Drained!!!", stream.writableLength);
      loop();
    });

    stream.on("finish", () => {
      console.timeEnd("writeMany");

      //   fileHandler.close();
    });

    stream.on("close", () => {
      console.log("Stream was closed");
    });
  } catch (error) {
    console.log(error);
  }
})();
