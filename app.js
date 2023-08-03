var url = 'http://localhost:1994/WS/BesWS.svc/'; 


function Copia(id){
	var copyText = document.getElementById(id);
	copyText.select();
	copyText.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(copyText.value); 	
}

function CopiaDaDiv(id){
	var div = document.getElementById(id);
	let testo = div.innerHTML;
	navigator.clipboard.writeText(testo); 	
}