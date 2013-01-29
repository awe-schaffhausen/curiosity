var cutouts = {
	1:{
		1:'img/planets/1.png',
		2:'img/planets/2.png',
		3:'img/planets/3.png',
		4:'img/planets/4.png',
		5:'img/planets/5.png',
		6:'img/planets/6.png',
		7:'img/planets/7.png',
		8:'img/planets/8.png',
		9:'img/planets/9.png',
		10:'img/planets/10.png',
		11:'img/planets/11.png',
		12:'img/planets/12.png'
	}//,
	// 2:{
	// 	1:'img/planets/.png',
	// 	2:'img/planets/.png',
	// 	3:'img/planets/.png',
	// 	4:'img/planets/.png',
	// 	5:'img/planets/.png'
	// }
}

/* **********************************************
     Begin master.js
********************************************** */

(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.
//like something you see, but can't read this unholy mess? drop me a line at (mif)[at](awe)[minus](schaffhausen)[dot](com)

$(document).ready(function(){
	if ($.browser.msie && parseInt($.browser.version, 10) < 7) $('body').supersleight({shim: 'img/transparent.gif'});
})

var camera, environ, renderer, heylookatme;
var mouseX = 0, mouseY = 0;
var imgcounter = 0, imgperscenecounter = 0, movementfactor = 2, scrollfactor = 0;
var mi_x, mi_y, mi_z, depth, initial, distance = 0, time_a, time_b, smoothslide, whole, half, going = 30, dft;
var stance = true, dragging = false;
var gather = [], x_dir_a = [], y_dir_a = [], x_dir_b = [], y_dir_b = [], storyheight = [], rotate_a = [], rotate_b = [], fadepoint = [];

var $windowpane = $(window);
var $papercut = $('#papercut')
var $descender = $('#descender');
var $dhelper = $('#directionalhelper')
var paneheight, panewidth;

$(document).ready(function(){
	paneheight = $windowpane.height();
	panewidth = $windowpane.width();
	glideheight = paneheight / movementfactor;
	glidewidth = panewidth / movementfactor;

	whole = paneheight;
	half = paneheight / 2;
	// if (navigator.userAgent.indexOf('Mac OS X') != -1) scrollfactor = 10;
});

$windowpane.load(function(){
	$papercut.css({'top': (paneheight-672)/2, 'left': (panewidth-1024)/2})
	$descender.css({'top': (paneheight-550)/2})
	$dhelper.css({'left': (panewidth-100)/2})

	setTimeout(function(){
		$dhelper.fadeOut(1000)
	},5000)


	if (window.location.hash){
		var hash = window.location.hash.split('#')
		console.log(hash[1])
		if (hash[1] == 'robot'){
			$('body').animate({ scrollTop: whole }, 1000)
		}else{
			$('body').animate({ scrollTop: 0 }, 1000)
			$('#descender').find('div').eq(hash[1]).click();
		}
	}

	if (!$.browser.msie) dimensional_init();
	else desolate_init(cutouts);
	
});

$windowpane.resize(function(){
	paneheight = $windowpane.height();
	panewidth = $windowpane.width();
	whole = paneheight;
	half = paneheight / 2;
	$papercut.css({'top': (paneheight-672)/2, 'left': (panewidth-1024)/2})
	$descender.css({'top': (paneheight-550)/2})
	$dhelper.css({'left': (panewidth-100)/2})
});

window.onorientationchange = function(){
	paneheight = $windowpane.height();
	panewidth = $windowpane.width();
	$('.master').css({'height':paneheight, 'width':panewidth})
}

function dimensional_init() {
	$('.story').find('div').each(function(e){
		var $that = $(this);
		$that.css('left', (panewidth-300)*textpos[e].x)
		storyheight[e] = $that.height()
	})

	environ = new THREE.Scene();

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( 1024,673 );
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	renderer.domElement.style.overflow = 'inherit';
	$papercut.append( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	heylookatme = new THREE.Vector3(150,0,220);	

	camera = new THREE.PerspectiveCamera( 35, 1024 / 673, 1, 10000 );
	camera.position.z = 1000;
	camera.lookAt(heylookatme)

	papergenerator(cutouts);
	if(navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)){
		$('#directionalhelper').attr('src','img/navigational/help_swipe.png')
		$('#reset').addClass('pls')
	}else{
		$('#directionalhelper').attr('src','img/navigational/help_scroll.png')
		
	}

	depth = half;
	shift = half;
	shifter(depth);

	animate();
	dimensional();
}

function papergenerator(receive){
	var scenecount = 1;
	for (var page in receive){
		var stack = receive[page];
		for (var i in stack){
			var construct = document.createElement( 'div' );

			if (stack[i].shapeshifter == false) construct.className = 'shape scene_'+page+' img_'+imgperscenecounter+' obj_'+imgcounter.toString();
			else construct.className = 'shape shapeshifter scene_'+page+' sh'+page+' shape'+page+'shifter'+imgperscenecounter+' obj_'+imgcounter.toString();
			imgcounter++;	
			imgperscenecounter++;

			var object = new THREE.CSS3DObject( construct );

			object.position.x = 700 * stack[i].x_a;
			object.position.y = 700 * stack[i].y_a;
			object.position.z = i*35;

			environ.add( object );

			x_dir_a.push(stack[i].x_a)
			x_dir_b.push(stack[i].x_b)
			y_dir_a.push(stack[i].y_a)
			y_dir_b.push(stack[i].y_b)
			rotate_a.push(stack[i].r_a)
			rotate_b.push(stack[i].r_b)
			fadepoint.push(stack[i].fadepoint)
		}
		scenecount++;
		gather[page] = imgperscenecounter;
		imgperscenecounter = 0;
	}
}

function onDocumentMouseMove( event ) {
	mouseX = (event.clientX - glidewidth)/3;
	mouseY = (event.clientY - glideheight)/3;
}

function animate() {
	render();
	requestAnimationFrame( animate );
	TWEEN.update();
}

function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;
	camera.lookAt( heylookatme );

	renderer.render( environ, camera );
}

