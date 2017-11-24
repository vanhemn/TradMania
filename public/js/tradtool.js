var socket = io();
$( document ).ready(function() {
	$('.tphrase').each(function(index){
		$(this).click(function(){
			var tool = $(this).attr("tool");
			var mainid = $("#trad").attr("data-tooltip-id");
			var toptipid = $("#tafter").attr("data-tooltip-id")
			var bottipid = $("#tbefore").attr("data-tooltip-id")

			$("#tafter").text($($('.tphrase')[index + 1]).text().substring(0, 80) + "...");
			$("#tbefore").text($($('.tphrase')[index - 1]).text().substring(0, 80) + "...");
			$("#trad").val($($('.tphrase')[index]).text());
			$("#trad").attr("index", $(this).attr("index"))
			$("#trad").attr("tool", $(this).attr("tool"))
			$("#trad").attr("balise", $(this).prop('nodeName'));
			$("#modal1").modal("open");

			$("#" + mainid).children("span").text(tool)
			$("#" + toptipid).children("span").text($($('.tphrase')[index + 1]).text())
			$("#" + bottipid).children("span").text($($('.tphrase')[index - 1]).text())
		})
	})
	$("#sendt").click(function(){
		var data = new Object();
		data.text = $("#trad").val();
		data.tool = $("#trad").attr("tool");
		data.index = $("#trad").attr("index");
		data._id = $("#did").text();
		data.balise = $("#trad").attr("balise"); 
		data.name = $("#username").text();  
		socket.emit("tradon", data);
		$("#modal1").modal("close");
	})
	socket.on("ctrad", function(data){
		$($('.tphrase')[data.index]).text(data.text);
		Materialize.toast('Update from : ' + data.name + " !", 1000, 'rounded')
	})
})