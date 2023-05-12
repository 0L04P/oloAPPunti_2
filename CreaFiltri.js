 function creaFiltri(num){
	let sHTML = '';
	
	for (let i = 1; i<=num; ++i){
	
		sHTML += `
		<div class='col-xs-12'>		
			<div class='col-xs-3'>
				<b>ID</b><br>
				<input type='text' id='txtId_${i}' style='background-color:#91ff00' oninput='formatta("txtId_${i}"); CopiaLive(${i})'></input>
			</div>
			<div class='col-xs-3'>
				<b>DATAFIELD</b><br>
				<input type='text' id='txtDataField_${i}' onchange='formatta("txtDataField_${i}")'></input>
			</div>
			<div class='col-xs-2'>
				<b>TIPO</b><br>		
				<select id="cmbTipo_${i}" class="form-control" style="padding-right: 0;    padding-left: 0;" onchange="nascondi(${i})">				  
				  <option value="2">TextBox</option>
				  <option value="3">TextBox Data</option>
				  <option value="4">TextBox con F2</option>
				  <option value="7">TextArea</option>
				  <option value="0">DropDownList</option>
				  <option value="1">RadComboBox</option>
				  <option value="5">CheckBox</option>
				  <option value="6">AspLabel</option>
				</select>				
			</div>
			<div class='col-xs-2'>				
				<input class="form-check-input" type="checkbox" style="margin-top:23px;" id="chkIsKey_${i}"></input>
				<label class="form-check-label" for="chkIsKey_${i}">
				IsKey
				</label>
			</div>
			<div class='col-xs-2 TipoDati_${i}'>
				<b>Tipo dati</b><br>		
				<select id="cmbTipoDati_${i}" class="form-control">				  
				  <option value="0"></option>
				  <option value="1">Testo</option>
				  <option value="2">Numero</option>				  
				</select>				
			</div>
			<div class='col-xs-12'></div>
			<div class='col-xs-3 divCmb_${i}' style='display:none'>
				<b>DATAVALUEFIELD</b><br>
				<input type='text' id='txtDataValueField_${i}'  onchange='formatta("txtDataValueField_${i}")'></input>
			</div>
			<div class='col-xs-3 divCmb_${i}'  style='display:none'>
				<b>DATATEXTFIELD</b><br>
				<input type='text' id='txtDataTextField_${i}'  onchange='formatta("txtDataTextField_${i}")'></input>
			</div>
			<div class='col-xs-3 ClasseCreaFiltro'>
				<b>Classe CSS</b><br>
				<input type='text' id='txtAltreClassi_${i}'></input>
			</div>			
			<div class='col-xs-3 ClasseCreaFiltro'>
				<br>				
				<div class="form-check">
				  <input class="form-check-input" type="checkbox" value="" id="chkCreaFiltro_${i}">
				  <label class="form-check-label" for="chkCreaFiltro_${i}">
					Crea filtro
				  </label>
				</div>
			</div>
			<div class='col-xs-12'></div>
			<div class='col-xs-1'>
				<svg height="20" width="20">
				  <circle cx="10" cy="10" r="8" stroke="black" stroke-width="0" fill="red" id='Cerchio_${i}' 
					onclick='cambiaColoreCerchio(${i} )'></circle>
				  <title>Spazio di 10px</title>
				</svg>
			</div>
			<div class='col-xs-11 RigaSpazio'></div>			
		</div>
	`
	}
	
	$('#divFiltri').append(sHTML)	
 	//Precompilo i campi classi
	for (let k = 1; k<=num;++k){
		PrecompilaClassiCSS(k,  $('#cmbTipo_'+k).val());
	}
 }
 
 function cambiaColoreCerchio(i){
	 //debugger;
	 let colore = $('#Cerchio_' + i).attr('fill');
	 if (colore == 'red'){		 
		 $('#Cerchio_' + i).attr('fill', 'yellow')
	 }else{		 
		 $('#Cerchio_' + i).attr('fill', 'red')
	 }
	 
 }
 
 
 function nascondi(i){ 
	 if($('#cmbTipo_' + i).val() != 0 && $('#cmbTipo_' + i).val() != 1){
		 //NON è DropDownList nè RadComboBox
			$('.divCmb_' + i).css('display', 'none');
			$('.divCmb_' + i + ' > input').val('');			
	 }
	 else{
		 $('.divCmb_' + i).css('display', 'block');		 
	 }	 	

	if($('#cmbTipo_' + i).val() == '2'){
		//TextBox generico
		$('.TipoDati_'+ i).css('display', 'block');
	}else{
		$('.TipoDati_'+ i).css('display', 'none');
	}
	
	//Precompilazione campo Classi CSS
	let selectedValue = $('#cmbTipo_'+i).val();
	PrecompilaClassiCSS(i, selectedValue);
	//Se F2 imposto la spunta
	if ($('#cmbTipo_' + i).val() == 4) {$('#chkF2').prop('checked', true)}
 }
 
 function PrecompilaClassiCSS(i, selectedValue){
	
	 switch(selectedValue){
		 case '0': //DropDownList
			$('#txtAltreClassi_'+ i).val('form-control ');
			break;
		 case '1'://RadComboBox
			$('#txtAltreClassi_'+ i).val('');
			break;
		 case '2'://TextBox
			$('#txtAltreClassi_'+ i).val('form-control ');
			break;
		 case '3'://TextBox Data
			$('#txtAltreClassi_'+ i).val('form-control ');
			break;
		 case '4'://TextBox con F2
			$('#txtAltreClassi_'+ i).val('form-control ');
			break;
		 case '5'://CheckBox
			$('#txtAltreClassi_'+ i).val('checkbox ');
			break;
		 case '6'://AspLabel
			$('#txtAltreClassi_'+ i).val('');
			break;
		 case '7'://TextArea
			$('#txtAltreClassi_'+ i).val('form-control ');
			break;
		 default: 
			break;		 
	 }
	 
 }
 
 function generaHTMLfiltri(){
	 
	 let isBrowse = $('#chkBROWSE').prop('checked');
	 
	 let filtri = ``
	 if (isBrowse) filtri += `<div class="row well">`
	 filtri += `<div class="row">`
	 
	 let JS = `$(document).ready(function(){
		 
	`;
	 
	let Property = '';
	let InizializzaFiltri = '';
	let SalvaFiltri = '';
	let CreaFiltro = '';
	 for(i=1; i<=$('#txtNumeroFiltri').val(); ++i){
		 let id= $('#txtId_'+i).val().trim();
		 let datafield= $('#txtDataField_'+i).val().trim();
		 let datatextfield= $('#txtDataTextField_'+i).val().trim();
		 let datavaluefield= $('#txtDataValueField_'+i).val().trim();
		 let iskey= $('#chkIsKey_'+i).prop('checked');
		 let classe= $('#txtAltreClassi_'+i).val();
		 
		 switch($('#cmbTipo_' + i).val()){			
			 case "0":
				filtri += generaDropDownList(id, datafield, datatextfield, datavaluefield, iskey, classe.trim());
				InizializzaFiltri += 'cmb' + id + '.SelectedValue = m_Filtro' + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = cmb' + id + '.SelectedValue \n';
				CreaFiltro += `
				If cmb${id}.SelectedValue <> "" Then
					sReturn += ""
				End If`	
				break;
			case "1":
				filtri += generaRadcombobox(id, datafield, datatextfield, datavaluefield, iskey, classe.trim());
				InizializzaFiltri += 'cmb' + id + '.SelectedValue = m_Filtro'  + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = cmb' + id + '.SelectedValue \n';
				CreaFiltro += `
				If cmb${id}.SelectedValue <> "" Then
					sReturn += ""
				End If`	
				break;
			case "2":
			//txt generico
				let tipoDati = $('#cmbTipoDati_' + id)
				filtri += generaTXT(id, datafield, datatextfield, datavaluefield,'','', iskey, classe.trim(), tipoDati);
				InizializzaFiltri += 'txt' + id + '.Text = m_Filtro' + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = txt' + id + '.Text \n';				
				CreaFiltro += `
				If txt${id}.Text <> "" Then
					sReturn += ""
				End If`					
				break;
			case "3":
			//txt data
				filtri += generaTXT(id, datafield, datatextfield, datavaluefield, 'true', 'false', iskey, classe.trim());
				InizializzaFiltri += 'txt' + id + '.Text = m_Filtro'  + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = txt' + id + '.Text \n';				
				CreaFiltro += `
				If txt${id}.Text <> "" Then
					sReturn += ""
				End If`		
				//js che distrugge i datepicker
				JS += `$('#ctl00_content_${id}').datepicker('destroy');\n$('#ctl00_content_${id}').datepicker();`
				break;
			case "4":
			//txt F2
				filtri += generaTXT(id, datafield, datatextfield, datavaluefield, 'false', 'true', iskey, classe.trim());
				InizializzaFiltri += 'txt' + id + '.Text = m_Filtro'  + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = txt' + id + '.Text \n';				
				CreaFiltro += `
				If txt${id}.Text <> "" Then
					sReturn += ""
				End If`					
				break;
			case "5":
				filtri += generaCHK(id, datafield, datatextfield, datavaluefield, iskey, classe.trim());
				InizializzaFiltri += 'chk' + id + '.Checked = m_Filtro'  + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = chk' + id + '.Checked \n';				
				CreaFiltro += `
				If chk${id}.Text <> "" Then
					sReturn += ""
				End If`					
				break;	
			case "6":	
			//asp:label
				filtri += generaAspLabel(id);				
				break;
			case "7":	
			//textarea
				let tipoDati2 = $('#cmbTipoDati_' + id)
				filtri += generaTXT(id, datafield, datatextfield, datavaluefield,'','', iskey, classe.trim(), tipoDati2, 'TextMode="MultiLine" Rows="5"');
				InizializzaFiltri += 'txt' + id + '.Text = m_Filtro' + id +'\n';
				SalvaFiltri += 'm_Filtro' + id + ' = txt' + id + '.Text \n';				
				CreaFiltro += `
				If txt${id}.Text <> "" Then
					sReturn += ""
				End If`					
				break;			
		 }	
		 //debugger;
		 if ($('#Cerchio_' + i).attr('fill') != 'red'){
			filtri += `
			<div class='col-xs-12' style='height:10px;'></div>
			`			 
		 }
			//creo la property			
			let sFiltro = $('#chkCreaFiltro_' + i).prop('checked') ? 'Filtro' : ''	
			if ($('#cmbTipo_' + i).val() != '5'){				
				Property += filtrobase.replaceAll('$Nome$', id).replaceAll('£Filtro£', sFiltro) + '\n';
			}else{
				Property += filtrobase.replaceAll('$Nome$', id).replaceAll('String', 'Boolean').replaceAll('Filtro', sFiltro) + '\n';
			}
			if(isBrowse){
				let Regex = new RegExp(`DataField=\"${datafield}\"`, 'gi') 
				filtri = filtri.replace(Regex, '')
			}
		
			
	 }
	 if (isBrowse) filtri += `<div class="col-xs-12 col-sm-6 col-md-3">
			<br/>
			<asp:LinkButton ID="btnFiltra" runat="server" CssClass="btn btn-primary" Width="110px"><span class="glyphicon glyphicon-refresh"></span>&nbsp;Aggiorna</asp:LinkButton>
		</div>`	
	 filtri += `
		</div>`
	 if (isBrowse) filtri += ` </div>`	
	 
	 JS += `		 
	 });`

	 $('#txtJSFiltri').val(JS);
	 
	 filtri = gestioneChkCreaFiltro(filtri)
	 
	 $('#txtHTMLFiltri').val(filtri);
	 $('#txtPropertyFiltri').val(Property);
	 $('#txtCreaFiltro').val(CreaFiltro);
	 $('#txtInizializzaFiltri').val(InizializzaFiltri);
	 $('#txtSalvaFiltri').val(SalvaFiltri);
	 let copyText = document.getElementById("txtHTMLFiltri");

	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	navigator.clipboard.writeText(copyText.value);
 }
	 
	 function generaJS(){
		let copyText = document.getElementById("txtJSFiltri");
		copyText.select();
		copyText.setSelectionRange(0, 99999); /* For mobile devices */
		navigator.clipboard.writeText(copyText.value);	
	 }
 
 function generaDropDownList(id, datafield, datatextfield, datavaluefield, iskey, classe){
	
	 let DropDownList = `
			<div class="col-xs-12 col-sm-6 col-md-3">
				<small>${SpezzaCaMel(id)}</small><br />
				<cbo:DropDownList ID="cmb${id}" runat="server" IsKey="${iskey}" Width="100%" TypeControl="ComboBox" TypeData="Text" CssClass="${classe}" DataTextField="${datatextfield}" DataValueField="${datavaluefield}" DataField="${datafield}"></cbo:DropDownList>  
			</div>`
return DropDownList;
 }
 
 function generaRadcombobox(id, datafield, datatextfield, datavaluefield, iskey, classe){
	 let radcombobox = `
			<div class="col-xs-12 col-sm-6 col-md-3">
				<small><asp:Label ID='' runat='server'>${SpezzaCaMel(id)}</asp:Label></small><br />
				<cbo:RadComboBox ID="cmb${id}" runat="server" Width="100%" LarghezzaColonne="0;500"   IsKey="${iskey}" TypeControl="ComboBox" TypeData="Text" DataTextField="${datatextfield}" DataValueField="${datavaluefield}" DataField="${datafield}"></cbo:RadComboBox>
			</div>
	 `
	 return radcombobox;
 }
 
 function generaTXT(id, datafield, datatextfield, datavaluefield, isData, isF2, iskey, classe, tipoDati = '', multiline = ''){
	 let txt = '';	 	
	 let tipo = '';
	 let altro = '';
	 switch(tipoDati){
		 case '':
		 tipo = '';
			break;
		 case '1':
		 tipo = 'Text';
		    break;
		 case '2':
		 tipo = 'Numeric';
		 altro = ' SeparatoreMigliaia = "true" '
			break;
		 
	 }
	 
	 if (isData == 'true'){	
		 tipo = 'Data';	 
		  txt = `
			<div class="col-xs-12 col-sm-6 col-md-3">
				<small><asp:Label ID='' runat='server'>${SpezzaCaMel(id)}</asp:Label></small><br />
				<div class="input-group add-on" style="width: 196px">
	 <cbo:TextBox ID="txt${id}" runat="server" TypeControl="TextBox" TypeData="${tipo}" ${altro} DataField="${datafield}" IsKey="${iskey}" CssClass="${classe}" CssClassDisable="cboTextBoxDisable" Width="100%" ${multiline}></cbo:TextBox>  
					<div class="input-group-btn">                            
						<asp:LinkButton ID="btn${id}" runat="server" CssClass="btn btn-default" OnClientClick="$('#ctl00_body_txt${id}').datepicker('show');return false;">
							<span class="glyphicon glyphicon-calendar"></span></asp:LinkButton>
					</div>
				</div>
			</div>`
		 
	 }
	 else if(isF2 == 'true'){
		  txt = `
			<div class="col col-xs-12 col-md-6 col-lg-4">
				<asp:UpdatePanel ID="p${id}" runat="server">
					<ContentTemplate>
						<small><asp:Label ID='' runat='server'>${SpezzaCaMel(id)}</asp:Label></small><br />                             
						<asp:Panel ID="pF2${id}" runat="server" CssClass="input-group add-on">
							<cbo:TextBox ID="txt${id}" runat="server" TypeControl="TextBox" TypeData="${tipo}" ${altro} DataField="${datafield}" IsKey="${iskey}" CssClass="${classe}" CssClassDisable="cboTextBoxDisable" XCPconPost="true" ></cbo:TextBox>             
							<div class="input-group-btn" style="width: 41px">                            
								<asp:LinkButton ID="btn${id}" runat="server" CssClass="btn btn-default" OnClientClick="$('#btnF2_txt${id}').click();return false;">
								<span class="glyphicon glyphicon-search"></span></asp:LinkButton>
							</div>   
						</asp:Panel> 
							<asp:Label ID="lbl${id}" runat="server"></asp:Label>   
						<br /><br />  
					</ContentTemplate>
					<Triggers>
						<asp:PostBackTrigger ControlID="btnF2_txt${id}" /> 
					</Triggers>
				</asp:UpdatePanel>                             
			</div>`		 
	 }else{		 
		 txt = `
			<div class="col-xs-12 col-sm-6 col-md-3">
				<small><asp:Label ID='' runat='server'>${SpezzaCaMel(id)}</asp:Label></small><br />
				<cbo:TextBox ID="txt${id}" runat="server" TypeControl="TextBox" TypeData="${tipo}" ${altro} DataField="${datafield}" IsKey="${iskey}" CssClass="${classe}" CssClassDisable="cboTextBoxDisable" width="100%"></cbo:TextBox>  
			</div>`		 		 
	 }
	 return txt;
 }
 
 function generaCHK(id, datafield, datatextfield, datavaluefield, iskey, classe){	 
	 let testo = SpezzaCaMel(id);
	 let chk = `	 	
			<div class="col-xs-12 col-sm-6 col-md-3">		
				<cbo:CheckBox ID="chk${id}" runat="server" TypeControl="CheckBox" TypeData="Numeric" IsKey="${iskey}" DataField="${datafield}" Text="${testo}" CssClass="${classe}"/>
			</div>`	 
	return chk;	 
 }
 
  function generaAspLabel(id){
	
	 let DropDownList = `
			<div class="col-xs-12 col-sm-6 col-md-3">
				<small><asp:Label ID='' runat='server'>${SpezzaCaMel(id)}</asp:Label></small><br />
				<asp:Label ID="lbl${id}" runat="server"></asp:Label>  
			</div>`
return DropDownList;
 }
 
 function formatta(id){
	 
	 $('#' + id).val($('#'+ id).val().substring(0,1).toUpperCase() + $('#' + id).val().substring(1))
	 
 }

