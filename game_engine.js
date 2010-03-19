//browsers dections -- sorry IE 6 folks, you are excluded
var browser=navigator.appName;
var b_version=navigator.appVersion;
var version=parseFloat(b_version);


//image resources
var barImg = new Image();
barImg.src = 'me_bar.png';
var barHitImg = new Image();
barHitImg.src = 'me_bar_hit.png';
var dotImg = new Image();
dotImg.src = 'dot.png';
var dotHitImg = new Image();
dotHitImg.src = 'dot_hit.png';

//gobal variables 
var FPS = 40;
var SecondsBetweenFrames = 1/FPS;
var dotSpeed =24; //pixel per frame, on slow machine this can be as big as 8
var startPos = 77;  
var midPos = 341;
var endPos = 598;
if (browser == "Microsoft Internet Explorer" ) {
	startPos -= 13;
	midPos -= 23;
	endPos -= 50;
	FPS = 39;
	SecondsBetweenFrames = 1/FPS;
	dotSpeed =36;
}
var dotPos = startPos;
var trial_num;
var aeList = [];
var ceList = [];
var nextBn;
var setCount = 1;
var popSpeed = dotSpeed;
var randomFactor = 5;

//scenes control flags
var scene1 = true;
var scene2 = false;
var scene3 = false;
var scene4 = false;

window.onload = init;

function init() {  
	drawScene1();
	setInterval(update, SecondsBetweenFrames*1000);
}  

function update() {
	animateScene3();
	drawScene3();
}

function drawScene4() {
	if (!scene4) {
		return;
	}

	//calculates the variable error
	var sumAe = 0;
	for ( var ae in aeList ) {
		sumAe += Number(aeList[ae]);
	}
	var avgAe = sumAe / aeList.length;
	var sumCe = 0;
	for ( var ce in ceList ) {
		sumCe += Number(ceList[ce]);
	}
	var avgCe = sumCe / ceList.length;
	var sumError = 0;
	for ( var i in ceList ) {
		sumError += (Number(ceList[i]) - avgCe)*(Number(ceList[i]) - avgCe);	
	}
	var ve = sumError / ceList.length;	


	document.getElementById("statistic").style.display = "block";
	//document.getElementById("ae_list").innerHTML = "Your absolute error is: " + avgAe.toFixed(1) + "%.";
	//document.getElementById("ce_list").innerHTML = "Your constant error is: " + avgCe.toFixed(1) + "%.";
	//document.getElementById("ve_result").innerHTML = "Your variable error is: " + ve.toFixed(1) + "%.";
	document.getElementById("next_bn").style.display = "inline";
	document.getElementById("next_bn").innerHTML = "Start another trial";
	var tbl = document.getElementById("stat_table");
	var newRow = tbl.insertRow(tbl.rows.length);

	aeList = aeList.reverse();
	ceList = ceList.reverse();
	//var count = aeList.length;

	for ( var i in aeList ) {
		//var newRow = tbl.insertRow(tbl.rows.length);
		/*var newCell = newRow.insertCell(0);
		newCell.innerHTML = ((Number(ceList[i]) - avgCe)*(Number(ceList[i]) - avgCe)).toFixed(1);
		var newCell = newRow.insertCell(0);
		newCell.innerHTML = ceList[i];
		var newCell = newRow.insertCell(0);
		newCell.innerHTML = aeList[i];*/
		//var newCell = newRow.insertCell(0);
		//newCell.innerHTML = "0";

		var newCell = newRow.insertCell(0);
		newCell.innerHTML = ceList[i];
		if (ceList[i] == 0) {
			newCell.style.backgroundColor = "#e81c1c";
		}
		//var newCell = newRow.insertCell(0);
		//newCell.innerHTML = "T" + String(Number(count));
		//count--;
	}

	var leadCell = newRow.insertCell(0);
	leadCell.innerHTML = "Set " + setCount;
	setCount++;

	/*var newRow = tbl.insertRow(tbl.rows.length);
	var newCell = newRow.insertCell(0);
	newCell.innerHTML = sumError;
	var newCell = newRow.insertCell(0);
	newCell.innerHTML = sumCe;
	var newCell = newRow.insertCell(0);
	newCell.innerHTML = sumAe;
	var newCell = newRow.insertCell(0);
	newCell.innerHTML = "Sum:";
	var newCell = newRow.insertCell(0);
	newCell.innerHTML = sumCe;
	var newCell = newRow.insertCell(0);
	newCell.innerHTML = "Sum:";*/


	//event for next page
	if (nextBn.addEventListener) {
	  nextBn.addEventListener('click', end_scene4, false); 
	} else if (nextBn.attachEvent) {
	  nextBn.attachEvent('onclick', end_scene4);
	}
}

