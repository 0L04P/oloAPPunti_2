var url = 'http://localhost:1994/WS/Bes.svc/'

$(document).ready(function(){
		ForzaZoom();
		
	    $('#txtProgetto').focus();	    
 	    
	    if (sessionStorage.getItem('TipoForm') == 'BROWSE'){
	    	    $('#chkBROWSE').prop("checked", true);	    
	    	    $('#lblTipoForm').text('BROWSE')
	    }
	    else if (sessionStorage.getItem('TipoForm') == 'SCREEN'){
	    	    $('#chkSCREEN').prop("checked", true);	    
	    	    $('#lblTipoForm').text('SCREEN')
	    }
	    else{ 
	    	    $('#chkBROWSE').prop("checked", true);	    	    
	    	    sessionStorage.setItem('TipoForm', 'BROWSE');
	    	    $('#lblTipoForm').text('BROWSE')	    	    
	    }		    
	    GestioneCheckBox(); 

		BindCMB();
 }());
 function ForzaZoom(){
	 try {
		  document.body.style.zoom = "120%";//forzo lo zoom del browser
		}
		catch(err) {
		  console.log('Errore zoom:' + err)
		}
	 
 }
  
 function BindCMB(){
	 try{
		$.ajax({  
			type: "POST", 
			url: url + "GetDatabasesWS", 
			dataType: "json", 
			contentType: "application/json", 
			success: function (oJSON)  
		{  let arrayDB = oJSON.Database;
			arrayDB.forEach(NomeDB => $("#cmbDB").append($("<option style='font-weight: bold;'></option>").val(NomeDB).html(NomeDB)));				
		} , 
		error: function(output) {
					//alert('Error in API call BindCMB!');			  
					$('#lblErrori').text('Error in API call BindCMB!')
	    }	
	}); 
		 
	 }catch(exc){
		 console.log(ex)
;	 }
	 

	 
 }
 
 function GetTablesFromDB(t){
	 //let t = $('#cmbDB').val();
	 let MyJson = `{
		"Database":"${t}"
		}`	
		$.ajax({
			 
			"crossDomain": true,
			"async": false,
			"url": url + "GetTabelleFromDBWS",
			"method": "POST",
			"data": MyJson,
			"contentType": "application/json; charset=utf-8",
			 
			 success: function(oJSON, status, xhr) {
				$('#cmbTabelle').html('')				 
				let arrayTabelle = oJSON.Tabelle;
				arrayTabelle.forEach(NomeTabella => $("#cmbTabelle").append($("<option style='font-weight: bold;'></option>").val(NomeTabella).html(NomeTabella))) 		
			 },
			 error: function(output) {
					//alert('Error in API call GetTablesFromDB!')					  
					$('#lblErrori').text( $('#lblErrori').text() + ' Error in API call GetTablesFromDB!')
			 }		
		  }); 		  
		  return '';
}
 
 function GetIClassi(){	 
	 if ($('#cmbTabelle').val()!='' && $('#cmbDB').val()!=''){
		 //$('#LoadingGIF').css('display','')
		let myTimeout = setTimeout($('#txtIClassiSsql').val(GetIClassiSsql($('#cmbDB').val(), $('#cmbTabelle').val())), 1000)		 
	 }else{
		 alert('campi non compilati')
	 }
 }
 
 function GetIClassiSsql(db, tabella){
	 try{
		 MyJson = `{
			"Database":"${db}",
			"Tabella":"${tabella}"
		}`
		/*async:false perchè poi mi server per la compilazione della browse....*/
		let s = ''
		 $.ajax({				 
				"crossDomain": true,
				"async": false,
				"url": url + "GetIClassiSsql",
				"method": "POST",
				"data": MyJson,
				"contentType": "application/json; charset=utf-8",
				 
				 success: function(output, status, xhr) {   
					s = output.IClassiSsql	
					//$('#LoadingGIF').css('display','none')				
				 },
				 error: function(output) {
						alert('Error in API call GetIClassiSsql!');
						return "";						
				 }		
			  }); 
		  $('#txtIClassiSsql').val(s);
		  return s;		 
	 }catch(err){
		 
		 return "";
	 }
	 
}
 
 function BindTabelle(){	
	if($('#cmbDB').val()!=''){GetTablesFromDB($('#cmbDB').val())} 
 }
 
 function EliminaFiltri(){
		 $('#divFiltri').html(''); 
		 $('#txtPropertyFiltri').val(''); 
		 $('#txtHTMLFiltri').val('');	 
 }
 
 //Pre-Compilo se Screen o Browse
 function GestioneCheckBox(){ 
	    if(sessionStorage.getItem('TipoForm') == 'SCREEN'){	    	    	    	    
	    	    $('#chkPREINIT').attr('checked',true)	    	    
	    	    $('#chkINIT').attr('checked',true)
	    	    $('#chkINIT_COMPLETE').attr('checked',true)
	    	    $('#chkLOAD').attr('checked',true)
	    	    $('#chkPRE_RENDER').attr('checked',true)
	    	    	    	    
	    	    $('#chkF2').attr('checked',false)
	    	    $('#chkFCODE').attr('checked',true)

	    	    $('#chkWEBMETHOD').attr('checked',false)
				$('#chkTASCHE').attr('checked',false)				
	    	    
	    	    $('.divScreen').css('display','block')
	    	    $('.divBrowse').css('display','none')
				
				$('#divFuocoFiltri').css('display','none')
	    }
	    else{	    	    
	    	    $('#chkPREINIT').attr('checked',true)	    	    
	    	    $('#chkINIT').attr('checked',true)
	    	    $('#chkINIT_COMPLETE').attr('checked',true)
	    	    $('#chkLOAD').attr('checked',true)
	    	    $('#chkPRE_RENDER').attr('checked',true)	    	    
	    	    
	    	    $('#chkF2').attr('checked',false)
	    	    $('#chkFCODE').attr('checked',true)	    	    
	    	    
	    	    $('#chkWEBMETHOD').attr('checked',false)
				$('#chkTASCHE').attr('checked',false)				

	    	    $('#chkScreenClassica').attr('checked',true) 
	    	    $('#chkScreenFD').attr('checked',false)	    
	    	    $('#chkHamburger').attr('checked',false)	    	    	    	    	    
	    	    
	    	    $('.divScreen').css('display','none')
	    	    $('.divBrowse').css('display','block')
				
				$('#divFuocoFiltri').css('display','block')
	    }
 }
 
function copia() {

	    var copyText = document.getElementById("txtTesto");

	    copyText.select();
	    copyText.setSelectionRange(0, 99999); /* For mobile devices */

	    navigator.clipboard.writeText(copyText.value);
	    //effetto grafico
	    $('.lblWarning').removeClass('lblFadingOutWarning');
	    setTimeout(function () { 
	    	    $('.lblWarning').css('display','block').addClass('lblFadingOutWarning');
	    }, 200);   
}

