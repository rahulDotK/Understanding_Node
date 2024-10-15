const { pipeline } = require("stream");
const fs = require("fs/promises");

/* Usual Streams */
/* (async () => {
  const fileHandlerRead = await fs.open("./src.txt", "r");
  const fileHandleWrite = await fs.open("./copied.txt", "w");

  const streamRead = await fileHandlerRead.createReadStream();
  const streamWrite = await fileHandleWrite.createWriteStream();

  streamRead.on("data", chunk => {
    if (!streamWrite.write(chunk)) streamRead.pause();
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  });
})(); */

/* this wouldn't work if the file size is big */
/* (async () => {
  console.time("Copy");
  const destFile = await fs.open("./copied.txt", "w");
  const result = await fs.readFile("./src.txt"); // return whole file

  await destFile.write(result);
  console.timeEnd("Copy");
})(); */

/* Custom streams without Node js Streams*/
/* (async () => {
  console.time("Copy");

  const fileHandlerRead = await fs.open("./src.txt", "r");
  const fileHandleWrite = await fs.open("./copied.txt", "w");

  let bytesRead = -1;
  while (bytesRead !== 0) {
    const readResult = await fileHandlerRead.read(); // returns chunk of file
    bytesRead = readResult.bytesRead;
    console.log(readResult.buffer);
    if (bytesRead !== 16384) {
      const indeOfNotFilled = readResult.buffer.indexOf(0);
      const buff = Buffer.alloc(indeOfNotFilled);
      readResult.buffer.copy(buff, 0, 0, indeOfNotFilled);
      await fileHandleWrite.write(buff);
    } else {
      await fileHandleWrite.write(readResult.buffer);
    }
  }

  console.timeEnd("Copy");
})(); */

/* Custom streams with Node js Pipe*/
/* (async () => {
  console.time("Copy");

  const fileHandlerRead = await fs.open("./src.txt", "r");
  const fileHandleWrite = await fs.open("./copied.txt", "w");

  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandleWrite.createWriteStream();

  writeStream.on("pipe", () => {
    console.log("Piped to the readable stream");
  });
  writeStream.on("unpipe", () => {
    console.log("Unpiped!");
  });

  console.log(readStream.readableFlowing);
  readStream.pipe(writeStream);

  console.log(readStream.readableFlowing);
  readStream.on("end", () => {
    readStream.unpipe(writeStream);
    console.log(readStream.readableFlowing);
    console.timeEnd("Copy");
  });
})(); */

/* Custom streams with Node js Pipeline*/
(async () => {
  console.time("Copy");

  const fileHandlerRead = await fs.open("./src.txt", "r");
  const fileHandleWrite = await fs.open("./copied.txt", "w");

  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandleWrite.createWriteStream();

  pipeline(readStream, writeStream, err => {
    console.log(err);
    console.timeEnd("Copy");
  });
})();