function end_scene4(evt) {
	nextBn = document.getElementById("next_bn");
	if (nextBn.removeEventListener) {
		nextBn.removeEventListener('click', end_scene4, false);
	} else if ( nextBn.detachEvent) {
		nextBn.detachEvent('onclick', end_scene4);
	} 

	aeList = [];
	ceList = [];
	document.getElementById("statistic").style.display = "none";
	scene4 = false;
	//location.reload(false);
	dotPos = startPos;
	scene2 = true;
	drawScene2();
}

function dotStop(e) {
	if (!e) e = window.event;
	if (scene3 && trial_num != 0 && e.keyCode == 32) {
		scene3 = false;
		//var ae = document.getElementById("absolute_error");  
		//ae.style.display = "inline";
		//ae.innerHTML = "Absolute Error: " + (Math.abs(dotPos - midPos)/(endPos - startPos)*100).toFixed(0) + "%";
		aeList.push((Math.abs(dotPos - midPos)/(endPos - startPos)*200).toFixed(0));
		//var ce = document.getElementById("constant_error");  
		//ce.style.display = "inline";
		//ce.innerHTML = "Constant Error: " + ((dotPos - midPos)/(endPos - startPos)*100).toFixed(0) + "%";
		ceList.push(((dotPos - midPos)/(endPos - startPos)*200).toFixed(0));
		var ve = document.getElementById("variable_error");  
		trial_num -= 1;
		ve.style.display = "inline";
		ve.innerHTML = "<span style=\"color:#00ff00;\">" + trial_num + " tests remained, hit space again to start next test.</span>";
		document.onkeydown = dotStart;
	}

	if (trial_num < 1 && e.keyCode == 32) {
		scene3 = false;
		var ve = document.getElementById("variable_error");  
		ve.innerHTML = "Tests are finished, press space for the Statistics.";
	}
}