function copiaproperty(){
	var copyText = document.getElementById("txtPropertyFiltri");

	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */

	navigator.clipboard.writeText(copyText.value);	
}
 
 var filtrobase = `
    Private Property m_£Filtro£$Nome$ As String
        Get
            Return CType(PageValue("m_Filtro$Nome$"), String)
        End Get
        Set(value As String)
            PageValue("m_Filtro$Nome$") = value
        End Set
    End Property
`	 
function gestioneChkCreaFiltro(sHTML){	
	if(sessionStorage.getItem('TipoForm') == 'BROWSE'){
		return sHTML.replaceAll('ClasseCreaFiltro','')
	}else{
		return sHTML.replaceAll('ClasseCreaFiltro','hidden')
	}
}

function CopiaLive(i){
	$('#txtDataField_'+i).val($('#txtId_'+i).val());	
}

function SpezzaCaMel(p){
	let parola = p.replaceAll('_', '')
	let arr = [];
	let i = 0;
	for (i=0; i< parola.length; ++i){		
		if (parola[i] === parola[i].toUpperCase()){			
			arr.push(i);			
		}		
	}	
	
	console.log(arr)
	
	let ret = '';
	//Ora in arr ho gli indici di tutte le maiuscole
	let j=0;
	for (j = 0; j<= arr.length - 2 ;++j){	
		let indexDa = arr[j];
		let indexA = arr[j + 1];
		let lungh = indexA - indexDa 		
		ret +=  parola.substr(arr[j], lungh ) + ' ';		
	}
	ret +=  parola.substr(arr[j]) + ' ';
	return ret
}