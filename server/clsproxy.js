// uClassify JSONP Proxy for NodeJS
var sys = require("sys"),
http = require("http"),
url = require("url"),
fs = require('fs');
var apiPort = parseInt(process.env.PORT) || 8001;
var credsJSON = fs.readFileSync('./credentials.json', 'utf-8');
var creds = JSON.parse(credsJSON);
var uclassKey = creds.uclassKey;

http.createServer(function(req, res) {

    var params = url.parse(req.url, true).query;

    var text = '';
    var method = 0;
    var response = '';
    var requestURL = '';

    function writeUsage(res) {
        res.writeHead(200, {
            'Content-Type': "text/plain"
        });
        res.write("JSON-P PROXY\n\n");
        res.write("Usage:\n");
        res.write("\tmethod: 0 classify according to tweet, 1 classify according to query extension, (required, defaut is 0).\n");
        res.write("\ttext: search tokens.\n");
        return res.end();
    }

    function writeJSONP(contents, override) {

        res.writeHead(200, {
            'Content-Type': 'application/javascript'
        });

        res.write("jsonp" + "(" + contents + ")");

        return res.end();
    }

    //show help text
    if (typeof params == 'undefined') {
        return writeUsage(res);
    }

    if (!params.method) {
        return writeUsage(res);
    }
    var ucURL = "";
    if (params.method == 0) {
        ucURL = "http://uclassify.com/browse/uClassify/Topics/ClassifyText?readkey=" + uclassKey + "&version=1.01&output=json&text="
        + escape(params.text);
    }
    if (params.method == 1) {
        ucURL = "http://uclassify.com/browse/uClassify/Topics/ClassifyUrl?readkey=" + uclassKey + "&output=json&version=1.01&url=http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D" + escape(params.text);
    }

    var requestURL = url.parse(ucURL);
    if (typeof requestURL.host == 'undefined') {
        return writeJSONP( - 1, true);
    }

    if (requestURL.protocol != 'http:') {
        return writeJSONP(requestURL.protocol);
    }

    var path = '';

    if (requestURL.pathname) {
        path += requestURL.pathname;
    }

    if (requestURL.search) {
        path += requestURL.search;
    }

    if (path == '') {
        path = '/';
    }

    var port = 80;

    if (requestURL.port) {
        port = requestURL.port;
    }

    console.log("URL:" + path);

    //add uclassify params
    var client = http.createClient(port, requestURL.hostname);
    var request = client.request("GET", path, {
        Host: requestURL.hostname,
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 6.0; Windows NT5.0)',
        'Accept-Language': 'en-us',
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7'
    });

    request.addListener('response',
    function(response) {
        var body = '';

        response.setEncoding("utf8");

        response.addListener("data",
        function(chunk) {
            body += chunk;
        });

        response.addListener('end',
        function() {
            try
            {
                JSON.parse(body);
                writeJSONP(body);
                console.log("Response:" + body);
            } catch(e) {
                //console.log('json syntax error');
                }
        });
    });

    request.end();

}).listen(apiPort);

sys.puts('Server running at http://127.0.0.1:' + apiPort);
