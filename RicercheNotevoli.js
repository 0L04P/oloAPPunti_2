////////////////////////////////////
///gestione ricerche notevoli /////


function pInizializzaRicercheNotevoli(){	
	if(localStorage["olo_RicercheNotevoli"]){
					
	}else{
		localStorage["olo_RicercheNotevoli"] = JSON.stringify([]);			
	}	
}

function SalvaRicerca(){
	let oRicerca = {};
	oRicerca["IdRicerca"] = new Date().getTime() ;
	
	if($('#txtCerca').val() != ''){		
		oRicerca["Ricerca1"] = NZ($('#txtCerca').val());
		oRicerca["TestoEtichetta"] = NZ(oRicerca["Ricerca1"])
	}
	if($('#txtCerca2').val() != ''){
		oRicerca["Ricerca2"] = NZ($('#txtCerca2').val());
		oRicerca["TestoEtichetta"] = oRicerca["TestoEtichetta"] + ' + ' + NZ(oRicerca["Ricerca2"]);
	}
		
	let arr;
	if(NZ(localStorage["olo_RicercheNotevoli"]) != ''){
		arr = JSON.parse(localStorage["olo_RicercheNotevoli"]);		
	}else{
		//non faccio nulla!
		arr=[];
	} 
	arr.push(oRicerca);	
	localStorage["olo_RicercheNotevoli"] = JSON.stringify(arr);
	//grafica:
	$('.glyphicon-bookmark').css('display', 'none'); 
	setTimeout(function(){
		$('.glyphicon-bookmark').fadeIn();
		CreaElencoRicercheNotevoli();
		}, 200
	);
}

function CreaElencoRicercheNotevoli(){
	let obj;
	if(localStorage["olo_RicercheNotevoli"] == undefined){
		$('#ElencoRicercheNotevoli').html('');
		return false;
	}
	
	let arr = JSON.parse(localStorage["olo_RicercheNotevoli"]);
	if(arr.length > 0){
		let sHTML = '';
		
		for(let i = 0; i<arr.length; ++i){
			obj = arr[i];

			sHTML += `<span><label class='btnRicerca' IdRicerca='${obj["IdRicerca"]}' onclick='RicercaNotevole("${NZ(obj["Ricerca1"])}", "${NZ(obj["Ricerca2"])}")'>
			${NZ(obj["TestoEtichetta"])}
			</label><button class='btnEliminaRicerca' onclick='EliminaRicerca(${obj["IdRicerca"]})'>X</button><span>`				
		}
		$('#ElencoRicercheNotevoli').html(sHTML);
	}	else{
		$('#ElencoRicercheNotevoli').html('');
	}
}



function RicercaNotevole(search1, search2){	
	$('#txtCerca').val(''); $('#txtCerca2').val('');
	if(NZ(search1) == '' && NZ(search2) == ''){
		alert('Campi ricerca non compilati!')
		return false;
	}
	if(NZ(search1) != ''){
		$('#txtCerca').val(search1); 
		Ricerca(); 
	}
	if(NZ(search2) != ''){
		$('#txtCerca2').val(search2); 
		Ricerca2();  
	}	 
}
function EliminaRicercheTutte(){
	localStorage.removeItem("olo_RicercheNotevoli")
}
function EliminaRicerca(idDaEliminare){
	let currentObj = getRicerche();
	let newObj = currentObj.filter(e => e.IdRicerca != idDaEliminare);
	localStorage["olo_RicercheNotevoli"] = JSON.stringify(newObj);
	//grafica:
	$('.glyphicon-bookmark').css('display', 'none'); 
	setTimeout(function(){
		$('.glyphicon-bookmark').fadeIn();
		CreaElencoRicercheNotevoli();
		}, 200
	);
	 
}
 function getRicerche(){
	 obj = JSON.parse(localStorage["olo_RicercheNotevoli"]);
	 return obj;
 }