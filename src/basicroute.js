module.exports = function(app, path, ejs, fs, users){

	/*
	* Route page d'acceuil
	*/
	app.get('/', function(req, res){
		if (req.session.userinfo){
			fs.readFile(path.resolve('indexT.html'), 'utf-8', function(err, content) {
				if (err) {
					res.end('error occurred' + err);
					return;
				} 
   			var renderedHtml = ejs.render(content, {name: req.session.userinfo.name});  //get redered HTML code
   			res.end(renderedHtml);
   		});
		} else {
			res.sendFile(path.resolve('index.html'));
		}
		

	})
	
	/*
	* route front page register
	*/
	app.get('/register', function(req, res){
		res.sendFile(path.resolve('view/register.html'));
	});
	/*
	* route front page login
	*/
	app.get('/login', function(req, res){
		res.sendFile(path.resolve('view/login.html'));
	});
	
}
