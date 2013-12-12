var shareLocations=["googleplus","stumbleupon","pinterest","twitter","facebook","adfty","allvoices","amazon_wishlist","arto","baidu","bebo","blinklist","blip","blogmarks","blogger","brainify","buddymarks","buffer","bus_exchange","care2","chiq","citeulike","connotea","corank","corkboard","current","dealsplus","delicious", "linkedin","digg","diigo","dotnetshoutout","dzone","edmodo","evernote","fark","fashiolista","folkd","formspring","fresqui","friendfeed","funp","fwisp","google","google_bmarks","google_reader","google_translate","hatena","hyves","identi","instapaper","jumptags","kaboodle","linkagogo","livejournal","mail_ru","meneame","messenger","mister_wong","mixx","moshare","myspace","n4g","netlog","netvouz","newsvine","nujij","odnoklassniki","oknotizie","orkut","raise_your_voice","reddit","segnalo","sina","slashdot","sonico","speedtile","startaid","startlap","stumpedia","technorati","typepad","tumblr","viadeo","virb","vkontakte","voxopolis","wordpress","xanga","xerpi","xing","yammer","yigg"];
var shareBaseUrl = 'http://rest.sharethis.com/v1/share/share?api_key=evnezzg6nkq7927uydjxts53';//&destination=sharethis&url=www.sharethis.com';
function shareButtons(){
	document.getElementById("shareOptions").style.display="visible";
	document.getElementById("shareOptions").style.top="0px";
}
function hideShareButtons(){
	document.getElementById("shareOptions").style.top="-50px";
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
			//var textShare=document.createTextNode();
			imageShare.setAttribute("src","http://w.sharethis.com/images/"+shareLocations[i]+"_32.png");
			imageShare.setAttribute("title", shareLocations[i]);
			linkShare.setAttribute("href", shareBaseUrl+"&destination="+shareLocations[i]+"&url="+encodeURIComponent(imgObj.link)+"&title="+imgObj.title);
			linkShare.setAttribute("target", "_blank");
			linkShare.appendChild(imageShare);
			document.getElementById("shareOptions").appendChild(linkShare);
		}
	}
}