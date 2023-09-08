function generaClasse(nomeClasse, iClassiSsql = ''){
	let classe = `	Imports CboUtil.Data

	Public Class c${$('#txtClasse').val()}
		Inherits CBO.IClassi

		Public Sub New()
			IClassi_sSql = "${$('#txtIClassiSsql').val()}"
		End Sub

		Public Overrides Function IClassi_Read(ByRef connessione As CboUtil.Data.CCboConnection) As Boolean

			Return MyBase.IClassi_Read(connessione)
		End Function

		Public Overrides Function IClassi_Update(ByRef connessione As CCboConnection) As Boolean

			Return MyBase.IClassi_Update(connessione)
		End Function

		Public Overrides Function IClassi_Delete(ByRef connessione As CCboConnection) As Boolean
		  
			Return MyBase.IClassi_Delete(connessione)
		End Function
	End Class
	`
	
	navigator.clipboard.writeText(classe);
	//effetto grafico
	$('.lblWarning').removeClass('lblFadingOutWarning');
	setTimeout(function () { 
			$('.lblWarning').css('display','block').addClass('lblFadingOutWarning');
	}, 200); 
}

////////////////////////////
function TestFast(){
	$('#txtProgetto').val('TestProgetto');
	$('#txtPagina').val('PaginaTest');
	$('#txtClasse').val('MyClass');
	$('#txtSigla').val('KAI');
	$('#txtIClassiSsql').val('SELECT * FROM Database.dbo.Tabella WHERE Chiavi = $Chiavi$');
	$('#txtNumeroFiltri').val(2);
	creaFiltri($('#txtNumeroFiltri').val()); $('.btnfiltri').removeClass('hidden'); 
	$('#txtId_1').val('aaaaaaa');
	$('#txtDataField_1').val('aaaDATAFIELD');
	$('#cmbTipoDati_1').val('1');
	$('#chkCreaFiltro_1').prop('checked');
	$('#chkIsKey_1').prop('checked', true) ;
	$('#txtId_2').val('bbbbbbbb');
	$('#txtDataField_2').val('bbbDATAFIELD');
	$('#cmbTipoDati_2').val('2');
	$('#chkCreaFiltro_2').prop('checked');
	$('#chkIsKey_2').prop('checked', false);
	GeneraPagina();
}