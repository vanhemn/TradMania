function surligne(champ, erreur)
{
	if(erreur)
		champ.style.backgroundColor = "#fba";
	else
		champ.style.backgroundColor = "";
}

function check() {
	var info = new Object()
	var infos = new Object()
	info.username = document.getElementById('username');
	info.psswd = document.getElementById('password');
	info.email = document.getElementById('email');
	info.psswdValid = document.getElementById('passwordValid');

	if (info.username.value.length > 0 && info.psswd.value.length > 0 && info.email.value.length > 0 && info.psswdValid.value.length > 0) {
		surligne(info.username, false);
		surligne(info.psswd, false);
		surligne(info.email, false);
		surligne(info.psswdValid, false);
		infos.username = $('#username').val()
		infos.psswd = $('#password').val()
		infos.email = $('#email').val()
		infos.psswdValid = $('#passwordValid').val()
		console.log("true");
		postAndRedirect("../register", infos);
	}
	else{
		surligne(info.username, true);
		surligne(info.psswd, true);
		surligne(info.email, true);
		surligne(info.psswdValid, true);
	}
}




function postAndRedirect(url, postData)
{
	var postFormStr = "<form method='POST' action='" + url + "'>\n";

	for (var key in postData)
	{
		if (postData.hasOwnProperty(key))
		{
			postFormStr += "<input type='hidden' name='" + key + "' value='" + postData[key] + "'></input>";
		}
	}

	postFormStr += "</form>";

	var formElement = $(postFormStr);

	$('body').append(formElement);
	$(formElement).submit();
}