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
//end settings set up
function didLoad(){
	buttonMagic=document.getElementById("cutestuff");
	imageElement=document.getElementById("cat")
	shareMagic=document.getElementById("shareOptions");
	optional=document.getElementById("option");
	document.getElementById("start").addEventListener("click", startMadness);
	document.getElementById("toggleButton").addEventListener("click", toggleShareButtons);
	document.getElementById("options").addEventListener("click", function(){
		optional.style.top="0%";
	});
	document.getElementById("Halp").addEventListener("click", function(){
		cats[catNumber].link="swipemadeeasy.png";
		showImage(cats[catNumber]);
		document.getElementById("catbug").style.display="none";
	});
	document.getElementById("firstOptions").addEventListener("click", function(){
		optional.style.top="0%";
	});
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
	document.getElementById("tryAgain").addEventListener("click", function(){
		startLoad();
	});
	if(settings.noShare=="true"){
		shareMagic.style.display="none";
		document.getElementById("toggleButton").style.display="none";
	}
	Hammer(imageElement,{drag:false,transform:false}).on("swipeleft", function(event) {
		if(cats[catNumber].firstItem){
			startMadness();
		}else{
			randomImage();
		}
	});
	Hammer(imageElement,{drag:false,transform:false}).on("swiperight", function(event) {
		history.back();
	});
	Hammer(imageElement,{drag:false,transform:false}).on("swipedown", shareButtons);
	Hammer(imageElement,{drag:false,transform:false}).on("swipeup", hideShareButtons);
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
	optional.style.top="-250%";
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
	var catRatio=cats[catNumber].width/cats[catNumber].height;
	var catWidth=window.innerWidth;
	var catHeight=Math.round(catWidth/catRatio);
	var buttonPadding=65;
	var buttons_hidden=settings.turnDemOff=="true" && !cats[catNumber].firstItem;
	if(buttons_hidden){
		buttonPadding = 0;
	}
	var maxCatHeight= window.innerHeight-buttonPadding;
	if(catHeight>maxCatHeight){
		catHeight=maxCatHeight;
		catWidth=Math.round(catHeight*catRatio);
		imageElement.style.paddingTop="0px";
		if(!buttons_hidden){
			imageElement.style.paddingTop="10px";
		}
	}else{
		var picTopPad=Math.round((maxCatHeight-catHeight)*0.5);
		if(picTopPad<10 && !buttons_hidden){
			picTopPad=10;
		}
		imageElement.style.paddingTop=picTopPad+"px";
	}
	imageElement.style.width=catWidth+"px";
	imageElement.style.height=catHeight+"px";
}
document.addEventListener("DOMContentLoaded", settingsLoad);
document.addEventListener("DOMContentLoaded", didLoad);
document.addEventListener("DOMContentLoaded", optionLoad);
window.addEventListener("resize", applySizing);