var selectables=[
	"aww", 
	"animalsbeingderps",
	"comics",
	"earthporn", 
	"funny", 
	"pics", 
	"spaceporn", 
	"wtf"
];
if (typeof(localStorage.selectables)!="undefined"){
	var unstringSelectables = JSON.parse(localStorage.selectables);
	if (typeof(unstringSelectables)=="object"){
		selectables=unstringSelectables;
	}
}
function switchTheSub(){
	var subRed1=document.getElementById("subreddit");
	var subRed2=document.getElementById("subRedditReplace");
	if (subRed2.value!=""){
		subRed1.value = subRed2.value;
		subRed2.value = "";
	}
	updateStarState();
}
function updateStarState(){
	var newRed = document.getElementById("subreddit").value;
	if (checkIfFavorites(newRed)){
		likeIt();
	}else{
		unLikeIt();
	}
}
function checkIfFavorites(subreddit_name){
	for (var i=0, l=selectables.length; i<l; i++){
		if (selectables[i]==subreddit_name){
			return true;
		}
	}
	return false;
}
function likeUnlike(){
	if (document.getElementById("favoriteStar").className!="like"){
		likeIt();
		var addRed1 = document.getElementById("subreddit").value;
		if (!checkIfFavorites(addRed1)){
			selectables.push(addRed1);
			selectables.sort();//alphabetizing
		}
	}else{
		unLikeIt();
		var removeRed1 = document.getElementById("subreddit").value;
		for (var i=0, l=selectables.length; i<l; i++){
			if (selectables[i]==removeRed1){
				selectables.splice(i,1);
			}
		}
	}
	localStorage.selectables=JSON.stringify(selectables);
	recreateSubDropDown();
}
function likeIt(){
	document.getElementById("favoriteStar").innerHTML="&starf;";
	document.getElementById("favoriteStar").className="like";
}
function unLikeIt(){
	document.getElementById("favoriteStar").innerHTML="&star;";
	document.getElementById("favoriteStar").className="unlike";
}
function recreateSubDropDown(){
	var selectMenu=document.getElementById("subRedditReplace");
	while (selectMenu.firstChild){
		selectMenu.removeChild(selectMenu.firstChild);
	}
	var textualOptions=document.createElement("option");
	textualOptions.setAttribute("value","");
	textualOptions.appendChild(document.createTextNode(" - Suggestions! - "));
	selectMenu.appendChild(textualOptions);
	for (var i=0, l=selectables.length; i<l; i++){
		textualOptions=document.createElement("option");
		textualOptions.setAttribute("value",selectables[i]);
		textualOptions.appendChild(document.createTextNode(selectables[i]));
		selectMenu.appendChild(textualOptions);
	}
}
function createSubDropDown(){
	recreateSubDropDown();
	document.getElementById("subRedditReplace").addEventListener("change", switchTheSub);
	document.getElementById("favoriteStar").addEventListener("click", likeUnlike);
	document.getElementById("subreddit").addEventListener("keyup", updateStarState);
	updateStarState();
}