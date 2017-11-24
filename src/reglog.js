module.exports = function(app, users, path, ejs, fs){
	ObjectId = require('mongodb').ObjectID;
	var hash = require('hash.js');

	/*
	* Route de login (back) crée une session express servant pour la suite
	* prend en parametre username le json du formulaire
	*/
	app.post('/login', (req, res, next) => {
		var vlogin = req.body.username;
		var vpass = hash.sha256().update(req.body.psswd).digest('hex');
		users.findOne({name:vlogin,pass:vpass}, function(err, ress){
			if (ress !== null){
				req.session.userinfo = ress;
				res.redirect('/');
			} else {
				res.redirect('/login');
			} 
			return next();
		})
	});


	/*
	* Route creation de compte
	* prend en parametre username le json du formulaire
	*/
	app.post('/register', (req, res) => {
		users.insert({"name" : req.body.username, "pass" : hash.sha256().update(req.body.psswd).digest('hex'), "mail" : req.body.email, "date" : Date()},function(err, ress){
			if (err)
				res.send(err);
			else{
				res.redirect('/login');
				console.log(ress);
			}
		})	
	});

	/*
	* Suprime l'expresse session et redirige sur l'acceuil
	*/
	app.get('/deco', (req, res) => {
		req.session.destroy();
		res.redirect('/');
	})

	/*
	* supprime un utilisateurs
	*/
	app.post('/rmuser', (req, res) => {
		users.remove({_id : ObjectId(req.session.userinfo._id)});
		req.session.destroy();
		res.redirect('../');
	})

}