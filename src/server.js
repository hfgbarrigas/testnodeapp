import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {Log} from './logger';

import dummyRoutes from './routes/dummy';

// initialize the express server
const app = express();

// configure port
const port = process.env.PORT || 8080;

// disable express default headers
app.disable('x-powered-by');

// attach request/response morgan logger
app.use(morgan('combined', {
	skip: function (req, res) {
		return req.url.indexOf('/health') !== -1;
	}
}));

// attach body parsers
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', dummyRoutes);

// setup healthcheck
app.get('/api/health', function respond(req, res) {
	res.send({status: 'UP'});
});

//any req path unmatched
app.use('*', function (req, res) {
	res.status(404).send();
});

// global error handler
app.use(function (err, req, res, next) {
	Log.error({
		message: 'Error processing request',
		err: err.toString()
	});
	res.status(500).send({
		status: 'ERROR',
		message: 'UNKNOWN_SERVER_ERROR'
	});
	next();
});

// start accepting connections
module.exports = app.listen(port);

Log.info({
	message: 'API now Listening on ' + port
});