function CopiaIclassi(){
	var copyText = document.getElementById("txtIClassiSsql");

	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	navigator.clipboard.writeText(copyText.value);	
}

function copia_ById(id) {  
		var copyText = document.getElementById(id);
	    copyText.select();
	    copyText.setSelectionRange(0, 99999); /* For mobile devices */

	    navigator.clipboard.writeText(copyText.value);  
}

function verificaDati(){
	    if($('#txtProgetto').val() == '' || $('#txtClasse').val() == '' || $('#txtSigla').val() == ''){
	    	    alert('Compilare tutti i campi!')
	    	    return false;
	    }
	    else{
	    return true;
	    }
}

function Cambia(v){
	    sessionStorage.setItem('TipoForm', v); 
	    $('#lblTipoForm').text(v).removeClass().addClass('lbl' + v); 
	    $('#btnGenera').removeClass().addClass('btn' + v).addClass('btn')
	    GestioneCheckBox();
	    
	    $('.divFuoco').css('display','block');
 
	    $('#lblTipoFormBtn').text(v);
		$('#txtProgetto').focus();
		 
		if(v == 'BROWSE'){
			$('#btnGeneraHTMLfiltri').html('Genera HTML filtri')
		}else{
			$('#btnGeneraHTMLfiltri').html('Genera HTML campi')
		}				
}

function ImpostaHamburger(){

	    $('#divHam').css('display', '')	    	    
	    
	    $('#divHam').empty();
	    let n = $('#txtNumHam').val();
	    let sHTML = '';
	    if(n!='' && n!= undefined && n!=null){	    	    
			for(let i = 1; i<=n; ++i){
					
					let id = 'txtNome' + i
					let idLbl = 'lblNome' + i
					let x = 10+i
					
					sHTML+='<div class="col-xs-12">'
					//OLD sHTML+='<b style="vertical-align: -8px;">btnF' + x +  '</b><input id="' + id + '" onchange="$(\'#' + idLbl + '\').text(\'btnF' + x +  '\' + $(\'#' + id +'\').val() )">'	
					sHTML+='<b style="vertical-align: -8px;">btnF' + x +  '</b><input id="' + id + '" style="text-transform: capitalize" onchange="$(\'#' + idLbl + '\').text( $(\'#txtNome' + i + '\').val().substring(0,1).toUpperCase() + $(\'#txtNome' +  i + '\').val().substring(1))">'																														 																				
					sHTML+='<b id="' + idLbl + '" class="btnHamburger hidden"></b>'
					
					sHTML += '&nbsp; &nbsp; <button class="btn btn-info" onclick="ApriFdGlyphicon(' + i + ')">Glyphicon</button>'
					sHTML += '<span id="spanGlyphicon_' + i  + '" style="margin: 10px 0px 0 10px; font-size: 20px;"></span>'
					
					sHTML+='</div>'	    	    	    
			}					
			$('#divHam').append(sHTML)	    	    
	    }	    
}

var g = '';
function ApriFdGlyphicon(i){
	$('#divS').css('display', '');
	g = i;
}

function setGlyphicon(t){
	
	//let class= $(this).attr('class');
	let classe = t.classList[0] + ' ' + t.classList[1];
	//debugger;
	$('#spanGlyphicon_' + g).removeClass()
	$('#spanGlyphicon_' + g).addClass(classe)
	$('#divS').css('display', 'none');
}

function ImpostaTasche(){
	    $('#divTas').css('display', '')	    	    	    
	    $('#divTas').empty();
	    let n = $('#txtNumTasche').val();
	    let sHTML = '';
	    if(n!='' && n!= undefined && n!=null){	    	    
			for(let i = 0; i< n; ++i){
					
				let id = 'txtNomeTasca' + i
				let idLbl = 'lblNomeTasca' + i
				
				sHTML+='<div class="col-xs-12">'
				sHTML+='<b style="vertical-align: -8px;">' + i +  '</b>&nbsp;<input id="' + id + '" style="text-transform: capitalize" >'	    	    	    	    	    	    	    	    	    	    	    	    	    	    
				sHTML+='<b id="' + idLbl + '" class="btnHamburger hidden"></b>'
				sHTML+='</div>'	    	    	    
			}
					
			$('#divTas').append(sHTML)	    	    
	    }			   
}

function VisualizzaDivHamburger(){
	     
	    if($('#divHamburger').css('display') != 'none'){
	    	    $('#divHamburger').css('display', 'none')	    	    
	    }else{
	    	    $('#divHamburger').css('display', '')	    	    
	    }	    
}

function VisualizzaDivTasche(){
	     
	    if($('#divTasche').css('display') != 'none'){
	    	    $('#divTasche').css('display', 'none')	    	    
	    }else{
	    	    $('#divTasche').css('display', '')	    	    
	    }	 
		//check su WebMethod
		$('#chkWEBMETHOD').attr('checked', true)		
}

function SetMaiuscolaIniziale(id){	
	$('#'+id).val($('#'+id).val().substring(0,1).toUpperCase() + $('#'+id).val().substring(1))	
}

function GeneraPagina(){
let startTime = performance.now()

	if(!verificaDati()) {return false;}
	
	//compilo i campi con le property
	generaHTMLfiltri();
	//let testo = '';
	//pulisco le variabili 		
	/*if( $('#cmbDB').val()!='' && $('#cmbTabelle').val()!=''){
		GetIClassiSsql($('#cmbDB').val(), $('#cmbTabelle').val());				
	}*/
	//The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.
	//splitto in un array e cerco le chiavi racchiuse tra $
	//Chiavi = $('#txtIClassiSsql').val().replaceAll("'", "").split("$").filter(word => !/\s/.test(word) && word.trim().length > 0)					
	Chiavi = ["aaa", "bbb","ccc"]
	//JS passa i valori ByVal, ma gli oggetti ByRef
	//creo un oggetto
	var pagina = {
		testo : "",
		isBrowse:	$('#lblTipoForm').text().toUpperCase() == 'BROWSE',
		isScreen : !$('#lblTipoForm').text().toUpperCase() == 'BROWSE',	
		arrChiavi : Chiavi
	}
		
	//pulisco il testo!
	$('#txtTesto').val('');
		
	arrBoolImport = [1,1,1,1,1];
	//distinguo
	if (pagina.isBrowse){
		pagina.testo = CONSTBrowseTesto;
		$('#txtTestoAspx').val(aspx_BROWSE);
	}else{
		pagina.testo = CONSTScreenTesto;
		$('#txtTestoAspx').val(aspx_SCREEN);
	}
			
	GestioneSpunteEventi(pagina);//chkFCODe, chkPREINIT, chkINIT
	GestionePagine(pagina);
	GestioneSpunteAltre(pagina);
	
	//se non c'è stato errore nella api call, popolo l'ICLASSISSQL
	///PopolaIClassi(pagina);
	
	GestioneTasche(pagina);
	GestioneBrowse(pagina); 
	GestioneHamburger(pagina);
	GestioneFiltri(pagina);
	GestioneImports(pagina);


	//qualora non avessi gestito un $...$ lo pulisco. Tolgo eventuali doppi a capo NON PIU' (9mar2022)
	pagina.testo = pagina.testo.replace(/\$[\w]+\$/, 'g')//.replaceAll(/\n[\w\W]?\n/g, '\n').replaceAll(/\n[\s]+\n/g, '\n');
	pagina.testo = pagina.testo.replaceAll('£', '$')
	$('#txtTesto').val(pagina.testo);
				
	copia();		
		
	let endTime = performance.now()
	console.log(`GeneraPagina (NUOVA) took ${endTime - startTime} milliseconds`)	
}

