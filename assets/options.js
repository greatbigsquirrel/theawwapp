document.addEventListener("tizenhwkey", function(e) {
	switch (e.keyName) {
	case "back":
		goBack();
		break;
	case "menu":
		goBack();
		break;
	default:
		console.log("Not supported.");
	}
});
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
	window.location.href="index.html";
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
	goBack();
}
document.addEventListener("DOMContentLoaded", optionLoad);