const EventEmitter = require("./events");
const myE = new EventEmitter();
myE.on("foo", () => console.log("EVENT EMITTER"));
myE.on("foo", () => console.log("EVENT EMITTED"));
myE.on("foo", (x) => console.log("EVENT EMITTED " + x));
myE.emit("foo", "with Parameter");
myE.emit("foo", "with Parameter");

myE.once("goblygook", () => console.log("goblygook"));
myE.emit("goblygook", "with Parameter"); // emitted only once
myE.emit("goblygook", "with Parameter");
myE.emit("goblygook", "with Parameter");