function PopolaIClassi(pagina){
	//se non c'è stato errore nella api call, popolo l'ICLASSISSQL
	if($('#cmbDB').val() != null){
		if ($('#cmbDB').val().trim()!= '' && $('#cmbTabelle').val().trim()!= ''){				
			pagina.testo = pagina.testo.replaceAll('$ICLASSISSQL$', $('#txtIClassiSsql').val().replaceAll("$", "£"))				
		}else
		{	pagina.testo = pagina.testo.replaceAll('$ICLASSISSQL$','') }					
	}	else{
		pagina.testo = pagina.testo.replaceAll('$ICLASSISSQL$','')				
	}	
}

function GestioneSpunteEventi(pagina){
	
	if($('#chkFCODE').prop('checked') == true){					
		if (pagina.isBrowse){
			pagina.testo = pagina.testo.replaceAll('$FCODE$',testoFCODE)				
		}else{
			pagina.testo = pagina.testo.replaceAll('$FCODE_S$',testoFCODE_S);
 			
		}    	    	    
	}
	else{
		if (pagina.isBrowse){
			pagina.testo = pagina.testo.replaceAll('$FCODE$','')				
		}else{
			pagina.testo = pagina.testo.replaceAll('$FCODE_S$','');	
		}	    
	} 
	
	if($('#chkPREINIT').prop('checked') == true){				
		pagina.testo = pagina.testo.replaceAll('$PREINIT$',testoPREINIT)				    	    	    	    
	}
	else{
		pagina.testo = pagina.testo.replaceAll('$PREINIT$','')	    
	} 
			
	if($('#chkINIT').prop('checked') == true){					
		if (pagina.isBrowse){
			pagina.testo = pagina.testo.replaceAll('$INIT$',testoINIT);				
		}else{
			pagina.testo = pagina.testo.replaceAll('$INIT_S$',testoINIT_S);		
		}    	    	    
	}
	else{
		if (pagina.isBrowse){
			pagina.testo = pagina.testo.replaceAll('$INIT$','');				
		}else{
			pagina.testo = pagina.testo.replaceAll('$INIT_S$','');		
		}    	    	    	    
	}
	
	
	if($('#chkINIT_COMPLETE').prop('checked') == true){
		pagina.testo = pagina.testo.replaceAll('$INITCOMPLETE$',testoINITCOMPLETE);					
		//verifico qui se spuntati i btn IME
		let ime = '';
		if($('#chkIME_I').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$IME_I$',testoIME_I);						
			ime += 'I';
		}else{
			pagina.testo = pagina.testo.replaceAll('$IME_I$','');						
		}
		if($('#chkIME_M').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$IME_M$',testoIME_M);
			 
			ime += 'M';
		}else{
			pagina.testo = pagina.testo.replaceAll('$IME_M$','');						
		}
		if($('#chkIME_E').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$IME_E$',testoIME_E);
			ime += 'E';
		}else{
			pagina.testo = pagina.testo.replaceAll('$IME_E$','');						
		}
		pagina.testo = pagina.testo.replaceAll('$IME$',ime);	

		//Ciclo tutti i campi con F2 creati: per ognuno aggiungo una rigaSelezionata
		let paramF2 = '';
		if ($('#txtNumeroFiltri').val() > 0){
			for(let k = 1; k<= $('#txtNumeroFiltri').val(); ++k){							
				if ($('#cmbTipo_'+k).val() == 4){
					//se campo con F2
					paramF2 += testoF2Param.replace('$ID$', 'txt'+ $('#txtId_'+k).val()) + '\n'								
				}							
			}
			pagina.testo = pagina.testo.replaceAll('$testoF2Param$',paramF2);	
		}else{			
			pagina.testo = pagina.testo.replaceAll('$testoF2Param$','');	
		}
			
	}
	else{
			pagina.testo = pagina.testo.replaceAll('$INITCOMPLETE$','');	    
	} 
			
	if($('#chkLOAD').prop('checked') == true){			
		if (pagina.isBrowse){			
		pagina.testo = pagina.testo.replaceAll('$LOADEVENT$',testoLOADEVENT);
		}
		else{
			pagina.testo = pagina.testo.replaceAll('$LOADEVENT$',testoLOADEVENT_SCREEN);
		}
	}
	else{
			pagina.testo = pagina.testo.replaceAll('$LOADEVENT$','');     	    
	} 
	
	if($('#chkPRE_RENDER').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$PRERENDER$',testoPRERENDER);		    	    	    	    	    	    
	}
	else{
			pagina.testo = pagina.testo.replaceAll('$PRERENDER$','');    	    
	}
	
}

function GestioneSpunteAltre(pagina){
	if($('#chkF2').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_1$',Gr1);
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_2$',Gr2);
			if (pagina.isBrowse){
				pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_3$',Gr3_BROWSE);
			}else{
				pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_3$',Gr3_SCREEN);
			}
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_4$',Gr4);	    	    	    	    	    
	}
	else{
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_1$','');
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_2$','');
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_3$','');
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_4$','');	        	    
	}
	if($('#chkWEBMETHOD').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$WEBMETHOD$',WM);	    									
	}
	else{
			pagina.testo = pagina.testo.replaceAll('$WEBMETHOD$','');	    
	}
	
	if($('#chkAutorizzazioni').prop('checked') == true){
		pagina.testo = pagina.testo.replaceAll('$AUTORIZZAZIONI_1$',autorizzazioni_1);
		pagina.testo = pagina.testo.replaceAll('$AUTORIZZAZIONI_2$',autorizzazioni_2);					
	}
	else{
		pagina.testo = pagina.testo.replaceAll('$AUTORIZZAZIONI_1$','');
		pagina.testo = pagina.testo.replaceAll('$AUTORIZZAZIONI_2$','');  
	}
	
}

