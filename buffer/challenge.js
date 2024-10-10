// 0100 1000 0110 1001 0010 0001
const {Buffer} = require("buffer");
/* const memoryContainer = Buffer.alloc(3);

Binary representation
memoryContainer[0] = 0b01001000;
memoryContainer[1] = 0b01101001;
memoryContainer[2] = 0b00100001;

Decimal representation
memoryContainer[0] = 72;
memoryContainer[1] = 105;
memoryContainer[2] = 33; */

// Hexadecimal representation
// const memoryContainer = Buffer.from([0x48, 0x69, 0x21]);



// const memoryContainer = Buffer.from("486921", "hex");
const memoryContainer = Buffer.from("Hi!", "utf-8"); // We are sending 'Hi!' as UTF8 encoded string.


console.log(
    {memoryContainer}, 
    memoryContainer.toString("utf-8") // UTF 8 bit decoding
);
