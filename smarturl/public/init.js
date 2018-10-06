
$(document).ready(function(){
	$(function () {
  		$('[data-toggle="tooltip"]').tooltip()
	});
	$('#url').on('change',function(e){
		var reg = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
		if (reg.test($('#url').val())) { 
    		$('#valid').html('<font color="green">Looks good!</font>');
    		$('#url').css('border','1.5px solid green');
    		$('#button').removeAttr('disabled');
			return true;
		}
		else if(!reg.test($('#url').val()))
		{
			$('#valid').html('<font color="red">Enter valid URL!</font>');
			$('#url').css('border','1.5px solid red');
			$('#button').attr('disabled','disabled');
			return false;
		}
	});
$('#key').on('keyup', function(e){
		var k = $(this).val();
		if(k.length == 0)
			$('#check').html('');
		else{
			$.ajax({
				type: "POST",
				url: "/check",
				data: {key: k},
				success: function(data)
				{
					if(data == "available"){
							$('#check').html('<font color="red">Not Available</font>');
							$('#key').css('border','1.5px solid red');
							$('#button').attr('disabled','disabled');
					}
					else{
						$('#check').html('<font color="green">Available</font>');
						$('#key').css('border','1.5px solid green');
						$('#button').removeAttr('disabled');
					}
				},
				error: function(data)
				{
					console.log("App not functioning properly!");
				}
			});	
		}
	});
	$('#shorturl').submit(function(e){
		//stop the reload or refresh criteria--
		e.preventDefault();
		//--
		//for get the value
		var u = $('#url').val();
		var k = $('#key').val();
		if(u == "")
		{
			$('#valid').html('<font color="red">Enter a valid url!</font>');
			return;
		}
		else
			$('#valid').html('');

			$.ajax({
				type: "POST",
				//to send the control
				url: "/short",
				//which data send to control
				data: { url: u,key: k},
				success: function(data)
				{	
					console.log('key: '+data);
                             if(data){
						$('#result').css('display','block');
						$('#showData').css('display','block');
						$('#resultData').css('display','block');
						$('#link').html(data);
					}else{
					$('#result').html('<div class="alert alert-danger" role="alert">Some error Occured !</div>');
					}			
				},
				error: function(data)
				{
					console.log('Custom URL Generate Request Failed! :(');				
				}
				});
	});
});
const link = document.querySelector("#showData");
link.onclick = function() {
	document.execCommand("copy");
}
link.addEventListener("copy", function(event) {
	event.preventDefault();
    if (event.clipboardData) {
        event.clipboardData.setData("text/plain", link.textContent);
        console.log(event.clipboardData.getData("text"))
        $('[data-toggle="tooltip"]').tooltip('dispose')
        $(this).tooltip('hide')
        .attr('title', 'Copied')
        .attr('data-placement', 'bottom')
        .tooltip('show');
    }
});