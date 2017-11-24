module.exports = function(app, users, path, ejs, fs, project,  doc){
	ObjectId = require('mongodb').ObjectID;


	app.get('/tradtool', function(req, res){ 
		project.findOne({$or: [{_id:ObjectId(req.query.q), users: req.session.userinfo._id}, {_id:ObjectId(req.query.q), owner: req.session.userinfo._id}]}, function(err, ress){ // ajouter si participe au projet ici
			if (ress !== null && req.session.userinfo){ 
				fs.readFile(path.resolve('view/tradtool.html'), 'utf-8', function(errr, content) {
					if (err) {
						res.end('error occurred' + err);
						return;
					} else {
						doc.findOne({_id:ObjectId(ress.docid)}, function(errrr, resss){
							if (!errrr){
								var renderedHtml = ejs.render(content, {docx: resss.text,did:ress, user:req.session.userinfo});  //get redered HTML code
								res.end(renderedHtml);
							}
						})
					}

				});
			} else {
				res.send("404 Not found");
			} 
		})
	});

	/*
	* add users to a project (débloque le fait de pouvoir trad)
	*/
	app.get('/utradadd', (req, res) => {
		console.log(req.session.userinfo._id);
		console.log(req.body);
		project.update({_id : ObjectId(req.query.q)},{$addToSet : {users:req.session.userinfo._id}},function(err, ress){
			if(err)
				console.log(err)
			res.redirect('../tradtool?q=' + req.query.q);
		})
	})

	/*
	* remove users to a project (bloc le fait de pouvoir trad)
	*/
	app.get('/utradrm', (req, res) => {
		console.log(req.session.userinfo._id);
		console.log(req.body);
		project.update({_id : ObjectId(req.query.q)},{$pull : {users:req.session.userinfo._id}},function(err, ress){
			if(err)
				console.log(err)
			res.redirect('../dashboard');
		})
	})


}