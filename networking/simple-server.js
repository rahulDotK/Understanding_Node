const net = require("net") // Lowest Level Networking Module unlike http, DNS

const server = net.createServer((socket) => {
    /** 
     * every time a connection is made to the IP:port, this function will execute with a new socket object (instance of Duplex class).
     * socket:Duplex
    */

    socket.on("data", (data) =>{
        console.log(data.toString("utf-8"));
    })
})

server.listen(3099, "127.0.0.1", () => {
    console.log("Server is running on", server.address());
})