const { Buffer } = require("buffer");

const memoryContainer = Buffer.alloc(4);


memoryContainer[0] = 0xf4;
memoryContainer[1] = 0x34;
// memoryContainer.writeInt8(-34,2);
memoryContainer[2] = 0x00;
memoryContainer[3] = 34.59;

console.log(
    { memoryContainer },
    memoryContainer.readInt8(2),
    memoryContainer[0].toString(2)
);