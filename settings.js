var settings={};
//default values: we will attempt to load from local storage
settings.subreddit= "aww";
//add options here, define input elements in options.html
settings.sfw="true";
settings.turnDemOff="false";

function settingsLoad(){
	for(var setting in settings){
		if (typeof(localStorage[setting])!="undefined"){
			settings[setting]=localStorage[setting];
		}
	}
}
document.addEventListener("DOMContentLoaded", settingsLoad);