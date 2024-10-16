const { Writable } = require("node:stream");
const fs = require("fs");

class FileWritableStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  // Runs after Constructor, Puts off other methods until callback is done calling
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        // has arrguments -> error exists, stop proceeding
        callback(err);
      } else {
        this.fd = fd;
        // no arguments ->  successfull
        callback();
      }
    });
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), err => {
        console.log("_writes");
        if (err) return callback(err);
        this.chunks = [];
        this.chunksSize = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }

    // I believe callback in _write is what emits "drain" event
  }

  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), err => {
      if (err) return callback(err);

      ++this.writesCount;
      this.chunks = [];
      callback(); // Emits "finish" Event and moves on to _destroy method
    });
  }

  _destroy(error, callback) {
    console.log("Number of writes:", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, err => {
        callback(err || error);
      });
    } else {
      callback(error);
    }
  }
}

(async () => {
  try {
    const stream = new FileWritableStream({
      fileName: "text.txt",
    });

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
    let d = 0;
    stream.on("drain", () => {
      ++d;
      console.log("drained");
      loop();
    });

    stream.on("finish", () => {
      console.log("Number of drains:", d);
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