function GestioneTasche(pagina){
	//se Browse NON ho tasche
	if(pagina.isBrowse){	  
		pagina.testo = pagina.testo.replaceAll('$TASCHE_1$','');	    
		pagina.testo = pagina.testo.replaceAll('$WMSETTAB$','');							
		pagina.testo = pagina.testo.replaceAll('$TASCHE_2$','');
		pagina.testo = pagina.testo.replaceAll('$TASCHE_4$','');
		pagina.testo = pagina.testo.replaceAll('$METODITASCHE$','');
	}else{
		//se Screen Popolo i campi tasche
		if($('#chkTASCHE').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$TASCHE_1$',TASCHE_1);
			pagina.testo = pagina.testo.replaceAll('$TASCHE_2$',TASCHE_2);
			pagina.testo = pagina.testo.replaceAll('$TASCHE_4$',TASCHE_4);								
			pagina.testo = pagina.testo.replaceAll('$WMSETTAB$',WMSETTAB);						
			let nTasche = $('#txtNumTasche').val();
			let aux1 = '';
			let aux2 = '';
			let aux2bis = '';
			aux3='';
			for(let i = 0; i< nTasche; ++i){									
				let id = 'txtNomeTasca' + i;
				aux1 += `\nCase "tab` + document.getElementById(id).value + `"\n`
				aux1 += `strScript = "$('#myTab li:eq(${i}) a').tab('show');"\n`
				aux1 += `strScript += "$('#link-collapse-tab` + $('#'+id).val().substring(0,1).toUpperCase() + $('#'+id).val().substring(1) + `').click();"'\n`

				aux2 += `\nCase "tab` + $('#'+id).val().substring(0,1).toUpperCase() + $('#'+id).val().substring(1) + `'"\n`;
				
				let x='', y='';
				for (let j = 0; j< nTasche; ++j){									
					if(i!=j){										
						id = 'txtNomeTasca' + j;
						aux2+= `strScript += "$('#btnTab` + $('#'+id).val().substring(0,1).toUpperCase() + $('#'+id).val().substring(1) + `').css('display', 'none');"\n`;
						aux2bis+= `strScript += "$('#link-collapse-tab` + $('#'+id).val().substring(0,1).toUpperCase() + $('#'+id).val().substring(1) + `').parent().parent().parent().css('display', 'none');"\n`;
					}										
				}									
				aux2 += aux2bis;
				aux3 += aux2;
				aux2 = '';
				aux2bis='';								
			}	
			aux1 += `Case Else\n`
			aux1 += `'di default apre la prima tasca\n `
			aux1 += `strScript = "$('#myTab li:eq(0) a').tab('show');"\n`
			aux1 += `strScript += "$('#link-collapse-tab` + document.getElementById("txtNomeTasca0").value + `').click();"'\n`

			pagina.testo = pagina.testo.replaceAll('$TASCHE_3$',aux1);
			pagina.testo = pagina.testo.replaceAll('$TASCHE_5$',aux3);
			
			pagina.testo = pagina.testo.replaceAll('$METODITASCHE$',METODITASCHE);
			//gestione html
			
			TASCHESCRIPT = TASCHESCRIPT.replaceAll('$PAGINA$',$('#txtPagina').val());					
			TASCHESCRIPT = TASCHESCRIPT.replaceAll('#SIGLAFORM$','_S');
			$('#txtpagina.testoScriptTasche').val(TASCHESCRIPT);
			let htmlaux1 = '<ul class="nav nav-tabs responsive" id="myTab">\n';							
			let htmlaux2 = '';
			
			for(let i = 0; i< $('#txtNumTasche').val(); ++i){	
				let nome = document.getElementById("txtNomeTasca"+i).value;
				htmlaux1 += `<li><a id="btnTab` + nome +`" href="#tab` + nome +`" onclick="ClickTab('tab` + nome + `');">`  + nome +` </a></li>\n`;
				
				if(i==1){
					htmlaux2 += `<div class="tab-content responsive">
									<div class="tab-pane active" id="tab${nome}" style="margin-left:5px; margin-right:5px;">
													
									</div>
								 </div>`;
				}else{
					htmlaux2 += `<div class="tab-pane" id="tab${nome}" style="margin-left:5px; margin-right:5px;">
								
								 </div>`;																				
				}
			}
			htmlaux1 += '</ul>\n';
			
			$('#txtpagina.testoHtmlTasche').val(htmlaux1 +'\n'+ htmlaux2);
			$('.tasche').removeClass('hidden');
		}else{
			pagina.testo = pagina.testo.replaceAll('$METODITASCHE$','');
		}
	}
	
}

function GestioneBrowse(pagina){
	
	if(pagina.isBrowse){		
		pagina.testo = pagina.testo.replaceAll('$SUBPRIVATE$', testoFILTRI);
		if($('#chkBTNELIMINA').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$BUTTONELIMINA$',Elim);	    	    	    
		}else{
			pagina.testo = pagina.testo.replaceAll('$BUTTONELIMINA$','');
		}
		if($('#chkFiltroAll').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$FILTROALL$',pagina.testoFiltroAll);	    	    	    	    	    
		}else{			
			pagina.testo = pagina.testo.replaceAll('$FILTROALL$','');	
		}		 
	}else{
		pagina.testo = pagina.testo.replaceAll('$SUBPRIVATE$', '');
		pagina.testo = pagina.testo.replaceAll('$BUTTONELIMINA$','');
		pagina.testo = pagina.testo.replaceAll('$FILTROALL$','');		
	}	
}

function GestionePagine(pagina){
	if ($('#chkWebUI').prop('checked')){
		pagina.testo = pagina.testo.replaceAll('$PROGETTO$',$('#txtProgetto').val() +'.Web.UI');
	}else{
		pagina.testo = pagina.testo.replaceAll('$PROGETTO$',$('#txtProgetto').val());					
	}
	
	if($('#chkCnnMaster').prop('checked')){
		pagina.testo = pagina.testo.replace("$CnnMaster$", "Master")
	}else{
		pagina.testo = pagina.testo.replace("$CnnMaster$", "")
	}
	
	pagina.testo = pagina.testo.replaceAll('$CLASSE$',$('#txtClasse').val());
	pagina.testo = pagina.testo.replaceAll('$PAGINA$',$('#txtPagina').val());
	pagina.testo = pagina.testo.replaceAll('$SIGLA$',$('#txtSigla').val());
	if (pagina.isBrowse){
		pagina.testo = pagina.testo.replaceAll('#SIGLAFORM$','_B');
	}else{
		//IS Screen
		pagina.testo = pagina.testo.replaceAll('$AFTERRUPDATE$',testoAFTERUPDATE);
		if($('#chkVisUnderscore').prop('checked', true)){		
			pagina.testo = pagina.testo.replaceAll('#SIGLAFORM$','_S');			
		}else{
			pagina.testo = pagina.testo.replaceAll('#SIGLAFORM$','');
		}
		
	}
}

