var catBugObj={width:1024,height:667,title:"Welcome!",link:"catbug.png", firstItem:true};
var cats=[catBugObj];
var catNumber=0;
var pgNum=0;
var buttonMagic=null;
function didLoad(){
	buttonMagic=document.getElementById("cutestuff");
	var imageElement=document.getElementById("cat")
	document.getElementById("start").addEventListener("click", startMadness);
	document.getElementById("options").addEventListener("click", function(){
		window.location.href="options.html";
	});
	document.getElementById("firstOptions").addEventListener("click", function(){
		window.location.href="options.html";
	});
	document.getElementById("nextpic").addEventListener("click", randomImage);
	imageElement.addEventListener("load", applySizing);
    Hammer(imageElement,{drag:false,transform:false}).on("swipeleft", function(event) {
        if (cats[catNumber].firstItem){
			startMadness();
		}else{
		randomImage();
		}
    });
	Hammer(imageElement,{drag:false,transform:false}).on("swipedown", function(event) {
        if (cats[catNumber].firstItem){
			startMadness();
		}else{
		randomImage();
		}
    });
	Hammer(imageElement,{drag:false,transform:false}).on("swiperight", function(event) {
        history.back();
    });
	window.onpopstate = function(event) {
		if (event.state && event.state.link){
			cats.push(event.state);
			catNumber=cats.length-1;
			showImage(cats[catNumber]);
			if (cats[catNumber].firstItem){
				stopMadness();
			}else{
				needMoreButton();
			}
		}
	};
	Hammer(imageElement,{drag:false,transform:false}).on("swipeup", function(event) {
        history.back();
    });
	window.onpopstate = function(event) {
		if (event.state && event.state.link){
			cats.push(event.state);
			catNumber=cats.length-1;
			showImage(cats[catNumber]);
			if (cats[catNumber].firstItem){
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
	var imageElement=document.getElementById("cat");
	 
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
				alert('Error: '+xhr.status); 
			}
		}
	}
	xhr.open('GET', 'https://api.imgur.com/3/gallery/r/'+settings.subreddit+'/time/day/'+pgNum, true);
	xhr.setRequestHeader("Authorization", "Client-ID e0114193f3d0c77");
	xhr.send(null);
	imageElement.style.visibility="hidden";
}
function needMoreButton(){
	buttonMagic.style.display="block";
	document.getElementById("welcome").style.display="none";
	if (settings.turnDemOff=="true"){
		buttonMagic.style.display="none";
	}
}
function startMadness(){
	needMoreButton();
	startLoad();
}
function stopMadness(){
	document.getElementById("cutestuff").style.display="none";
	document.getElementById("welcome").style.display="block";
}
function randomImage(ev,freshNip){
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
	var imageElement=document.getElementById("cat");
	if (settings.sfw=="true" && imgObj.nsfw==true){
		imageElement.src="over18.png";
		applySizing();
		imageElement.title="nsfw";
	}else{
		imageElement.style.visibility="hidden";
		imageElement.src=imgObj.link;
		imageElement.title=imgObj.title;
	}
}
function applySizing(){
	var imageElement=document.getElementById("cat");
	var catRatio=cats[catNumber].width/cats[catNumber].height;
	var catWidth=window.innerWidth;
	var catHeight=Math.round(catWidth/catRatio);
	var maxCatHeight= window.innerHeight-55;
	if (settings.turnDemOff=="true"&&!cats[catNumber].firstItem){
		maxCatHeight= window.innerHeight-20;
	}
	if(catHeight>maxCatHeight){
		catHeight=maxCatHeight;
		catWidth=Math.round(catHeight*catRatio);
	}else{
		imageElement.style.paddingTop=Math.round((maxCatHeight-catHeight)*0.5)+"px";
	}
	imageElement.style.width=catWidth+"px";	
	imageElement.style.height=catHeight+"px";
	imageElement.style.visibility="visible";
}

document.addEventListener("DOMContentLoaded", didLoad);
window.addEventListener("resize", applySizing);