var mobile = false;
var w = window.innerWidth;

$( document ).ready(function() {
	$('html').removeClass('no-js');

	$('.icon a').click(function(){
		$('.nav .main').removeClass('hide');
		$('.nav .main').addClass('show');

		$('.nav .icon').removeClass('show');
		$('.nav .icon').addClass('hide');
	});

});

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	$('html').addClass('mobileDevice');
	if(w <= 640){
		var mobile = true;
	}
}
else{
	var mobile = false;
}