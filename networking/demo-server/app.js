const http = require("http");

const port = 4090;
const host = "192.168.4.115";

const server = http.createServer((req, res) => {
    const data = "";


    res.setHeader("Content-Type", "application/json");
    res.setHeader("Connection", "close")
    res.statusCode = 200
    res.end(JSON.stringify(data));
})

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})