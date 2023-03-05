const http = require('http');
const readline = require('readline');
const hostname = '192.168.25.224';
// const hostname = '127.0.0.1';
const port = 5050;
var log4js = require('log4js');
const fs = require('fs');
var token = '';
log4js.configure({
  appenders: { logs: { type: 'file', filename: 'logs.log' } },
  categories: { default: { appenders: ['logs'], level: 'info' } },
});

const logger = log4js.getLogger('logs');
const server = http.createServer(async (request, response) => {
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    logger.error('Error: ' + err.message);
    response.end();
  });

  if (request.url.includes('/refreshtoken')) {
    try {
      console.log(request.url);
      let myArray = request.url.split('token=');
      token = myArray[1];
      console.log(token);
    } catch (e) {
      console.log('Error parsing the token from the querystring');
    }
    response.end('Updated refreshtoken, all set');
  } else {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    try {
      if (token && verifyKey(token, request.url))
        response.end(
          'Hello there, here is your flag: netsec-is-such-a-great-course-to-take'
        );
      else response.end('Hello there, catch the flag ;D ');
    } catch (e) {
      console.log(
        'Error parsing the credential, either not exist or wrong path'
      );
    }
    logger.info(response.req.url);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

async function countLines(input) {
  let lineCount = 0;
  for await (const _ of readline.createInterface({
    input,
    crlfDelay: Infinity,
  })) {
    lineCount++;
  }
  return lineCount;
}
function getQueryString(queryString) {
  var query = {};
  var pairs = (
    queryString[0] === '/' ? queryString.substr(2) : queryString
  ).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

function verifyKey(givenToken, url) {
  var decodedString = atob(givenToken);
  var queryStrings = getQueryString(url);
  console.log(queryStrings);
  let decodedArray = decodedString.split('/');
  console.log(decodedArray);

  // verify timestamp
  let time = getNearestTimestamp(),
    fivemin = 5 * 60 * 1000;
  if (Math.abs(time - Number(decodedArray[0])) > fivemin) {
    console.log('Expired token');
    return false;
  }

  // verify credential
  if (
    decodedArray[1] != queryStrings.user ||
    decodedArray[2] != queryStrings.password
  ) {
    console.log('Password does not match what we have');
    return false;
  }
  return true;
}

function getNearestTimestamp() {
  const roundDownTo = (roundTo) => (x) => Math.floor(x / roundTo) * roundTo;
  const roundDownTo5Minutes = roundDownTo(1000 * 60 * 5);
  const now = new Date();
  const msDown = roundDownTo5Minutes(now);
  console.log(msDown);
  return msDown;
}
