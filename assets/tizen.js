document.addEventListener("tizenhwkey", function(e) {
	switch (e.keyName) {
	case "back":
		if (cats[catNumber].firstItem) {
			tizen.application.getCurrentApplication().exit();
		}else{
			history.back();
		}
		break;
	case "menu":
		window.location.href = "options.html";
		break;
	default:
		console.log("Not supported.");
	}
});