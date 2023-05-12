var filtro;

$(document).ready(function(){	 
	filtro = '';
}());
 
 var array
function crea(){	  
	let strHTML = ``;
	array= ERRORI_COMUNI.split('ITEM');
	for(let i=1; i<array.length; ++i){

		strHTML = `<span class='errori hidden' id='hid_sp${i}'><b>${i})</b>  ` + array[i].replace('-', '')  + `<br/></span>`;
		strHTML += `<span class="errori" style="font-style: normal;" id='sp${i}'><b>${i})</b>  ` + array[i].replace('-', '')  + `<br/></span>`;
		try {
		  $('#divErrori').append(strHTML);
		} 
		catch (error) {
		  console.error('errore riga ' + i + '\n' + error);	  
		}
	}	
	
	//TogliSpaziWhitePre();
}

function distruggi(){
	$('#divErrori').html('');
}
 
 
 //qui perchè nel ready non esisteva ancora il divErrori
window.addEventListener('DOMContentLoaded', (event) => {
    crea();
	$('#txtCerca').focus();
	//TogliSpaziWhitePre();
});

const  arrTrovati = [];
function Ricerca(){	
	let TestoRicerca = $('#txtCerca').val();

	if(TestoRicerca == '' && $('.evidenziato').length == 0){		
		crea();
	}
	else if(TestoRicerca == '' && $('.evidenziato').length > 0){		
		//window.location.reload(true);
		distruggi();
		crea();
	}
	else{
		$('.errori').css('display','none').removeClass('cercato');
		let EmptyArr = [];
		arrTrovati.length = 0;	
		arrTrovati.splice();
		//alert('----  ' + arrTrovati.length)
		
		for(let i=1; i<array.length; ++i){		
			let Regex = new RegExp(TestoRicerca, 'gi')		
			if(Regex.test(array[i])){			
			
				$(`#sp${i}`).css('display','block').addClass('cercato');
				arrTrovati.push(i);						
				let str = array[i];
				//splitto la stringa				
				let aux_str = str.substring(/label>/.exec(str).index+6).trim()
				let auxRegex = new RegExp(TestoRicerca, "ig")
				let new_str = `<b>${i})</b> ` + aux_str.replaceAll(auxRegex, '<b class="evidenziato">' + TestoRicerca +'</b>');
				$(`#sp${i}`).html(new_str)					
			}
		}	
	} 
	TogliSpaziWhitePre();
}

