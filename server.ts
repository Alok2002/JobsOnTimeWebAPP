import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import { join } from 'path';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';

// Express Engine
// Import module map for lazy loading
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const request = require('request');

const PORT = process.env.PORT || 4200;
const APIPORT = process.env.APIPORT || 5000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// Fix ReferenceError: KeyboardEvent is not defined
const domino = require('domino');
const fs = require('fs');
const template = fs.readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(template);
global['window'] = win;
global['document'] = win.document;
global['KeyboardEvent'] = win.Event;
global['Node'] = win.Node;
global['navigator'] = win.navigator;
global['Event'] = win.Event;
global['MouseEvent'] = win.Event;
global['Event']['prototype'] = win.Event.prototype;
global["object"] = win.object;
global["HTMLAnchorElement"] = domino.impl.HTMLAnchorElement;
global['Chart'] = win.Chart;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.use('/api/*', function (req, res) {
//   // var url = 'http://localhost:' + APIPORT + req.originalUrl;
//   var url = 'https://logajob.com.au' + req.originalUrl;
//   /*var r = request(url);  
//   req.pipe(r).pipe(res);*/
//   console.log(url)
//   const options = {
//     url: url,
//     headers: { 'Accept': '*/*' }
//   };

//   request(options)
//     .on('response', response => {
//       // This is an error
//       if (response.statusCode === 500) {
//         const error = new Error('File not found');
//         return error;
//       }
//       if (typeof response.end === 'function') {
//         req.pipe(response);
//       }
//       if (response.req.finished) {
//         console.log(response)
//         // return cb(null, response, 'application/pdf');
//       }
//     });
// });

//Allow mobile application cross origin
app.use(function (req, res, next) {
  res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.append('Access-Control-Allow-Credentials', 'true');
  res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE']);
  res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var url = 'http://localhost:' + APIPORT;
// var url = 'https://logajob.com.au';
app.use('/api', createProxyMiddleware({ target: url, changeOrigin: true }));

// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});