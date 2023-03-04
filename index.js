const http = require('http');
const readline = require('readline');
const hostname = '127.0.0.1';
const port = 8080;
var log4js = require("log4js");
const fs = require('fs');

log4js.configure({
    appenders: { logs: { type: "file", filename: "logs.log" } },
    categories: { default: { appenders: ["logs"], level: "info" } },
  });
  
const logger = log4js.getLogger("logs");
const server = http.createServer(async (request, response) => {
    request.on('error', (err) => {
      console.error(err);
      response.statusCode = 400;
      logger.error("Error: " + err.message);
      response.end();
    });
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    let numLogs = await countLines(fs.createReadStream('logs.log'));
    console.log(numLogs);
    if(numLogs % 50 == 0) response.end('Hello there, congrats and here is your flag: netsec-is-such-a-great-course-to-take');
    // console.log(response);
    logger.info(response.req.url);
    response.end('Hello there, ready to catch the flag? ');
  });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function countLines(input) {
    let lineCount = 0;
    for await (const _ of readline.createInterface({input, crlfDelay: Infinity})) {
        lineCount++;
    }
    return lineCount;
}