function GestioneHamburger(pagina){
	if(pagina.isBrowse && $('#chkHamburger').prop('checked') == true){
		pagina.testo = pagina.testo.replaceAll('$Ham_1$',Ham_1);	    
		let Ham_2 = '';
		let glyphicon = ''
		
		let aux_1 = '', aux_2 = '', aux_3 = '', aux_FCODE = '';
		for(let i = 0; i< $('.btnHamburger').length; ++i){
			glyphicon = $('#spanGlyphicon_' + i).attr('class');
		
			// m_oBrowse.AddImgButtonGrigliaWeb("btnF11Stampa", "Stampa", System.Windows.Forms.Keys.F11)
			Ham_2 += 'm_oBrowse.AddImgButtonGrigliaWeb("btn' + $('.btnHamburger')[i].innerHTML  +'", "' +$('.btnHamburger')[i].innerHTML.substring(6) +'", System.Windows.Forms.Keys.' + $('.btnHamburger')[i].innerHTML.substring(0,6) + ') \n'	    	    	    	    	    
																							
			//oTemplate.AddButton("btnStampa", "btn btn-default", "<span class=""glyphicon glyphicon-print""></span>", , , "Stampa segnalazione")
			aux_1 += 'oTemplate.AddButton("btn' + $('.btnHamburger')[i].innerHTML.substring(6) + '", "btn btn-default", "<span class="' +glyphicon+ '"></span>", , , "' + $('.btnHamburger')[i].innerHTML.substring(6) + '")\n'
			
			//sScript += "$('#" & item.FindControl("btnStampa").ClientID & "').click(function() { ShowLoading();$('#" & item.FindControl("btnF11Stampa").ClientID & "').click();return false; });"
			aux_2 += 'sScript += "$(\'#" & item.FindControl("' + $('.btnHamburger')[i].innerHTML.substring(4) +'").ClientID & "\').click(function() { ShowLoading();$(\'#" & item.FindControl("' + $('.btnHamburger')[i].innerHTML  + '").ClientID & "\').click();return false; });" \n'
			
			/*grdGriglia.Columns(grdGriglia.Columns.Count - 2).HeaderStyle.CssClass = "nascosto"
			grdGriglia.Columns(grdGriglia.Columns.Count - 2).ItemStyle.CssClass = "nascosto"
			grdGriglia.Columns(grdGriglia.Columns.Count - 2).Display = False*/
			let k = i+2;
			aux_3 += 'grdGriglia.Columns(grdGriglia.Columns.Count - ' + k + ').HeaderStyle.CssClass = "nascosto"\n';
			aux_3 += 'grdGriglia.Columns(grdGriglia.Columns.Count - ' + k + ').ItemStyle.CssClass = "nascosto"\n';
			aux_3 += 'grdGriglia.Columns(grdGriglia.Columns.Count - ' + k + ').Display = False\n';
			
			//FCODE
			let j = i+1;
			aux_FCODE += 'Case System.Windows.Forms.Keys.F1' + j + '\n\n'
		}
		pagina.testo = pagina.testo.replaceAll('$Ham_Bottoni$',Ham_2);	    
		Ham_3 = Ham_3.replace("$Ham_Riga_1$", aux_1)	    	    	    	    	    
		Ham_3 = Ham_3.replace("$Ham_Riga_2$", aux_2)	    	    	    	    
		Ham_3 = Ham_3.replace("$Ham_Riga_3$", aux_3)	    
		pagina.testo = pagina.testo.replaceAll('$Ham_3$',Ham_3);	    
		pagina.testo = pagina.testo.replaceAll('$HAM_FCODE$',aux_FCODE);	    	    	    	    	    
	}
	else{
		pagina.testo = pagina.testo.replaceAll('$Ham_1$','');	    
		pagina.testo = pagina.testo.replaceAll('$Ham_3$','');	    
		pagina.testo = pagina.testo.replaceAll('$Ham_Bottoni$','');	    	    
		pagina.testo = pagina.testo.replaceAll('$HAM_FCODE$','');	    	    	    	    	    
	}		
}

function GestioneImports(pagina){
	let imports = '';
	for (let i = 0; i<=4; ++i){
		if(arrBoolImport[i] == 1){
			imports += arrValoriImport[i] + '\n';
		}				
	}	 
	pagina.testo = pagina.testo.replaceAll('$IMPORTS$',imports);
}

function GestioneFiltri(pagina){
	if($('#txtNumeroFiltri').val()!=''){
		if ($('#txtCreaFiltro').val()) pagina.testo = pagina.testo.replaceAll('$CREAFILTRO$',$('#txtCreaFiltro').val());
		if ($('#txtPropertyFiltri').val()) pagina.testo = pagina.testo.replaceAll('$PROPERTYFILTRI$',$('#txtPropertyFiltri').val());		
		if ($('#txtInizializzaFiltri').val()) pagina.testo = pagina.testo.replaceAll('$INIZIALIZZAFILTRI$',$('#txtInizializzaFiltri').val());	
		if ($('#txtSalvaFiltri').val()) pagina.testo = pagina.testo.replaceAll('$SALVAFILTRI$',$('#txtSalvaFiltri').val());	
		//click btnFiltra
		pagina.testo = pagina.testo.replaceAll('$btnFiltra$', testoFiltra);					
	}else{
		pagina.testo = pagina.testo.replaceAll('$CREAFILTRO$','');
		pagina.testo = pagina.testo.replaceAll('$PROPERTYFILTRI$','');		
		pagina.testo = pagina.testo.replaceAll('$INIZIALIZZAFILTRI$','');	
		pagina.testo = pagina.testo.replaceAll('$SALVAFILTRI$','');
		pagina.testo = pagina.testo.replaceAll('$btnFiltra$','');
	}
}

