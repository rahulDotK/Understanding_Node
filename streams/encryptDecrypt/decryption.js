// Learn later :
// Encryption/Decryption => crypto
// Compression => zlib
// Hashing-Salting => crypto
// Decoding/Encoding => buffer,text-encoding/decoding

const { Transform } = require("stream");
const fs = require("fs/promises");

class Decrypt extends Transform {
    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== 0) chunk[i] -= 1;
            else chunk[i] = 255;
        }
        // this.push(chunk); 
        callback(null, chunk);
    }
}

(async () => {
    const readFileHandle = await fs.open("./write.txt", "r");
    const writeFileHandle = await fs.open("./decrypted.txt", "w");

    const readStream = await readFileHandle.createReadStream();
    const writeStream = await writeFileHandle.createWriteStream();

    const decrypt = new Decrypt();

    readStream.pipe(decrypt).pipe(writeStream);
})();
