var catBugObj={width:1024,height:667,title:"Welcome!",link:"catbug.png", firstItem:true};
var cats=[catBugObj];
var catNumber=0;
var pgNum=0;
var buttonMagic=null, shareMagic=null, imageElement=null;
var is_loading=false;
document.addEventListener(‘tizenhwkey’, function(e) {
var activePage = $.mobile.activePage().attr(‘id’); // read current page
switch(e.keyName)
{
case ‘back’:
tizen.application.getCurrentApplication().exit();
break;
case ‘menu’:
break;
default:
console.log(“Not supported.”);
}
});
function didLoad(){
	buttonMagic=document.getElementById("cutestuff");
	imageElement=document.getElementById("cat")
	shareMagic=document.getElementById("shareOptions");
	document.getElementById("start").addEventListener("click", startMadness);
	document.getElementById("toggleButton").addEventListener("click", toggleShareButtons);
	document.getElementById("options").addEventListener("click", function(){
		window.location.href="options.html";
	});
	document.getElementById("firstOptions").addEventListener("click", function(){
		window.location.href="options.html";
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
					window.location.href="options.html";
				}
			}else{
				document.getElementById("tryTryAgain").style.display="block";
				stopGif();
			}
		}
	}
	xhr.open('GET', 'https://api.imgur.com/3/gallery/r/'+settings.subreddit+'/time/day/'+pgNum, true);
	xhr.setRequestHeader("Authorization", "Client-ID e0114193f3d0c77");
	xhr.send(null);
	loadingGif();
}
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
	shareMagic.style.display="block";
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
		document.getElementById("shareOptions").style.display="none";
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

document.addEventListener("DOMContentLoaded", didLoad);
window.addEventListener("resize", applySizing);