function dotStart(e) {
	if (!e) e = window.event;
	if (trial_num != 0 && e.keyCode == 32) {
		scene3 = true;
		dotSpeed = 0;
		setTimeout(function(){dotSpeed = popSpeed}, 3000);
		dotPos = startPos;
		document.getElementById("variable_error").innerHTML = "<span style=\"color: red;\">Test No." + (Number(document.getElementById("number_of_trials").value) + 1 - Number(trial_num)) + " Press space to stop the dot at the center...</span>";  
		document.onkeydown = dotStop;
	}

	if (trial_num < 1 && e.keyCode == 32)
	{
		scene3 = false;
		scene4 = true;
		var canvas = document.getElementById("canvas");  
		if (canvas.getContext) {  
			var ctx = canvas.getContext("2d");  
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		document.getElementById("absolute_error").style.display = "none";
		document.getElementById("constant_error").style.display = "none";
		document.getElementById("variable_error").style.display = "none";
		document.onkeydown = null;
		drawScene4();
	}
}

function animateScene3() {

	if (!scene3) {
		return;
	}

	/* going back and forth	
	if (dotPos > (startPos-1) && dotPos < (endPos+1)) {
		dotPos = dotPos + dotSpeed;
	} else if (dotPos > endPos) {
		popSpeed =  0 - popSpeed;
		//dotPos = dotPos + 2*dotSpeed;
		dotSpeed = 0;
		dotPos =  endPos;
		var ranNum = Math.floor(Math.random()*101*randomFactor)
		setTimeout(randomStart, ranNum);
	} else if (dotPos < startPos) {
		dotSpeed = 0 - dotSpeed;
		dotPos = dotPos + 2*dotSpeed;
	}*/

	// going left to right
	if (dotPos > (startPos-1) && dotPos < endPos) {
		dotPos = dotPos + dotSpeed;
	} else if (dotPos > endPos) {
		dotSpeed = 0;
		dotPos =  startPos;
		var ranNum = Math.floor(Math.random()*101*randomFactor)
		setTimeout(randomStart, 3000+ranNum);
	} else if (dotPos < startPos) {
		dotPos = startPos;
	}

}

function randomStart() {
		dotSpeed = popSpeed;
}

function drawScene3() {
	if (!scene3) {
		return;
	}
	var canvas = document.getElementById("canvas");  
	if (canvas.getContext) {  
		var ctx = canvas.getContext("2d");  
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (dotPos == midPos) {
			ctx.drawImage(barHitImg, 67, 171);
			ctx.drawImage(dotHitImg, dotPos, 171);
		} else {
			ctx.drawImage(barImg, 67, 171);
			ctx.drawImage(dotImg, dotPos, 171);
		}
	}
}

function drawScene2() {
	if (!scene2) {
		return;
	}	

	var preText = document.getElementById("preview_text");
	var preBar = document.getElementById("preview_bar");
	var settings = document.getElementById("settings");
	nextBn = document.getElementById("next_bn");
	nextBn.innerHTML = "Begin the test";
	
	preText.style.display = "block";
	preBar.style.display = "block";
	settings.style.display = "block";

	//event for next page
	if (nextBn.addEventListener) {
	  nextBn.addEventListener('click', end_scene2, false); 
	} else if (nextBn.attachEvent) {
	  nextBn.attachEvent('onclick', end_scene2);
	}
}

function end_scene2(evt) {
	var preText = document.getElementById("preview_text");
	var preBar = document.getElementById("preview_bar");
	var settings = document.getElementById("settings");
	nextBn = document.getElementById("next_bn");
	if (nextBn.removeEventListener) {
		nextBn.removeEventListener('click', end_scene2, false);
	} else if (nextBn.detachEvent) {
		nextBn.detachEvent('onclick', end_scene2);
	}
	document.getElementById("variable_error").style.display = "inline";
	document.getElementById("variable_error").innerHTML = "Plase be prepared and press space to start the test.";  
	preText.style.display = "none";
	preBar.style.display = "none";
	settings.style.display = "none";
	nextBn.style.display = "none";
	trial_num = document.getElementById("number_of_trials").value;
	//aeList = new Array(trial_num);
	//ceList = new Array(trial_num);
	scene2 = false;
	scene3 = true;
	drawScene3();
	scene3 = false;
	document.onkeydown = dotStart;
}
	

function drawScene1() {
	if (!scene1) {
		return;
	}
	nextBn = document.getElementById("next_bn");
	nextBn.innerHTML = "Accept";
	var titleText = document.getElementById("title_text");
	var contentText = document.getElementById("content_text");

	titleText.style.display = "block";
	contentText.style.display = "block";
	contentText.style.backgroundColor = "#eee";
 	nextBn.style.display = "inline";

	//event for next page
	if (nextBn.addEventListener) {
	  nextBn.addEventListener('click', end_scene1, false); 
	} else if (nextBn.attachEvent) {
	  nextBn.attachEvent('onclick', end_scene1);
	}
}

function end_scene1(evt) {
	nextBn = document.getElementById("next_bn");
	if (nextBn.removeEventListener) {
		nextBn.removeEventListener('click', end_scene1, false);
	} else if ( nextBn.detachEvent) {
		nextBn.detachEvent('onclick', end_scene1);
	} 
	var titleText = document.getElementById("title_text");
	var contentText = document.getElementById("content_text");

	//titleText.style.display = "none";
	contentText.style.display = "none";
 	//nextBn.style.display = "none";
	//contentText.innerHTML = "";
	contentText.style.backgroundColor = "transparent";
	scene1 = false;
	scene2 = true;
	drawScene2();
}