function GestioneScreen(pagina){
	
	if($('#chkScreenClassica').prop('checked') == true){
		pagina.testo = pagina.testo.replaceAll('$CLASSE_SCREEN$',$('#txtPagina').val() + '_S');	    	    	    
		}
	if ($('#chkScreenFD').prop('checked')){
		pagina.testo = pagina.testo.replaceAll('$CLASSE_SCREEN$','QQQ');
		pagina.testo = pagina.testo.replace('"QQQ"', '')				
		if(pagina.arrChiavi.length >0){
				ApriFD = ApriFD.replaceAll('$PAGINA$',$('#txtPagina').val());
		pagina.testo = pagina.testo.replaceAll('$ApriFD$', ApriFD)
		}else{
			pagina.testo = pagina.testo.replaceAll('$ApriFD$', '')
		}
	}else{
		pagina.testo = pagina.testo.replaceAll('$CLASSE_SCREEN$','QQQ');
		pagina.testo = pagina.testo.replace('"QQQ"', '')	
		pagina.testo = pagina.testo.replaceAll('$ApriFD$', '')				
	}
	
	if($('#chkScreenClassica').prop('checked') == true){
	if($('#chkIsFormDialog').prop('checked') == true){
		pagina.testo = pagina.testo.replace('$ChiudiFD$', ChiudiFD)
	}else{
		pagina.testo = pagina.testo.replace('$ChiudiFD$', '')
	}
		
	}else{
		pagina.testo = pagina.testo.replace('$ChiudiFD$', '')
	}
	
}
	
function checkPagina(){
	
	let Regex = new RegExp('\_S', 'gi')	
	if (Regex.test($('#txtPagina').val())){
		let a = $('#txtPagina').val().replace(Regex, '')
		$('#txtPagina').val(a)
	}
	
	Regex = new RegExp('\_B', 'gi')	
	if (Regex.test($('#txtPagina').val())){
		let a = $('#txtPagina').val().replace(Regex, '')
		$('#txtPagina').val(a)
	}
}		

function checkClasse(){
	
	let Regex = new RegExp('^c[A-Z]', 'g')	
	if (Regex.test($('#txtClasse').val())){
		let a = $('#txtClasse').substring(1)
		$('#txtClasse').val(a)
	}

}

function GetPagevalueFromChiavi(Chiavi){
	let pv = '';
	Chiavi.forEach(chiave => pv += `op.Scrivi("${chiave}", m_oBrowse.GetRigaSelezionata.Leggi("${chiave}"))\n`)
	
	return pv;
}

function chkscreen(a){
	if (a.id == 'chkScreenFD'){
		$('#chkScreenClassica').prop('checked', '')
	} else if(a.id == 'chkScreenClassica'){
		$('#chkScreenFD').prop('checked', '')
	}
}

/************************************* Variabili *****************************************************/
const arrValoriImport = ['Imports CBO','Imports CboUtil.BO','Imports CboUtil.Data','Imports CBO.Web.UI', 'Imports Telerik.Web.UI'];
var arrBoolImport;
let Chiavi = [];
var WM = `
	#Region "WebServices"   
	<System.Web.Services.WebMethod()> _ 
	Public Shared Function WEB_METHOD(ByVal codice As String) As String
      Return ""
	End Function
	
	$WMSETTAB$
	
	#End Region`
	    
var Gr1 = `
	Private Property m_F2Grafica As cF2Grafica  
		Get
			 Return CType(PageValue("m_F2Grafica"), cF2Grafica)
		  End Get
	  Set(value As cF2Grafica)
		  PageValue("m_F2Grafica") = value
		End Set
	End Property
	`
	    
var Gr2 =`m_F2Grafica = New cF2Grafica`
	    
var Gr3_BROWSE =`m_oBrowse.F2GraficaWeb = m_F2Grafica`
var Gr3_SCREEN =`m_oScreen.F2GraficaWeb = m_F2Grafica`	    

var Gr4 = `Private Sub m_oScreen_F2CODE(ByRef control As Object, ByVal rigaSelezionata As CboUtil.BO.cProprieta) Handles m_oScreen.F2CODE
			   If control.name = "txt" Then
			  End If
			End Sub
						
			Private Sub m_oScreen_XCP(nomeControllo As String, ByRef erd As Boolean) Handles m_oScreen.XCP
				If nomeControllo = "" Then
				End if
			End Sub
			`
	    
var Elim = `m_oBrowse.ImgButtonEliminaWeb = "~/Images/btnElimina.png"
m_oBrowse.BtnEliminaInizioRigaWeb = True`

const CONSTBrowseTesto= `$IMPORTS$

Public Class $PAGINA$#SIGLAFORM$
    Inherits $PROGETTO$.Page

#Region "Property"
    Private Property m_$CLASSE$ As c$CLASSE$
        Get
            Return CType(PageValue("m_$CLASSE$"), c$CLASSE$)
        End Get
        Set(value As c$CLASSE$)
            PageValue("m_$CLASSE$") = value
        End Set
    End Property
	
    Private Property m_WinDef As cWinDef
        Get
            Return CType(PageValue("m_WinDef"), cWinDef)
        End Get
        Set(value As cWinDef)
            PageValue("m_WinDef") = value
        End Set
    End Property
	
	$F2GRAFICA_1$			
	$PROPERTYFILTRI$
#End Region
$Ham_1$

#Region "Eventi Page"
	    $PREINIT$
    
	    $INIT$
    
	    $INITCOMPLETE$

	    $LOADEVENT$

	    $PRERENDER$
    
#End Region

#Region "Browse"
    $FCODE$

	    $F2GRAFICA_4$
#End Region

#Region "Sub Private"
$btnFiltra$
$Ham_3$
$SUBPRIVATE$
#End Region 

$WEBMETHOD$
End Class
`;

let testoFCODE = `Private Sub m_oBrowse_FCODE(ByRef KeyPress As Integer, ByRef Shift As Integer) Handles m_oBrowse.FCODE
        Select Case KeyPress
            Case System.Windows.Forms.Keys.F5                              
				$ApriFD$
            Case System.Windows.Forms.Keys.F7
                	    	    	    
            Case System.Windows.Forms.Keys.F10
                RiempiGriglia()
				$HAM_FCODE$
        End Select
    End Sub	    `;
	    
let testoPREINIT = `Private Sub $PAGINA$#SIGLAFORM$_PreInit(sender As Object, e As EventArgs) Handles Me.PreInit
        If Not IsPostBack Then
            $AUTORIZZAZIONI_1$
        End If
    End Sub	    	    `;
	    
let autorizzazioni_1 = `If Autorizzazioni IsNot Nothing AndAlso Autorizzazioni.ErroreApriForm Then
                Dim oMsg As New cMsg(Me, "Non si dispone delle autorizzazioni necessarie per proseguire")
                oMsg.Show()
                Autorizzazioni = Nothing
            End If

            Autorizzazioni = New cAutorizzazioni(CType(Master, Object).FormEvento(Path))
            Autorizzazioni.CaricaAutorizzazioni()`		
		
let testoINITCOMPLETE = ` Private Sub $PAGINA$#SIGLAFORM$_InitComplete(sender As Object, e As EventArgs) Handles Me.InitComplete
        Dim btn As CBO.Web.UI.WebControls.Button

        btn = ControlFinder.PageFindControl(Me, "btnEsci")
        If Not btn Is Nothing Then btn.Attributes.Add("style", "display:none")

        $IME_I$
		$IME_M$
		$IME_E$
		
		$testoF2Param$

    End Sub`
	