$windowpane.on('mousewheel', function(event, delta, deltaX, deltaY) {
	depth += -deltaY*(whole/going);
	shifter(depth)
});

window.addEventListener("touchstart", touchStart, false);
window.addEventListener("touchmove", touchMove, false);
window.addEventListener("touchend", touchEnd, false);

function touchStart(e){
	initial = e.pageY;
	time_a = new Date().getTime()
}

function touchMove(e){
	e.preventDefault();
	if (e.touches.length == 1){
		dragging = true;
		distance = initial - e.pageY;
		shifter(depth+distance)
	}else dragging = false;
}

function touchEnd(e){
	if (dragging) {
		dragging = false;
		time_b = new Date().getTime();
		var smooth = (distance / (time_b - time_a))*100;
		depth += distance;

		var tween = new TWEEN.Tween({
			g: depth
		})
		.to({ g:depth+smooth }, 300)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(function () {
			shifter(this.g)
		})
		.start();

		setTimeout(function(){
			depth += smooth;
		},300)
	}
}

$('#reset').on('click', function(){
	stance = true;
});

window.ondevicemotion = function(event){
	if (stance){
		mi_x = event.accelerationIncludingGravity.x;
		mi_y = event.accelerationIncludingGravity.y;
		mi_z = event.accelerationIncludingGravity.z;
		stance = false;
	}
	mouseY = (event.accelerationIncludingGravity.x - mi_x)*30;
	mouseX = (event.accelerationIncludingGravity.y - mi_y)*60;
}

var sceneposition, sceneregulate, scenebracket = 0, descentup, descendup, descentdown, descenddown;

function cubicshifter(s, direction){
	var t = direction * (-((shift+half)/half)+2);
	var r = (t*t*t)*.7;
	return r;
}

function opacityshifter(s){
	return (1-(Math.abs(s-half)/half));
}

