// ****** Promise API ****** //
// const fs = require("fs/promises");

// (async () => {
//   try {
//     await fs.copyFile("file.txt", "copied-promise.txt");
//     console.log("Copying text file");
//   } catch (error) {
//     console.log(error);
//   }
// })();

// console.log("Check Async Promise");

// ****** Callback API ****** //
/* const fs = require("fs");

fs.copyFile("file.txt", "copied-callback.txt", (error) => {
  if (error) console.log(error);
  console.log("Copying text file");
});
console.log("Check Async Callback"); */

// ****** Synchronous API ****** //
const fs = require("fs");

console.log(
  "copying synchronously",
  fs.copyFileSync("file.txt", "copied-sync.txt")
); // undefined
console.log("Synchronously copied");
