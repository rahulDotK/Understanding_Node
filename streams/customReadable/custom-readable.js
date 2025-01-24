const { Readable } = require("stream");
const fs = require("fs");

class FileReadStream extends Readable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
    }

    _construct(callback) {
        console.log(JSON.stringify(callback));
        fs.open(this.fileName, "r", (err, fd) => {
            if (err) return callback(err);
            this.fd = fd;
            callback();
        });
    }

    _read(size) {
        console.log({ size });

        const buff = Buffer.alloc(size);

        // this.push(buff.subarray(0, 5));
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err);
            // null is to indicate the end of the stream.
            this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null);
        });
    }

    _destroy(error, callback) {
        if (this.fd) {
            fs.close(this.fd, err => callback(err || error));
        } else callback(error);
    }
}

const stream = new FileReadStream({
    fileName: "text.txt",
});

stream.on("data", chunk => {
    console.log(chunk.toString());
});

stream.on("end", chunk => {
    console.log("Stream is done reading!");
});
