var selectables=[
	"aww", 
	"animalsbeingderps", 
	"earthporn", 
	"funny", 
	"pics", 
	"spaceporn", 
	"wheredidthesodago", 
	"wtf"
];
function switchTheSub(){
	var subRed1=document.getElementById("subreddit");
	var subRed2=document.getElementById("subRedditReplace");
	if (subRed2.value!=""){
		subRed1.value = subRed2.value;
		subRed2.value = "";
	}
}
function likeUnlike(){
	if (document.getElementById("favoriteStar").className!="like"){
		likeIt();
		
	}else{
		unLikeIt();
		var removeRed1 = document.getElementById("subreddit").value;
		for (var i=0, l=selectables.length; i<l; i++){
			if (selectables[i]==removeRed1){
				selectables.splice(i,1);
				break;
			}
		}
	}
}
function likeIt(){
	document.getElementById("favoriteStar").innerHTML="&starf;";
	document.getElementById("favoriteStar").className="like";
}
function unLikeIt(){
	document.getElementById("favoriteStar").innerHTML="&star;";
	document.getElementById("favoriteStar").className="unlike";
}
function createSubDropDown(){
	for (var i=0, l=selectables.length; i<l; i++){
		var textualOptions=document.createElement("option");
		textualOptions.setAttribute("value",selectables[i]);
		textualOptions.appendChild(document.createTextNode(selectables[i]));
		document.getElementById("subRedditReplace").appendChild(textualOptions);
	}
	document.getElementById("subRedditReplace").addEventListener("change", switchTheSub);
}