
var app = require('express')();
var fallback = require('express-history-api-fallback');
var http = require('http').Server(app);
var proxy = require('express-http-proxy');
var request = require('request');
var minify = require('express-minify');
var compression = require('compression');

//Allow mobile application cross origin
app.use(function (req, res, next) {
	res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.append('Access-Control-Allow-Credentials', 'true');
	res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE']);
	res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

/*app.use(compression());
app.use(minify({cache: __dirname + '/cache'}));*/

app.get('/', function(req, res){
	res.sendFile(__dirname + "/dist/farron/index.html");
});



//app.use('/api', proxy('localhost:5000/api'));

app.use('/api', function(req, res) {
  var url = 'http://localhost:5000/api'+ req.url;
  var r = null;
  if(req.method === 'POST') {
     r = request.post({uri: url, json: req.body});
  } else {
     r = request(url);
  }

  req.pipe(r).pipe(res);
});

app.use(require('express').static(__dirname + "/dist/farron/"));
app.use(fallback('index.html', { root: __dirname + "/dist/farron/" }));
http.listen(3000, function(){
	console.log('Listening on port 3000...');	
});