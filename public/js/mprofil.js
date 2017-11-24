$( document ).ready(function() {
	$('#savebtn').click(function(){
		$("input").each(function(index){
			if ($(this).val() == ""){
				$(this).prop('disabled', true);
			}
		})
		$("#form1").submit();
	})
});