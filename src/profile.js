module.exports = function(app, path, ejs, fs, users, project){
	var hash = require('hash.js');


	app.get('/dashboard', function(req, res){ 
		if(req.session.userinfo){
			project.find({owner:req.session.userinfo._id}).toArray(function(err, result) {
				project.find({users:req.session.userinfo._id}).toArray(function(err2, result2) {
					fs.readFile(path.resolve('view/dashboard.html'), 'utf-8', function(errr, content) {
						if (err) {
							res.end('error occurred' + err);
							return;
						} else {
						var renderedHtml = ejs.render(content, {navbar: req.session.userinfo, projets: result, projets2:result2});  //get redered HTML code
						res.end(renderedHtml);
					}

				})
				})
			});


		} else {
			res.send("404 Not found");
		}
	});

	/*
	* Route visionnage enfo profile prend un paramettre q en get contenant l'id de l'utilisateur
	*/
	app.get('/userprofile', function(req, res){
		users.findOne({_id:ObjectId(req.query.q)}, function(err, ress){
			if (ress !== null){
				fs.readFile(path.resolve('view/userprofil.html'), 'utf-8', function(errr, content) {
					if (err) {
						res.end('error occurred' + err);
						return;
					} 
					project.find({owner:req.query.q}).toArray(function(err, result) {
						project.find({users:req.query.q}).toArray(function(err, result2) {
							var renderedHtml = ejs.render(content, {user: ress, navbar: req.session.userinfo, projets: result, projets2: result2});  //get redered HTML code
							res.end(renderedHtml);
						})
					})
				});
			} else {
				res.send("404 Not found");
			} 
		})
		
	});

	/*
	* Route modification du profile POST
	* prend un parrametre un json contenant les donnée a modifier (formulaire sur le front) les champ vide ne sont pas envoyé dans le json
	* reserver aux utilisateur connecté
	*/
	app.post('/profile', (req, res) => {
		console.log(req.body);
		if (req.files){
			console.log('hey');
			console.dir(req.files.img)
			var date = Date();
			req.body.img = req.files.img.name + date + '.jpg'
			let img = req.files.img;
			img.mv(path.resolve('public/img/' + req.files.img.name + date + '.jpg'), function(err) {
				if (err)
					console.log(err)
			});
		}
		var vpass = req.session.userinfo.pass;
		var vlogin = req.session.userinfo.name;
		if(req.body.name)
			vlogin = req.body.name;
		if(req.body.pass){
			console.log(vpass);
			req.body.pass = hash.sha256().update(req.body.pass).digest('hex');
			vpass = req.body.pass;
			console.log(vpass);
		}
		users.update({_id : ObjectId(req.session.userinfo._id)},{$set : req.body},function(err, ress){
			console.log(err)
			if (err)
				res.send(err);
			else{
				users.findOne({name:vlogin,pass:vpass}, function(err, ress){
					if (ress !== null){
						req.session.userinfo = ress;
						res.redirect('/profile');
					}
				})	
			}
		})
	});

	/*
	* Route front du profile (affichage de son profile perso + formumlaire de notification)
	* reserver aux utilisateur connecté
	*/
	app.get('/profile', function(req, res){
		if (req.session.userinfo)
			fs.readFile(path.resolve('view/profile.html'), 'utf-8', function(err, content) {
				if (err) {
					res.end('error occurred' + err);
					return;
				} 
   			var renderedHtml = ejs.render(content, {user: req.session.userinfo});  //get redered HTML code
   			res.end(renderedHtml);
   		});
		else
			res.send("404 Forbidden");
	});

	/*
	* Route affichant la liste des utilisateurs
	*/
	app.get('/traducteur', function(req, res){ 
		users.find({}).toArray(function(err, result) {
			console.dir(result);
			fs.readFile(path.resolve('view/traducteur.html'), 'utf-8', function(err, content) {
				if (err) {
					res.end('error occurred' + err);
					return;
				} 
   			var renderedHtml = ejs.render(content, {trad: result, navbar: req.session.userinfo});  //get redered HTML code
   			res.end(renderedHtml);
   		});
		});
	})

}
