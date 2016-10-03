var express = require('express'),
app = express(),
routes = require('./routes.js');


// Initialise the routes to listen to specific api calls
routes(app);

app.listen(3000, function() {
	console.log('The server is listening on port 3000!');
});

module.exports = app;
