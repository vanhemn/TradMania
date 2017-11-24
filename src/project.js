module.exports = function(app, users, path, ejs, fs, project, fileUpload, doc){
	ObjectId = require('mongodb').ObjectID;


	/*
	* route front editing projet
	* reserver aux utilisateur connecté
	*/
	app.get('/editprojet', function(req, res){ 
		project.findOne({_id:ObjectId(req.query.q)}, function(err, ress){
			if (ress !== null && req.session.userinfo){
				fs.readFile(path.resolve('view/edit_project.html'), 'utf-8', function(errr, content) {
					if (err) {
						res.end('error occurred' + err);
						return;
					} 
   			var renderedHtml = ejs.render(content, {projet: ress, navbar:req.session.userinfo});  //get redered HTML code
   			res.end(renderedHtml);
   		});
			} else {
				res.send("404 Not found");
			} 
		})
	});

	/*
	* Route affichant les information détaillé d'un projet
	* prend un paramettre q en get contenant l'id du projet
	* reserver aux utilisateur connecté
	*/
	app.get('/viewprojet', function(req, res){ 
		project.findOne({_id:ObjectId(req.query.q)}, function(err, ress){
			if (ress !== null && req.session.userinfo){
				fs.readFile(path.resolve('view/view_project.html'), 'utf-8', function(errr, content) {
					if (err) {
						res.end('error occurred' + err);
						return;
					} 
   			var renderedHtml = ejs.render(content, {projet: ress, navbar:req.session.userinfo});  //get redered HTML code
   			res.end(renderedHtml);
   		});
			} else {
				res.send("404 Not found");
			} 
		})
	});

	/*
	* Route front de l'upload de projet
	*/
	app.get('/uprojet', function(req, res){
		if (req.session.userinfo)
			res.sendFile(path.resolve('view/UploadProject.html'));
		else
			res.send("404 Forbidden");

	}); 


	/*
	* Route affichant a liste des projet
	*/
	app.get('/projet', function(req, res){
		project.find({}).toArray(function(err, result) {
			console.dir(result);
			fs.readFile(path.resolve('view/Projet.html'), 'utf-8', function(err, content) {
				if (err) {
					res.end('error occurred' + err);
					return;
				} 
   			var renderedHtml = ejs.render(content, {projet: result, navbar: req.session.userinfo});  //get redered HTML code
   			res.end(renderedHtml);
   		});
		});
	});


	/*
	* Edit de projet
	*/
	app.post('/editprojet', (req, res) => {
		var date = Date();
		if(req.files){
			req.body.img = req.files.img.name + date + '.jpg'
			let img = req.files.img;
			img.mv(path.resolve('public/img/' + req.files.img.name + date + '.jpg'), function(err) {
				if (err)
					console.log(err)
			});
		}
		console.log(req.body)
		project.update({_id : ObjectId(req.body._id2), owner:req.session.userinfo._id},{$set : req.body},function(err, ress){
			console.log(err)
			if (err)
				res.send(err);
			else{
				res.redirect('/editprojet?q=' + req.body._id2);
			}
		});
		
	});

	/*
	* Route de création de projet prend en parametre un json contenant les information sur le projet (formulaire sur uprojet en get)
	* reserver aux utilisateur connecté
	* traiter le fichier docx ~~ not finished
	*/
	app.post('/uprojet', (req, res) => {
		if (req.files){
			var date = Date();
			if(req.files.img){
				req.body.img = req.files.img.name + date + '.jpg'
				let img = req.files.img;
				img.mv(path.resolve('public/img/' + req.files.img.name + date + '.jpg'), function(err) {
					if (err)
						console.log(err)
				});
			}
			req.body.docx = req.files.docx.name + date + '.docx'
			let docx =req.files.docx;
			docx.mv(path.resolve('public/docx/' + req.files.docx.name + date + '.docx'), function(err) {
				if (err)
					console.log(err)
				else {
					require('./indexer.js')(req.body.docx, doc, path, function(iddoc){
						req.body.owner = req.session.userinfo._id;
						req.body.docid = iddoc;
						project.insert(req.body,function(err, ress){
							if (err)
								res.end(err);
							else
								res.redirect('/projet');
						})	
					});
				}
			});
		}
	});

	/*
	* supprime un projet
	*/
	app.get('/rmprojet', (req, res) => {
		project.remove({_id : ObjectId(req.query.q), owner:req.session.userinfo._id});
		res.redirect('../');
	})
}