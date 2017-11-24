/*=====================Initialisation=====================*/
var express   =     require("express");
var app       =     express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const httpd = require('https');
var fs = require('fs');
var bodyParser = require('body-parser')
var ejs = require('ejs');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert'),
ObjectID = require('mongodb').ObjectID;
var path = require('path');
var session = require('express-session');
var fileUpload = require('express-fileupload');
// Connection URL 
var url = 'mongodb://localhost:27017/tradmania';
/*======================================================*/

// Middleware session
app.engine('html', require('ejs').renderFile);
app.use(fileUpload());

app.use(session(
{
	secret: 'frioplompoinote',
	saveUninitialized: false,
	resave: false
}
));

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

/*======================routes==========================*/ 
MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	var users = db.collection('users');
	var project = db.collection('project');
	var doc = db.collection('documents');
	/*------include fichier------*/
	require('./src/basicroute.js')(app, path, ejs, fs, users);
	require('./src/profile.js')(app, path, ejs, fs, users ,project); 
	require('./src/reglog.js')(app, users, path, ejs, fs);
	require('./src/project.js')(app, users, path, ejs, fs, project, fileUpload, doc);
	require('./src/tradtool.js')(app, users, path, ejs, fs, project, doc);

	/*===========================socket (outil de trad)======================*/
	io.on('connection', function(socket){
		console.log('a user connected {' + socket.request.connection.remoteAddress + "}");

		/*socket quans qq1 a trad une phrase ou un mot*/
		socket.on("tradon", function(data){
			var tt = "text." + data.index
			console.log(data);
			doc.update({_id : ObjectId(data._id)},{$set : {[tt]: {balise : data.balise,text : data.text, tool : data.tool}}},function(err, ress){
				if (!err){
					console.log(ress); /*change ca chez les autres*/
					console.log(err);
					io.sockets.emit("ctrad", data);
				}
			})
		})

		socket.on('disconnect', function(){
			console.log('user disconnected ' + socket.request.connection.remoteAddress);
		});

	});
})

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/", express.static(__dirname + '/public'));



/*==================start serv==================*/
http.listen(80, function(){
	console.log('listening on *:80');
});
