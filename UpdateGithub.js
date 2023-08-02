$(document).ready(function(){
	GetAllRepos();
})
function RimuoviFile(){
	$('#txtFile').fadeOut(); 
	setTimeout(function(){
		$('#txtFile').val('').fadeIn();
		$('#txtNomeFile').val('');
		$('#txtSHA').val('');
	},300);	
}
function Agg(q){
	$("#txtNomeRepo").val(q.value)
}

const txtFile = document.getElementById("txtFile");
var BASE64;


const uploadImage = async (event) => {
    const file = event.target.files[0];	 
	BASE64 = await convertBase64(file); 
	$('#txtNomeFile').val(file.name); 
};

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
		 
			let base64 = fileReader.result.replace(/data[\W\w]+base64\,/, '')
            resolve(base64);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

function Carica(){
	$('#lblEsito').text('');
	
	let MyJson = '';
	let oJson = {};
	oJson['message'] = pScriviDataCommit() + '\n' + $('#txtMessage').val();
	oJson['content'] = BASE64;
	if($('#txtSHA').val() == '---FILE NON PRESENTE---'){
		oJson['sha'] = '';
	}else{
		oJson['sha'] = 	$('#txtSHA').val();
	}
	
	MyJson = JSON.stringify(oJson);
	
	if (!BASE64 || BASE64 == '' || $('#txtNomeRepo').val() == '' || $('#txtNomeFile').val() == '' || $('#txtSHA').val() == ''){
		let errore = '';
		errore += '\nBASE64:\n';
		errore += BASE64;
		errore += '\n\nNome repo:\n';
		errore += $('#txtNomeRepo').val();
		errore += "\n\nNome file:\n";
		errore += $('#txtNomeFile').val();
		if($('#txtSHA').val() == ''){
			errore +="\n\nSHA non verificato!!!\n";
		}
		$('#lblEsito').text(errore)
		/*alert("Dati mancanti: vedi console per i dettagli")
		console.error("BASE64:")
		console.error(BASE64)
		console.error("Nome repo:")
		console.error($('#txtNomeRepo').val())
		console.error("Nome file:")
		console.error($('#txtNomeFile').val())
		if($('#txtSHA').val() == ''){
			console.error("SHA non verificato!!!")
		}*/
				
		return false;
	}else{
	
		ShowLoading();
		
		setTimeout(function(){
			pCarica(MyJson);
		}, 1000);
		
	}
}

function pCarica(MyJson){

	$.ajax({		 
		"crossDomain": false,
		"async": false,
		"url": `https://api.github.com/repos/0L04P/${$('#txtNomeRepo').val()}/contents/${$('#txtNomeFile').val().trim()}`,
		"method": "PUT",
		"data": MyJson,
		"contentType": "application/json; charset=utf-8",
		"beforeSend": function (xhr) {
			xhr.setRequestHeader('Authorization', 'Bearer ' + GITHUB_TOKEN);
		},
		success: function(oJSON, status, xhr) {
			$('#lblEsito').text('Caricato!');
			RimuoviFile();
			$('#txtMessage').val('');			
			HideLoading();
			console.log(oJSON)
		 },
		error: function(output) {
		
			$('#lblEsito').text('Error in API call:\n' + output.statusText + '\n'  + output.responseJSON.message);	
			console.log(output)			
			HideLoading();				
			
		}		
	}); 		  	
}

function GetAllRepos(){	
	$.ajax({		 
		"crossDomain": false,
		"async": false,
		"url": `https://api.github.com/users/0L04P/repos`,
		"method": "GET",		 
		"contentType": "application/json; charset=utf-8",
		"beforeSend": function (xhr) {
			
		},
		success: function(arrayDB, status, xhr) {	
			let nomeRepo = 'oloAPPunti_2';		
			$("#cmbRepo").append($("<option style='font-weight: bold;'>oloAPPunti_2</option>").val(nomeRepo).html(nomeRepo));			
			arrayDB.forEach(function(e,i){ 
				nomeRepo = e['full_name'].replace('0L04P\/','');
				$("#cmbRepo").append($("<option style='font-weight: bold;'></option>").val(nomeRepo).html(nomeRepo));
			})
		 },
		error: function(output) {
			alert('Error in API call:' + output)					  
			
		}		
	}); 		  
	return '';
}

function pScriviDataCommit(){
	const currentDate = new Date();

	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1 to get the correct month number (1 - January, 2 - February, etc.)
	const currentDay = currentDate.getDate();
	const currentHours = currentDate.getHours();
	const currentMinutes = currentDate.getMinutes();
	const currentSeconds = currentDate.getSeconds();
	let sEvento = 'Aggiornato';
	if ($('#txtSHA').val() == '---FILE NON PRESENTE---')	
	{
		sEvento = 'Caricato';
	}
	
	return (sEvento +' da oloAPPunti il ' + currentDay +'/'+ currentMonth + '/'+ currentYear+' ' + currentHours+':'+currentMinutes+':'+currentSeconds)

}

function ShowLoading(){
	$('#divLoading').fadeIn();
	$('#btnUpload').css('cursor', 'not-allowed')
}
function HideLoading(){
	$('#divLoading').fadeOut();;
	$('#btnUpload').css('cursor', '')
}

/*getSHA: fatta da chatgpt*/
function getSHA(){	
	const owner = '0L04P';
	const repo = $('#txtNomeRepo').val();
	const filePath = $('#txtNomeFile').val();
	const accessToken = GITHUB_TOKEN;

	// Make the API request to get the file information
	$.ajax({
	  "crossDomain": false,
	  "async": false,
	  "url": `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
	  "type": 'GET',
	  "beforeSend": function (xhr) {
			xhr.setRequestHeader('Authorization', 'Bearer ' + GITHUB_TOKEN);
		},
	  "success": function(data) {
		const fileSha = data.sha;
		console.log(`SHA of the file '${filePath}': ${fileSha}`);
		$('#txtSHA').val(data.sha);
	  },
	  "error": function(xhr, status, error) {
		console.error('Error fetching file:', status, error);
		$('#txtSHA').val('---FILE NON PRESENTE---');
	  }
	});

}

/*
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
}*/