function Ricerca2(){
	let TestoRicerca = $('#txtCerca2').val();

	if(TestoRicerca!=''){
		$('#txtCerca').attr('disabled', true)
	}
	else{
		$('#txtCerca').attr('disabled', false)
	}
	
	for(let i=0; i<arrTrovati.length; ++i){
		
		let Regex = new RegExp(TestoRicerca, 'gi')		
		if(Regex.test(array[arrTrovati[i]])){	
			let k = arrTrovati[i];		
			$(`#sp${arrTrovati[i]}`).css('display','block');					
			//NEW														
			let str = array[arrTrovati[i]];
			//splitto la stringa				
			let aux_str = str.substring(/label>/.exec(str).index+6).trim()
			let auxRegex0 = new RegExp($('#txtCerca').val(), "ig");
			let auxRegex1 = new RegExp(TestoRicerca, "ig");
			let aux_str_postRicerca1 = aux_str.replaceAll(auxRegex0, '<b class="evidenziato">' + $('#txtCerca').val() +'</b>');
			let new_str = `<b>${i})</b> ` + aux_str_postRicerca1.replaceAll(auxRegex1, '<b class="evidenziato2">' + TestoRicerca +'</b>');
			$(`#sp${arrTrovati[i]}`).html(new_str);				
		}
		else{
			$(`#sp${arrTrovati[i]}`).css('display','none');			
		}
	}
	
	$('body').css('opacity', 1);
	TogliSpaziWhitePre();
} 
function SvuotaFiltro(){
	filtro = '';
	return true;
}
function PulisciCampi(){
	$('#txtCerca').val('');
	$('#txtCerca2').val('');
	Pulisci();
	$('#txtCerca').focus();
	return true;
}
//filtro rapido js
function btnjs(){
	//$('.argomento').parent().css('display','none'); 
	//$('.JS').parent().css('display','');
	PulisciCampi();	
	
	if (filtro != 'JS'){
		filtro = 'JS';
	}else{
		filtro = '';
	};
	
	//if($('#btnJS').css('color') != 'rgb(255, 255, 0)')	//old
	if(filtro == 'JS')
	{
		$('#btnJS').css('color','rgb(255, 255, 0)').css('font-size','20px');
		$('#btnVB').css('color','rgb(255, 255, 255)').css('font-size','14px');
		$('#btnSQL').css('color','rgb(255, 255, 255)').css('font-size','14px');
		
		$('.argomento').parent().css('display','none'); 
		$('.JS').parent().css('display','');		
		TogliSpaziWhitePre();
	}
	else{
		$('#btnJS').css('color','rgb(255, 255, 255)').css('font-size','14px');		
		
		Pulisci();
	}	
}
//filtro rapido vb
function btnvb(){
	//$('.argomento').parent().css('display','none'); 
	//$('.VB').parent().css('display','');
	PulisciCampi();	
	if (filtro != 'VB'){
		filtro = 'VB';
	}else{
		filtro = '';
	};
	///if($('#btnVB').css('color') != 'rgb(255, 255, 0)')
	if(filtro == 'VB')
	{
		$('#btnVB').css('color','rgb(255, 255, 0)').css('font-size','20px');
		$('#btnJS').css('color','rgb(255, 255, 255)').css('font-size','14px');
		$('#btnSQL').css('color','rgb(255, 255, 255)').css('font-size','14px');
		
		$('.argomento').parent().css('display','none'); 
		$('.VB').parent().css('display','');		
		TogliSpaziWhitePre();
	}
	else{
		$('#btnVB').css('color','rgb(255, 255, 255)').css('font-size','14px');

		Pulisci();	
	}
	
}

//filtro rapido sql
function btnsql(){
	//$('.argomento').parent().css('display','none'); 
	//$('.VB').parent().css('display','');
	PulisciCampi();	
	if (filtro != 'SQL'){
		filtro = 'SQL';
	}else{
		filtro = '';
	};
	//if($('#btnSQL').css('color') != 'rgb(255, 255, 0)')
	if(filtro == 'SQL')
	{
		$('#btnSQL').css('color','rgb(255, 255, 0)').css('font-size','20px');
		$('#btnJS').css('color','rgb(255, 255, 255)').css('font-size','14px');
		$('#btnVB').css('color','rgb(255, 255, 255)').css('font-size','14px');
		
		$('.argomento').parent().css('display','none'); 
		$('.SQL').parent().css('display','');		
		TogliSpaziWhitePre();
	}
	else{
		$('#btnSQL').css('color','rgb(255, 255, 255)').css('font-size','14px');

		Pulisci();	
	}
	
}

function Pulisci(){
	
	$('#txtCerca').val('').focus().attr('disabled', false);
	$('#txtCerca2').val('');
	$('.argomento').parent().css('display','');
	$('#btnVB').css('color','white').css('font-size','14px'); 
	$('#btnJS').css('color','white').css('font-size','14px'); 
	
	Ricerca();	
	TogliSpaziWhitePre();
}

function ToTop(velocita){
	
	$("html, body").animate({ scrollTop: 0 }, velocita); 
	return false;
}

function TogliSpaziWhitePre(){	

	let i = 1;
	let id = `sp${i}`;
	while($('#'+id).length > 0){	
		$('#'+id).html($('#'+id).html().replace(/\<br\>$/, ''));
		i+=1;
		id = `sp${i}`;
	}
}
