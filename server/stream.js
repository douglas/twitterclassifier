//Websocket server
//buffer chunks of twitter stream and forward bolb tweet
var sys = require("sys");
var http = require("http"),
ws = require("./lib/ws/ws"),
fs = require('fs'),
arrays = require("./lib/ws/arrays"),
OAuth = require('./lib/node-oauth').OAuth;

var credsJSON = fs.readFileSync('./credentials.json', 'utf-8');
var creds = JSON.parse(credsJSON);
var twitterConsumerKey = creds.consumerKey,
twitterConsumerSecret = creds.consumerSecret,
twitterAccessToken = creds.accessToken,
twitterAccessTokenSecret = creds.accessTokenSecret;

var count = 0;
var clients = [];
var EventEmitter = require('events').EventEmitter;


oAuth = new OAuth("http://twitter.com/oauth/request_token",
"http://twitter.com/oauth/access_token",
twitterConsumerKey, twitterConsumerSecret,
"1.0A", null, "HMAC-SHA1");
var request = oAuth.get("http://stream.twitter.com/1/statuses/sample.json",
twitterAccessToken, twitterAccessTokenSecret);

//response real time twitter stream event					
request.addListener('response',
function(response) {
    response.setEncoding('utf8');
    var buffer = "";
    response.addListener('data',
    function(chunk) {
        buffer += chunk;
        if (chunk.substr("-1") == "\n") {
            clients.each(function(c) {
                buffer.split("\n").each(
                function(tweet) {
                    if (tweet.trim().length > 0) {
                        try
                        {
                            JSON.parse(tweet);
							 console.log('Tweet:'+tweet);
                            c.write(tweet);
                        } catch(e) {
							 console.log('error on json syntax');
                        }

                    }
                }
                )
            });
        }
        buffer = "";
    });
    response.addListener('end',
    function() {
        console.log('--- END ---');
    });
});
request.end();


// Websocket TCP server
var server = ws.createServer(function(websocket) {
    clients.push(websocket);
    websocket.addListener("connect",
    function(resource) {
        // emitted after handshake
        sys.debug("connect: " + resource);
    }).addListener("close",
    function() {
        // emitted when server or client closes connection
        clients.remove(websocket);
        sys.debug("close");
    });
});

server.listen(8080);