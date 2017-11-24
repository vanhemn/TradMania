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
	info.projectname = document.getElementById('projectName');
	info.desc = document.getElementById('description');
	info.lang1 = document.getElementById('langue1');
	info.lang2 = document.getElementById('langue2');

	if (info.projectname.value.length > 0 && info.desc.value.length > 0 && info.lang1.value.length > 0 && info.lang2.value.length > 0) {
		surligne(info.projectname, false);
		surligne(info.desc, false);
		surligne(info.lang1, false);
		surligne(info.lang2, false);

		$("#formu").submit()
		console.log("send");
	}
	else{
		console.log("fail");
		surligne(info.username, true);
		surligne(info.psswd, false);
	}
}