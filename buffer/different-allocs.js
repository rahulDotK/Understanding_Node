const { Buffer, constants } = require("buffer");

// const buffer = Buffer.alloc(10000, 0);

// Faster allocation but unsafe
const unSafeBuffer = Buffer.allocUnsafe(10000);

const buff = Buffer.allocUnsafeSlow(2);
console.log(buff.length);

// Buffer.from()  ---------|
//                         |-----> Both uses .allocUnsafe BTS
// Buffer.concat() --------|


/* for (let i = 0; i < unSafeBuffer.length; i++) {
  if (unSafeBuffer[i] !== 0) {
    console.log(
      "Element at position " + i + " has value: " + unSafeBuffer[i].toString(2)
    );
  }
} */
