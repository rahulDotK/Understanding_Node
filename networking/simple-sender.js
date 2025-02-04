const net = require('net');

const socket = net.createConnection({ host: "127.0.0.1", port: 3099 }, () => {
    const buff = Buffer.from("Hello World")
    console.log(buff.byteLength)
    socket.write(buff)
})