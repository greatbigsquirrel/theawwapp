var catBugObj={width:1024,height:667,title:"Welcome!",link:"catbug.png", firstItem:true};
var cats=[catBugObj];
var catNumber=0;
var pgNum=0;
var buttonMagic=null, shareMagic=null, imageElement=null, optional=null;
var is_loading=false;
//vars for settings
var settings={};
//default values: we will attempt to load from local storage
settings.subreddit= "aww";
//add options here, define input elements in options
settings.sfw="true";
settings.turnDemOff="false";
settings.noShare="false";
var picLeftPos=0, picTopPos=0;
//end settings set up
//for the pinchzoom
var posX=0, posY=0,
	scale=1, last_scale=1;
	//rotation= 1, last_rotation;
var lastCatWidth, lastCatHeight;
var defaultProp = {scale:1, width:100, aspectRatio:1.5}; 
var percentTouch = {x:0, y:0};
function didLoad(){
	settingsLoad();
	optionLoad(); //settings and optionload need to be here
	createSubDropDown();
	buttonMagic=document.getElementById("cutestuff");
	imageElement=document.getElementById("cat")
	shareMagic=document.getElementById("shareOptions");
	optional=document.getElementById("option");
	document.getElementById("start").addEventListener("click", startMadness);
	document.getElementById("toggleButton").addEventListener("click", toggleShareButtons);
	document.getElementById("Halp").addEventListener("click", toggleHelp);
	document.getElementById("firstOptions").addEventListener("click", toggleOption);
	document.getElementById("options").addEventListener("click", toggleOption);
	document.getElementById("nextpic").addEventListener("click", randomImage);
	imageElement.addEventListener("load", function(event) {
		is_loading=false;
		stopGif();
		imageElement.style.visibility="visible";
		applySizing();
	});
	document.getElementById("restart").addEventListener("click", function(){
		window.location.href="index.html";
	});
	document.getElementById("tryAgain").addEventListener("click", startLoad);
	if(settings.noShare=="true"){
		shareMagic.style.display="none";
		document.getElementById("toggleButton").style.display="none";
	}
	Hammer(imageElement,{}).on("swipeleft", function(event) {
		if(cats[catNumber].firstItem){
			startMadness();
		}else{
			randomImage();
		}
	});
	Hammer(imageElement,{}).on("swiperight", function(event){
		if (cats[catNumber].firstItem){
			toggleHelp();
		}else{
			history.back();
		}
	});
	Hammer(imageElement,{}).on("swipedown", function(event){
		if (cats[catNumber].firstItem){
			toggleOption();
		}else{
			shareButtons();
		}
	});
	Hammer(imageElement,{}).on("swipeup", function(event){
		hideShareButtons();
	});
	Hammer(document.body,{}).on('touch drag dragend transform', function(ev) {
		switch(ev.type) {
			case 'touch':
				last_scale = scale;
				break;

			case 'drag':
				if (scale>1){
					posX = Math.round(ev.gesture.deltaX);
					posY = Math.round(ev.gesture.deltaY);
				}
				break;

			case 'dragend':
				if (scale>1){
					picLeftPos+=posX;
					picTopPos+=posY;
				}
				posX=0, posY=0;
				break;

			case 'transform':
				console.log(ev.gesture);
				percentTouch.x=((ev.gesture.touches[0].pageX+ev.gesture.touches[0].pageX)/2)/window.innerWidth,
				percentTouch.y=((ev.gesture.touches[1].pageY+ev.gesture.touches[1].pageY)/2)/window.innerHeight;
				scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
				//var transform ="scale3d("+scale+","+scale+", 0) ";
				//console.log(transform);
				if (scale==1){
					applySizing();
				}else{
					//imageElement.style.webkitTransform = transform;
					applyScale();
				}
				break;
		}
		if (scale>1){
			applyGestures();
		}
	});
	window.onpopstate = function(event) {
		if(event.state && event.state.link){
			cats.push(event.state);
			catNumber=cats.length-1;
			showImage(cats[catNumber]);
			if(cats[catNumber].firstItem){
				stopMadness();
			}else{
				needMoreButton();
			}
		}
	};
	history.replaceState(catBugObj, "index", "index.html?welcome");
	applySizing();
}
function startLoad(){
	var xhr = new XMLHttpRequest();
	 
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			if(xhr.status === 200){
				cats=JSON.parse(xhr.responseText).data;
				//console.log(cats); //properties of what we downloaded from the server
				if(cats.length>0){
					randomImage({},true);
				}else{
					alert("Oh noes, you reached the end of reddit!");
					window.location.href="index.html";
				}
			}else{
				document.getElementById("tryTryAgain").style.display="block";
				stopGif();
			}
		}
	};
	xhr.open('GET', 'https://api.imgur.com/3/gallery/r/'+settings.subreddit+'/time/day/'+pgNum, true);
	xhr.setRequestHeader("Authorization", "Client-ID e0114193f3d0c77");
	xhr.send(null);
	loadingGif();
}
function toggleHelp(){
	if (cats[catNumber].link!="swipemadeeasy.png"){
		cats[catNumber].link="swipemadeeasy.png";
		showImage(cats[catNumber]);
		document.getElementById("catbug").style.display="none";
	}else{
		cats[catNumber].link="catbug.png";
		showImage(cats[catNumber]);
		document.getElementById("catbug").style.display="block";
	}
}
function toggleOption(){
	//var moveOptions=(window.innerHeight-optional.clientHeight)/2;
	if (optional.style.bottom=="" || optional.style.bottom=="100%"){
		optional.style.display="block";
		setTimeout(positionOptions, 50);
	}else{
		goBack();
	}
}
function positionOptions(){
	if (optional.style.display=="block"){
		var moveOptions=Math.round((window.innerHeight-optional.clientHeight)/2);
		optional.style.bottom= moveOptions+"px";
	}
}
//options stuff
function optionLoad(){
	document.getElementById("go").addEventListener("click", goBack);
	document.getElementById("save").addEventListener("click", saveOptions);
	
	for(var setting in settings){
		if (document.getElementById(setting)){
			document.getElementById(setting).value=settings[setting];
			if (settings[setting]=="true"){
				document.getElementById(setting).checked=true;
			}
		}
	}
}
function goBack(){
	optional.style.bottom="100%";
	setTimeout(function(){
		window.scroll(0,0);
		optional.style.display="none";
	}, 750);
}
function saveOptions(){
	for(var setting in settings){
		if (document.getElementById(setting)){
			if (document.getElementById(setting).type=="checkbox"){
				settings[setting]=document.getElementById(setting).checked+"";
			}else{
				settings[setting]=document.getElementById(setting).value;
			}
			localStorage[setting]=settings[setting];
		}
	}
	window.location.href="index.html";
	goBack();
}
//end of options
//settings
function settingsLoad(){
	for(var setting in settings){
		if (typeof(localStorage[setting])!="undefined"){
			settings[setting]=localStorage[setting];
		}
	}
}
//end of settings
function loadingGif(){
	document.getElementById("loadNAO").style.backgroundImage="url(loading.gif)";
	imageElement.style.visibility="hidden";
}
function stopGif(){
	document.getElementById("loadNAO").style.backgroundImage="none";
}
function needMoreButton(){
	buttonMagic.style.display="block";
	if(settings.turnDemOff=="true"){
		buttonMagic.style.display="none";
	}
	shareMagic.style.display="inline-block";
	document.getElementById("welcome").style.display="none";
}
function startMadness(){
	needMoreButton();
	startLoad();
}
function stopMadness(){
	buttonMagic.style.display="none";
	shareMagic.style.display="none";
	document.getElementById("welcome").style.display="block";
	document.getElementById("catbug").style.display="block";
}
function randomImage(ev,freshNip){
	if(is_loading) return;
	if(cats.length>0 && (typeof(freshNip)=="undefined" || !freshNip)){
		cats.splice(catNumber,1);
		if(cats.length<1){
			pgNum++;
			startLoad();
			return;
		}
	}
	catNumber=Math.floor(cats.length * Math.random());
	showImage(cats[catNumber]);
	history.pushState(cats[catNumber], "", "index.html?img="+cats[catNumber].link);
}
function showImage(imgObj){
	hideShareButtons();
	if(settings.sfw=="true" && imgObj.nsfw==true){
		imageElement.src="over18.png";
		applySizing();
		imageElement.title="nsfw";
		shareMagic.style.display="none";
	}else{
		is_loading=true;
		loadingGif();
		imageElement.src=imgObj.link;
		imageElement.title=imgObj.title;
		shareButtonMagic(imgObj);
	}
}
function applySizing(){
	scale=1;
	picLeftPos=0, picTopPos=0, posX=0, posY=0;
	positionOptions();
	applyGestures();
	var catRatio=cats[catNumber].width/cats[catNumber].height;
	var catWidth=window.innerWidth;
	var catHeight=Math.round(catWidth/catRatio);
	var buttonPadding=65;
	var buttons_hidden=settings.turnDemOff=="true" && !cats[catNumber].firstItem;
	if(buttons_hidden){
		buttonPadding = 0;
	}
	var maxCatHeight= window.innerHeight-buttonPadding;
	var maxCatWidth=window.innerWidth;
	if(catHeight>maxCatHeight){
		catHeight=maxCatHeight;
		catWidth=Math.round(catHeight*catRatio);
	}
	imageElement.style.width=catWidth+"px";
	imageElement.style.height=catHeight+"px";
	var picLeftPad=Math.round((maxCatWidth-catWidth)*0.5);
	var picTopPad=Math.round((maxCatHeight-catHeight)*0.5);
	if(picTopPad<10 && !buttons_hidden){
		picTopPad=10;
	}
	imageElement.style.paddingTop=picTopPad+"px";
	imageElement.style.paddingLeft=picLeftPad+"px";
	defaultProp.scale= catWidth / cats[catNumber].width;
	defaultProp.width= catWidth;
	defaultProp.aspectRatio= catRatio;
	lastCatWidth=catWidth;
	lastCatHeight=catHeight;
}
function applyGestures(){
	imageElement.style.top=picTopPos+posY+"px";
	imageElement.style.left=picLeftPos+posX+"px";
}
function applyScale(){
	var catWidth=defaultProp.width*scale;
	var catHeight=Math.round(catWidth/defaultProp.aspectRatio);
	picTopPos+=(lastCatHeight-catHeight)*percentTouch.y,
	picLeftPos+=(lastCatWidth-catWidth)*percentTouch.x;
	imageElement.style.width=catWidth+"px",
	imageElement.style.height=catHeight+"px";
	applyGestures();
	lastCatWidth=catWidth,
	lastCatHeight=catHeight;
}
document.addEventListener("DOMContentLoaded", didLoad);
window.addEventListener("resize", applySizing);