function shifter(went){
	if ((went >= half) && (went <= ((whole*16)-half))){
		shift = Math.floor(went % whole);
		sceneposition = Math.floor(went / whole);

		if (sceneposition != sceneregulate){
			scenebracket = 0;
			var gar = gather.slice(0, sceneposition+1);
			for (var y = 0; y < gar.length-1; y++) scenebracket += gar[y];
			for (var o = 0; o < gather.length; o++) o != sceneposition && $('.scene_'+o+', .what, .whom').css({'opacity': 0, 'display':'none'})
			$('#s_'+sceneposition).css({'opacity': 1, 'display':'block'})
			$('.scene_'+sceneposition).css('display','block')
			$descender.find('div').removeClass('here').eq(sceneposition).addClass('here')
			window.location.hash = sceneposition;
		}
		sceneregulate = sceneposition;

		// console.log(Math.floor(depth)+' << '+shift+' >> '+sceneposition+' && '+scenebracket+' ++ '+(gather[sceneposition]+scenebracket));

		$('#shake').html(Math.floor(depth)+' << '+shift+' >> '+sceneposition+' && '+scenebracket+' ++ '+(gather[sceneposition]+scenebracket))

		for (var m = scenebracket; m < gather[sceneposition]+scenebracket; m++){
			if (shift <= half){
				environ.children[m].position.x = cubicshifter(shift, x_dir_a[m], fadepoint[m])*700;
				environ.children[m].position.y = cubicshifter(shift, y_dir_a[m], fadepoint[m])*700;
				environ.children[m].rotation.z = cubicshifter(shift, rotate_a[m], fadepoint[m]);
			}else{
				environ.children[m].position.x = - cubicshifter(shift, x_dir_b[m], fadepoint[m])*700;
				environ.children[m].position.y = - cubicshifter(shift, y_dir_b[m], fadepoint[m])*700;
				environ.children[m].rotation.z = - cubicshifter(shift, rotate_b[m], fadepoint[m]);
			}
		}

		$('#s_'+sceneposition).css({
			'top': (cubicshifter(shift, 1)*(whole+storyheight[sceneposition]))+(whole*textpos[sceneposition].y),
			'opacity':opacityshifter(shift)
		});

		$('.scene_'+(sceneposition)).css('opacity', opacityshifter(shift))
	}else if (went > ((whole*16)-(half))){
		transition(false)
		depth = (whole*16)-half;
		window.location.hash = 'robot';
	}else if (went < half){
		depth = half;
		$dhelper.css('display','block').delay(2000).fadeOut(1000)
	}
}

function dimensional(){
	$('.shapeshifter').on('click', function(){
		if ((shift > (whole*.4)) && (shift < (whole*.6))){
			var $sh = $('.sh'+sceneposition);
			var jump_to = $sh.size()
			var jumping = 0;
			var jumper = setInterval(function(){
				$sh.each(function(){
					$(this).css('background-position', '0px '+(150*jumping)+'px')
				})
				jumping < jump_to ? jumping++ : clearInterval(jumper);
			},100)
		}
	});

	$descender.on('click', 'div', function(){
		var where = $(this).index();
		var sceneposcapture = sceneposition;

		if (where > sceneposition){
			descentup = setInterval(function(){
				depth += whole/going;
			    shifter(depth)

				if (depth >= (sceneposcapture+1)*whole){
					clearInterval(descentup)
					depth = where * whole;
					sceneposition = where;
					descendup = setInterval(function(){
						depth += whole/going;
					    shifter(depth)
						if (depth >= ((sceneposition+1)*whole)-half) clearInterval(descendup)
					},20)
				}
			},20)
		}else{
			descentdown = setInterval(function(){
				depth -= whole/going;
			    shifter(depth)

				if (depth <= sceneposcapture*whole){
					clearInterval(descentdown)
					depth = (where+1) * whole;
					sceneposition = where+1;
					descenddown = setInterval(function(){
						depth -= whole/going;
					    shifter(depth)
						if (depth <= ((sceneposition)*whole)+half) clearInterval(descenddown)
					},20)
				}
			},20)
		}
	})

	$windowpane.scroll(function(e){
		dft = $windowpane.scrollTop();
		$('#scroll').html(dft)
		if (dft <= 0) transition(true);
		closeenough();
	});

	var closeenough = _.debounce(function(){
		if ((dft > 1) && (dft < (half*.5))){
			$('body').animate({ scrollTop: 0 }, 1000, function(){
				transition(true);
			});
		}else if ((dft > (whole-(half*.5))) && (dft < whole)){
			$('body').animate({ scrollTop: whole }, 1000);
			dft = whole;
		}
	},2000)
}

