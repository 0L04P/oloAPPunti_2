//NUOVA FUNZIONE
const arrValoriImport = ['Imports CBO','Imports CboUtil.BO','Imports CboUtil.Data','Imports CBO.Web.UI', 'Imports Telerik.Web.UI'];
var arrBoolImport;

function GeneraPagina(){
	if(!verificaDati()) {return false;}
	
	//compilo i campi con le property
	generaHTMLfiltri();
	//let testo = '';
	//pulisco le variabili 		
	if( $('#cmbDB').val()!='' && $('#cmbTabelle').val()!=''){
		GetIClassiSsql($('#cmbDB').val(), $('#cmbTabelle').val());				
	}
	//The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.
	//splitto in un array e cerco le chiavi racchiuse tra $
	Chiavi = $('#txtIClassiSsql').val().replaceAll("'", "").split("$").filter(word => !/\s/.test(word) && word.trim().length > 0)					
	
	//JS passa i valori ByVal, ma gli oggetti ByRef
	//creo un oggetto
	var pagina = {
		testo : "";	
		isBrowse:	$('#lblTipoForm').text().toUpperCase() == 'BROWSE';	
		isScreen : !$('#lblTipoForm').text().toUpperCase() == 'BROWSE';	
		arrChiavi : Chiavi;
	}
		
	//pulisco il testo!
	$('#txtTesto').val('');
		
	arrBoolImport = [1,1,1,1,1];
	//distinguo
	if (isBrowse){
		pagina.testo = CONSTBrowseTesto				
	}else{
		pagina.testo = CONSTScreenTesto	 	
	}
		
	GestionePagine(pagina);
	GestioneSpunteEventi(pagina);//chkFCODe, chkPREINIT, chkINIT
	GestioneSpunteAltre(pagina);
	
	//se non c'è stato errore nella api call, popolo l'ICLASSISSQL
	PopolaIClassi(pagina);
	
	GestioneTasche(pagina);
	GestioneBrowse(pagina); 
	GestioneHamburger(pagina);
	GestioneFiltri(pagina);
	GestioneImports(pagina);


			
	
	
	
	
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
		}
			
	}
	else{
			pagina.testo = pagina.testo.replaceAll('$INITCOMPLETE$','');	    
	} 
			
	if($('#chkLOAD').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$LOADEVENT$',testoLOADEVENT);	    	    	    	    	    	    
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
			pagina.testo = pagina.testo.replaceAll('$F2GRAFICA_3$',Gr3);
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
		}
	}
	
}

function GestioneBrowse(pagina){
	
	if(pagina.isBrowse){		
		pagina.testo = pagina.test.replaceAll('$SUBPRIVATE$', testoFILTRI);
		if($('#chkBTNELIMINA').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$BUTTONELIMINA$',Elim);	    	    	    
		}
		if($('#chkFiltroAll').prop('checked') == true){
			pagina.testo = pagina.testo.replaceAll('$FILTROALL$',pagina.testoFiltroAll);	    	    	    	    	    
		}else{
			pagina.testo = pagina.testo.replaceAll('$BUTTONELIMINA$','');
		}
		else{
			pagina.testo = pagina.testo.replaceAll('$FILTROALL$','');	    
		}
	}else{
		pagina.testo = pagina.test.replaceAll('$SUBPRIVATE$', '');
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
		testo = testo.replaceAll('$AFTERRUPDATE$',testoAFTERUPDATE);
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
		pagina.testo = pagina.testo.replaceAll('$btnFiltra$',pagina.testoFiltra);					
	}else{
		pagina.testo = pagina.testo.replaceAll('$CREAFILTRO$','');
		pagina.testo = pagina.testo.replaceAll('$PROPERTYFILTRI$','');		
		pagina.testo = pagina.testo.replaceAll('$INIZIALIZZAFILTRI$','');	
		pagina.testo = pagina.testo.replaceAll('$SALVAFILTRI$','');
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