let testoIME_I = `btn = ControlFinder.PageFindControl(Me, "btnInserisci")
        If Not btn Is Nothing Then
            btn.Attributes.Add("style", "display: none")            
        End If`	
let testoIME_M = `btn = ControlFinder.PageFindControl(Me, "btnModifica")
        If Not btn Is Nothing Then
            btn.Attributes.Add("style", "display: none")            
        End If`	
let testoIME_E = `btn = ControlFinder.PageFindControl(Me, "btnElimina")
        If Not btn Is Nothing Then
            btn.Attributes.Add("style", "display: none")            
        End If`	

let testoF2Param = `$ID$.F2Param = "<CBOPAGESIZE>10</CBOPAGESIZE><ALLOWSORTING>1</ALLOWSORTING><ORDER></ORDER><VALUE>" & dbMaster & "</VALUE>"`		

let testoINIT = `Private Sub $PAGINA$#SIGLAFORM$_Init(sender As Object, e As EventArgs) Handles Me.Init
        If Not IsPostBack Then
            $AUTORIZZAZIONI_2$

            m_$CLASSE$ = New c$CLASSE$
            m_$CLASSE$.IClassi_sSql = "$ICLASSISSQL$"

            m_WinDef = New cWinDef(IWinDef.enuAppPlatform.Web)
			$F2GRAFICA_2$	     
            RiempiGriglia()
        End If

        m_oBrowse = New CBO.CBrowse(CBO.enuAppPlatform.Web)
        m_oBrowse.WinDef = m_WinDef
        $F2GRAFICA_3$ 
        $BUTTONELIMINA$        
		$FILTROALL$
		$Ham_Bottoni$
        m_oBrowse.Init(m_$CLASSE$, Connessione$CnnMaster$, Me, "$SIGLA$", "$CLASSE_SCREEN$", "$IME$")

    End Sub`

let testoLOADEVENT = `    Private Sub $PAGINA$#SIGLAFORM$_Load(sender As Object, e As EventArgs) Handles Me.Load
        'il button conferma, anche se non visibile va abilitato per i filtri
        Dim ctl As CBO.Web.UI.WebControls.Button = ControlFinder.PageFindControl(Me, "btnConferma")
        If Not ctl Is Nothing Then ctl.Enabled = True
    End Sub`
	
let testoLOADEVENT_SCREEN = `    Private Sub $PAGINA$#SIGLAFORM$_Load(sender As Object, e As EventArgs) Handles Me.Load
	Dim btn As CBO.Web.UI.WebControls.Button

	btn = ControlFinder.PageFindControl(Me, "btnEsci")
	If Not btn Is Nothing Then btn.Attributes.Add("style", "display: none")
	btnAnnulla.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"

	btn = ControlFinder.PageFindControl(Me, "btnConferma")
	If Not btn Is Nothing Then
		btn.Attributes.Add("style", "display: none")
		btnOk.OnClientClick = "$('#" & btn.ClientID & "').click();return false;"
	End If
End Sub`

let testoPRERENDER = `Private Sub $PAGINA$#SIGLAFORM$_PreRender(sender As Object, e As EventArgs) Handles Me.PreRender
       
	   $METODITASCHE$

    End Sub`
///DACANC
let testoSUBPRIVATE = `Private Sub RiempiGriglia()
        Dim strFiltro As String = ""

        If Not IsPostBack Then InizializzaFiltri()
        SalvaFiltri()

        Dim opTag As New cProprieta
        opTag.Scrivi("", Tag)
        opTag.Scrivi("DbMaster", ConnessioneMaster.Connection.Database)
        opTag.Scrivi("Filtro", CreaFiltro) 
        Tag = opTag.Leggi
    End Sub

    Private Function CreaFiltro() As String
        Dim sReturn As String = ""

        sReturn += " 1=1 "
	    	    
	    $CREAFILTRO$

        Return sReturn
    End Function

    Private Sub InizializzaFiltri()
       $INIZIALIZZAFILTRI$
        
    End Sub

    Private Sub SalvaFiltri()
        $SALVAFILTRI$
       
    End Sub`
//NUOVO	
let testoFILTRI = `Private Sub RiempiGriglia()
        Dim strFiltro As String = ""

        If Not IsPostBack Then InizializzaFiltri()
        SalvaFiltri()

        Dim opTag As New cProprieta
        opTag.Scrivi("", Tag)
        opTag.Scrivi("DbMaster", ConnessioneMaster.Connection.Database)
        opTag.Scrivi("Filtro", CreaFiltro) 
        Tag = opTag.Leggi
    End Sub

    Private Function CreaFiltro() As String
        Dim sReturn As String = ""

        sReturn += " 1=1"
	    	    
	    $CREAFILTRO$

        Return sReturn
    End Function

    Private Sub InizializzaFiltri()
       $INIZIALIZZAFILTRI$
        
    End Sub

    Private Sub SalvaFiltri()
        $SALVAFILTRI$
       
    End Sub`
	    
//////parte screen
const CONSTScreenTesto= `$IMPORTS$

Public Class $PAGINA$#SIGLAFORM$
    Inherits $PROGETTO$.Page

#Region "Property"

    Private Property m_$CLASSE$ As c$CLASSE$
        Get
            Return CType(PageValue("m_$CLASSE$"), c$CLASSE$)
        End Get
        Set(value As c$CLASSE$)
            PageValue("m_$CLASSE$") = value
        End Set
    End Property
$F2GRAFICA_1$
$TASCHE_1$	    
#End Region

#Region "Eventi Page"
	    $PREINIT$
    
	    $INIT_S$
    
	    $INITCOMPLETE$

	    $LOADEVENT$ 

	    $PRERENDER$ 	    
#End Region

#Region "Eventi Screen"
	    $FCODE_S$
	    
	    $AFTERRUPDATE$
		
		$TASCHE_2$
		
		$TASCHE_4$
#End Region	    

$WEBMETHOD$

End Class
`;

let autorizzazioni_2 = `'verifica autorizzazione apertura
            If Not Autorizzazioni.ApriForm Then
                Autorizzazioni.ErroreApriForm = True
                Response.Redirect(Request.ServerVariables("HTTP_REFERER"))
            End If`

let testoINIT_S =`Private Sub $PAGINA$_S_Init(sender As Object, e As EventArgs) Handles Me.Init
        If Not IsPostBack Then
            $AUTORIZZAZIONI_2$

            m_$CLASSE$ = New c$CLASSE$
            m_$CLASSE$.IClassi_sSql = "$ICLASSISSQL$"        

            $F2GRAFICA_2$           
        End If

        m_oScreen = New CBO.CScreen(CBO.enuAppPlatform.Web)        
	    	    $F2GRAFICA_3$ 
        m_oScreen.Init(Connessione$CnnMaster$, m_$CLASSE$, Me, "$SIGLA$", "$IME$")     
    End Sub `


