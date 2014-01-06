var shareLocations=[
	{name:"Stumbleupon", icon:"stumbleupon_32.png", url:"http://www.stumbleupon.com/submit?url=*URL*"},
	{name:"Pinterest", icon:"pinterest_32.png", url:"http://pinterest.com/pin/create/button/?url=*URL*&media=*IMG*&description=*TITLE*"},
	{name:"Googleplus", icon:"googleplus_32.png", url:"https://plus.google.com/share?url=*URL*"},
	{name:"Twitter", icon:"twitter_32.png", url:"http://twitter.com/home?status=*TITLE*%20-%20*URL*"},
	{name:"Facebook", icon:"facebook_32.png", url:"http://www.facebook.com/sharer.php?u=*URL*&t=*TITLE*"}
];
//for more share buttons: http://w.sharethis.com/images/#nameofsite(ex.pinterest)_32.png
function shareButtons(){
	document.getElementById("Slider").style.display="visible";
	document.getElementById("Slider").style.top="0px";
}
function hideShareButtons(){
	document.getElementById("Slider").style.top="-70px";
}
function toggleShareButtons(){
	if (document.getElementById("Slider").style.top=="0px"){
		hideShareButtons();
	}else{
		shareButtons();
	}
}
function shareButtonMagic(imgObj){
	document.getElementById("shareOptions").innerHTML="";
	if (imgObj.firstItem || settings.noShare=="true"){
		return;
	}
	for (var i=0, l=shareLocations.length; i<l; i++){
		if (i<5){
			var imageShare=document.createElement("img");
			var linkShare=document.createElement("a");
			imageShare.setAttribute("src","icons/social_icons/"+shareLocations[i].icon);
			imageShare.setAttribute("title", shareLocations[i].name);
			linkShare.setAttribute("href", shareLocations[i].url.replace("*URL*",escape(imgObj.link.match(/(.*)\.[^.]+$/)[1])).replace("*TITLE*", escape(imgObj.title)).replace("*IMG*", escape(imgObj.link)));
			linkShare.setAttribute("target", "_blank");
			linkShare.appendChild(imageShare);
			document.getElementById("shareOptions").appendChild(linkShare);
			document.getElementById("shareOptions").style.display="inline-block";
		}
	}
}