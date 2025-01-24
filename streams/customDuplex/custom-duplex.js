// this class exists Because JS doesn't support multiple inheritance.
const { Duplex } = require("stream");
const fs = require("fs");

class DuplexStream extends Duplex {
    constructor({
        writableHighWaterMark,
        readableHighWaterMark,
        readableFileName,
        writableFileName,
    }) {
        super({ writableHighWaterMark, readableHighWaterMark });
        this.readableFileName = readableFileName;
        this.writableFileName = writableFileName;
        this.readFd = null;
        this.writeFd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCount = 0;
    }

    _construct(callback) {
        fs.open(this.readableFileName, "r", (err, readFd) => {
            if (err) return callback(err);
            this.readFd = readFd;
            fs.open(this.writableFileName, "w", (err, writeFd) => {
                if (err) return callback(err);
                this.writeFd = writeFd;
                callback();
            });
        });
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), err => {
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

    _read(size) {
        const buff = Buffer.alloc(size);

        fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err);
            // null is to indicate the end of the stream.
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        });
    }

    _final(callback) {
        fs.write(this.writeFd, Buffer.concat(this.chunks), err => {
            if (err) return callback(err);

            ++this.writesCount;
            this.chunks = [];
            callback(); // Emits "finish" Event and moves on to _destroy method
        });
    }

    _destroy(error, callback) {
        if (error) return callback(error);
        fs.close(this.readFd, readErr => {
            if (readErr) return callback(readErr);
            else {
                fs.close(this.writeFd, writeErr => {
                    if (writeErr) return callback(writeErr);
                    callback();
                });
            }
        });
    }
}

const duplex = new DuplexStream({
    readableFileName: "./read.txt",
    writableFileName: "./write.txt",
});

duplex.write(Buffer.from("this is a string 0\n"));
duplex.write(Buffer.from("this is a string 1\n"));
duplex.write(Buffer.from("this is a string 2\n"));
duplex.write(Buffer.from("this is a string 3\n"));
duplex.write(Buffer.from("this is a string 4\n"));
duplex.end(Buffer.from("this is a string 5\n"));

duplex.on("data", chunk => console.log(chunk.toString()));
