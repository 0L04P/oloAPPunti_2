//var url = 'http://localhost:64964/Bes.svc/'
var url = 'http://localhost:1994/WS/Bes.svc/'

$(document).ready(function(){
			       
		BindCMB();
				
  $('#txtDataRif').val(GetOggi());
 }());
 document.addEventListener("DOMContentloaded", function () {	
  $('#txtDataRif').val(GetOggi());
});
 function BindCMB(){
	 
	 $.ajax({  
		type: "POST", 
		url: url + "GetDatabasesWS", 
		dataType: "json", 
		contentType: "application/json", 
		success: function (oJSON)  
		{
		let arrayDB = oJSON.Database;
			arrayDB.forEach(NomeDB => $("#cmbDB").append($("<option style='font-weight: bold;'></option>").val(NomeDB).html(NomeDB)));							
		} , 
		error: function(xhr, status, error) {
			debugger;
			alert('Error in API call BindCMB!')					  
	    }	
	}); 
	 
 }
 function BindCMBSigle(){
	 let MyJson = `{
		"Database":"${$('#cmbDB').val()}"		
		}`
	 $.ajax({  
		type: "POST", 
		url: url + "GetSiglaDatabaseWS", 
		dataType: "json", 
		"data": MyJson,	
		contentType: "application/json", 
		success: function (oJSON)  
		{debugger;
			$('#cmbDBSigle').text('')
			let arrayDB = oJSON.Sigle;
			arrayDB.forEach(SiglaDB => $("#cmbDBSigle").append($("<option style='font-weight: bold;'></option>").val(SiglaDB).html(SiglaDB)));							
		} , 
		error: function(output) {
			alert('Error in API call BindCMB sigle!')					  
	    }	
	}); 
	 
 }
 function GetModificheTabelle(){
	 let t = '';
	 let MyJson = `{
		"Database":"${$('#cmbDB').val()}",
		"DataRif" : "${$('#txtDataRif').val()}"
		}`
		
	 $.ajax({  
		type: "POST", 
		url: url + "GetModificheTabelle", 
		dataType: "json",
		"data": MyJson,		
		contentType: "application/json", 
		success: function (oJSON)  
		{  debugger; //let arrayDB = oJSON.Database;
			//arrayDB.forEach(NomeDB => $("#cmbDB").append($("<option style='font-weight: bold;'></option>").val(NomeDB).html(NomeDB)));							 1			
			let html = oJSON.TabellaHTML;
			if (html === ""){
				$('#divModTabelle').append(`<b>Nessuna modifica rilevata dal ${$('#txtDataRif').val()}</b>`);				
			}else{
				$('#divModTabelle').append(html);
			}
			
			console.log('GetModificheTabelle - Tutto ok');			
		} , 
		error: function(output) {
			alert('Error in API call BindCMB!')					  
	    }	
	}); 
	 
 }
 function GetModificheViste(){
	 let t = '';
	 let MyJson = `{
		"Database":"${$('#cmbDB').val()}",
		"DataRif" : "${$('#txtDataRif').val()}"
		}`
		
	 $.ajax({  
		type: "POST", 
		url: url + "GetModificheViste", 
		dataType: "json",
		"data": MyJson,		
		contentType: "application/json", 
		success: function (oJSON)  
		{  //let arrayDB = oJSON.Database;
			//arrayDB.forEach(NomeDB => $("#cmbDB").append($("<option style='font-weight: bold;'></option>").val(NomeDB).html(NomeDB)));				
						
			let html = oJSON.TabellaHTML;
			if (html === ""){
				$('#divModViste').append(`<b>Nessuna modifica rilevata dal ${$('#txtDataRif').val()}</b>`);				
			}else{
				$('#divModViste').append(html);
			}			
			console.log('GetModificheViste - Tutto ok');		
		} , 
		error: function(output) {
			alert('Error in API call BindCMB!')					  
	    }	
	}); 
	 
 } 
 function GetModificheStoredProc(){
	 let t = '';
	 let MyJson = `{
		"Database":"${$('#cmbDB').val()}",
		"DataRif" : "${$('#txtDataRif').val()}"
		}`
		
	 $.ajax({  
		type: "POST", 
		url: url + "GetModificheStoredProc", 
		dataType: "json",
		"data": MyJson,		
		contentType: "application/json", 
		success: function (oJSON)  
		{  //let arrayDB = oJSON.Database;
			//arrayDB.forEach(NomeDB => $("#cmbDB").append($("<option style='font-weight: bold;'></option>").val(NomeDB).html(NomeDB)));									
			let html = oJSON.TabellaHTML;
			if (html === ""){
				$('#divModStoredProc').append(`<b>Nessuna modifica rilevata dal ${$('#txtDataRif').val()}</b>`);				
			}else{
				$('#divModStoredProc').append(html);
			}
			
			console.log('GetModificheStoredProc - Tutto ok');
		} , 
		error: function(output) {
			alert('Error in API call BindCMB!')					  
	    }	
	}); 
	 
 }
 function CheckRboWin(){
	 let t = '';
	 let MyJson = `{
		"Database":"${$('#cmbDB').val()}",		
		"Sigla" : "${$('#cmbDBSigle').val()}",
		"Testo":"${$('#txtNomeRicerca').val()}"
		}`
		 
	 $.ajax({  
		type: "POST", 
		url: url + "CheckRboWin", 
		dataType: "html",
		data: MyJson,		
		contentType: "application/json", 
		success: function (oJSON)  
		{  	debugger;
			 let html = oJSON/*.TabellaHTML.replaceAll("fslash", "/").replaceAll("bslash", "\\");*/
			html = html.replaceAll("&gt;", ">").replaceAll("&lt;", "<");
			
			debugger;
			$('#divCheckRboWin').append(html);
			console.log('CheckRboWin - Tutto ok');			
		} , 
		error: function(xhr, status, error) {
			debugger;			
			alert('Error in API call CheckRboWin!' + error)
	
	    }	
	}); 
	 
 }
  function GetOggi(){	
	return new Date().toISOString().substring(0,10);
 }
 
 
 
 
 
 