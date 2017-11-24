function surligne(champ, erreur)
{
   if(erreur)
      champ.style.backgroundColor = "#fba";
   else
      champ.style.backgroundColor = "";
}

function check() {
	var info = new Object();
	var infos = new Object();
	info.username = document.getElementById('username');
	info.psswd = document.getElementById('password');

	if (info.username.value.length > 0 && info.psswd.value.length > 0) {
		surligne(info.username, false);
		surligne(info.psswd, false);
		infos.username = $('#username').val()
		infos.psswd = $('#password').val()
		postAndRedirect("../login", infos);
	}
	else{
		surligne(info.username, true);
		surligne(info.psswd, false);
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