function transition(coupling){
	if (coupling){
		$('#scroll').html('coupled!')
		window.addEventListener("touchstart", touchStart, false);
		window.addEventListener("touchmove", touchMove, false);
		window.addEventListener("touchend", touchEnd, false);

		$windowpane.on('mousewheel', function(event, delta, deltaX, deltaY) {
			depth += -deltaY*(whole/going);
		    shifter(depth)
		});
		$('body').addClass('stop');

		shifter((whole*16)-(half+2))
	}else{
		$('#scroll').html('decoupled!')
		$windowpane.off('mousewheel');
		window.removeEventListener("touchstart", touchStart, false);
		window.removeEventListener("touchmove", touchMove, false);
		window.removeEventListener("touchend", touchEnd, false);
		$('body').removeClass('stop');
	}
}





//'####:'########:::'##::::'###:
//. ##:: ##.....:::'####::'##:::
//: ##:: ##::::::::. ##::'##::::
//: ##:: ######:::::..::: ##::::
//: ##:: ##...::::::'##:: ##::::
//: ##:: ##::::::::'####:. ##:::
//'####: ########::. ##:::. ###:
//....::........::::..:::::...::

var IEcenters = [], dft, mpe, $sceneimg, IEheight;

function desolate_init(receive){
	$dhelper.attr('src','img/navigational/help_scroll.png')
	$('body').removeClass('stop')
	$windowpane.scrollTop(0)
	
	$papercut.append('<div id="desolation"></div>')
	var scenecount = 1;
	mpe = whole / 2

	for (var page in receive){
		var stack = receive[page];
		for (var i in stack){
			$('#desolation').append(
				'<div class="shape scene_'+page+'" id="img_'+imgperscenecounter+'" '+
				'style="left:'+(700 * stack[i].x_a)+'px; top:'+(700 * stack[i].y_a)+'px;"></div>'
			)
			imgperscenecounter++;
			x_dir_a.push(stack[i].x_a);
			x_dir_b.push(stack[i].x_b);
			y_dir_a.push(stack[i].y_a);
			y_dir_b.push(stack[i].y_b);
		}
		scenecount++;
		gather[page] = imgperscenecounter;
		imgperscenecounter = 0;
	}

	IEheight = $('.story').find('div').size()*whole;

	$('.story').find('div').each(function(e){
		var f = e+1;
		var $that = $(this);
		$that.css({'top': (whole*f)-(whole*.55), 'left': (panewidth-300)*.8})
		IEcenters[e] = (whole*f)-(whole*.55)
	})
	.parent().css('height', IEheight)

	$('#partsoneandtwo').css('height', IEheight)

	$sceneimg = $('.scene_'+sceneposition)

	$windowpane.scroll(function(e){
		dft = $windowpane.scrollTop();
		lonelyshifter(dft+mpe)
	});

	function lonelycubicshifter(s,direction){
		var t = direction * (-((shift+mpe)/mpe)+2);
		var r = (t*t*t)*.7;
		return r;
	}

	function lonelyopacityshifter(s){
		return (1-(Math.abs(s-mpe)/mpe));
	}

	function lonelyshifter(went){
		shift = Math.floor(went % whole);
		sceneposition = Math.floor(went / whole);

		console.log(shift)

		for (var m = 0; m < gather[sceneposition]; m++){
			if (shift <= mpe){
				$sceneimg.eq(m).css({
					'left': (lonelycubicshifter(shift, x_dir_a[m])*700),
					'top': (lonelycubicshifter(shift, y_dir_a[m])*700)
				});
			}else{
				$sceneimg.eq(m).css({
					'left': (- lonelycubicshifter(shift, x_dir_b[m])*700),
					'top': (- lonelycubicshifter(shift, y_dir_b[m])*700)
				});
			} 
		}

		$('.scene_'+(sceneposition)).css('opacity', lonelyopacityshifter(shift))

		if (sceneposition != sceneregulate){
			$sceneimg = $('.scene_'+sceneposition)
			$('.shape').css('display','none')
			$('.scene_'+sceneposition).css('display','block')
		}
		sceneregulate = sceneposition;
	}
}








