let testoFCODE_S =`Private Sub m_oScreen_FCODE(ByRef keyPress As Integer, ByRef shift As Integer) Handles m_oScreen.FCODE
        Select Case keyPress
            Case System.Windows.Forms.Keys.F10
                
        End Select
    End Sub`

let testoAFTERUPDATE =`Private Sub m_oScreen_AfterUPDATE(ByRef p_Dati As cProprieta) Handles m_oScreen.AfterUPDATE        
	$ChiudiFD$

    End Sub`
	    
let testoFiltroAll = `CBO.Web.Bootstrap.cGridFilterAll.AbilitaFiltroAll(grdGriglia, Telerik.Web.UI.GridCommandItemDisplay.Top, CBO.Web.Bootstrap.cGridFilterAll.enuEspandiFiltro.Espandi)`

let Ham_1 = ` Dim oTemplate As CBO.Web.Bootstrap.cGridMenuButton`

let Ham_Bottoni = ``

let Ham_3 = `
    Private Sub grdGriglia_PreRender(sender As Object, e As EventArgs) Handles grdGriglia.PreRender
        oTemplate = New CBO.Web.Bootstrap.cGridMenuButton
        oTemplate.ButtonPerRiga = 3
        oTemplate.HorizontalOpen = CBO.Web.Bootstrap.cGridMenuButton.enuHorizontalOpen.Right
	    	    $Ham_Riga_1$

        Dim templateColumn As New GridTemplateColumn()
        templateColumn.UniqueName = "btnMenuGrid"
        templateColumn.ItemTemplate = oTemplate
        templateColumn.ItemStyle.HorizontalAlign = HorizontalAlign.Center
        templateColumn.AllowFiltering = False
        templateColumn.HeaderText = ""
        grdGriglia.Columns.Add(templateColumn)
        grdGriglia.DataBind()

        Dim sScript As String = ""
        For Each item As GridDataItem In grdGriglia.Items
	    	    	    $Ham_Riga_2$        
        Next
        ScriptPagina += sScript

	    	    $Ham_Riga_3$
    End Sub		
	    `
	    
let TASCHE_1 = `    Private Shared Property m_TabSelezionato As String
        Get
            Return cFunzioni.Nz(PageValue("m_TabSelezionato"), "")
        End Get
        Set(value As String)
            PageValue("m_TabSelezionato") = value
        End Set
    End Property
	`

let TASCHE_2 = ` 
Private Sub GestioneTab()
        Dim strScript As String = ""
        Select Case hidTabSelezionato.Text
			$TASCHE_3$            
        End Select

        If strScript <> "" Then
            pScriptTab.Controls.Add(New LiteralControl("<script type=""text/javascript"">"))
            pScriptTab.Controls.Add(New LiteralControl("$(function () {"))
            pScriptTab.Controls.Add(New LiteralControl(strScript))
            pScriptTab.Controls.Add(New LiteralControl("});"))
            pScriptTab.Controls.Add(New LiteralControl("</script>"))
        End If
    End Sub
`	

let TASCHE_4 = ` 
Private Sub GestioneScriptTab()
        Dim strScript As String = ""
               
                Select Case hidTabSelezionato.Text
				$TASCHE_5$                                  
                End Select

        If strScript <> "" Then
            pScriptTab.Controls.Add(New LiteralControl("<script type=""text/javascript"">"))
            pScriptTab.Controls.Add(New LiteralControl("$(function () {"))
            pScriptTab.Controls.Add(New LiteralControl(strScript))
            pScriptTab.Controls.Add(New LiteralControl("});"))
            pScriptTab.Controls.Add(New LiteralControl("</script>"))
        End If
    End Sub
`
let WMSETTAB = ` 
    <System.Web.Services.WebMethod()> _
    Public Shared Function SetTab(ByVal tab As String) As String
        m_TabSelezionato = tab
        Return ""
    End Function
`		

let TASCHESCRIPT = `
    <script src="Scripts/responsive-tabs.js"></script>    
    <script type="text/javascript">
        $('ul.nav.nav-tabs  a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');                      
        });

        function ClickTab(tab) {                         
            eseguiPageMethod('$PAGINA$#SIGLAFORM$.aspx', 'SetTab', '{ "tab" : "' + tab + '" }');                       
        }

        (function ($) {
            fakewaffle.responsiveTabs(['xs', 'sm']);
        })(jQuery);
    </script> 
    <cbo:PlaceHolder ID="pScriptTab" runat="server"></cbo:PlaceHolder>
	<asp:TextBox ID="hidTabSelezionato" runat="server" style="display:none"></asp:TextBox>
`
	    	    	    	  
let METODITASCHE = `GestioneTab()
GestioneScriptTab()`							  
		
/*				
		||||||| ||      ||||||| ||||||| ||||||| |||||||
		||   || ||      ||   || ||   || ||   || ||   ||
		||   || ||      ||   || ||||||| ||||||| |||||||
		||   || ||      ||   || ||   || ||      ||
		||||||| ||||||| ||||||| ||   || ||      ||		
*/
		

let ApriFD = `
	RemovePageValue("~/FormDialog/$PAGINA$_S.aspx")
	Dim op As New cProprieta
	op.Scrivi("Browse", "Mod")
	${GetPagevalueFromChiavi(Chiavi)}
	Dim pv As New PageValueType
	pv.Add("m_Tag", op.Leggi)
		
	AddFuturePageValue("~/FormDialog/$PAGINA$_S.aspx", pv)
	cWindowHelper.Create(Me, "~/FormDialog/$PAGINA$_S.aspx", "$find('ctl00_raLoadingPanel').show('contentBody'); document.forms[0].submit();", "80%,80%")						
`

const testoFiltra = `
    Private Sub btnFiltra_Click(sender As Object, e As EventArgs) Handles btnFiltra.Click
        grdGriglia.CurrentPageIndex = 0
        m_oBrowse.PremiButton(System.Windows.Forms.Keys.F10)
    End Sub`
	
	
const ChiudiFD = `ClientScript.RegisterStartupScript(Me.GetType, "close", "var wnd = GetRadWindow(); wnd.close();", True) `

const aspx_BROWSE = `<cbo:GridView ID="grdGriglia" runat="server" />
        
<cbo:PlaceHolder ID="cboButtons" runat="server"></cbo:PlaceHolder>`

const aspx_SCREEN = `<cbo:PlaceHolder ID="cboButtons" runat="server"></cbo:PlaceHolder>`
