const http = require('http');
const https = require('https');

// Override Agent constructors to force keepAlive to be false
const originalHttpAgent = http.Agent;
http.Agent = function(options) {
    const opts = options || {};
    opts.keepAlive = false;
    return new originalHttpAgent(opts);
};
http.Agent.prototype = originalHttpAgent.prototype;

const originalHttpsAgent = https.Agent;
https.Agent = function(options) {
    const opts = options || {};
    opts.keepAlive = false;
    return new originalHttpsAgent(opts);
};
https.Agent.prototype = originalHttpsAgent.prototype;

// Also override globalAgent keep-alive properties
if (http.globalAgent) http.globalAgent.keepAlive = false;
if (https.globalAgent) https.globalAgent.keepAlive = false;

console.log("--> Monkey-patched: Global HTTP/HTTPS Keep-Alive has been disabled.");
