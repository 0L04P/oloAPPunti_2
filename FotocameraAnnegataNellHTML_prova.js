(() => {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    const width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    let streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the AvviaFotocamera() function.
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;

    function showViewLiveResultButton() {
        if (window.self !== window.top) {
            // Ensure that if our document is in a frame, we get the user
            // to first open it in its own tab or window. Otherwise, it
            // won't be able to request permission for camera access.
            document.querySelector(".contentarea").remove();
            const button = document.createElement("button");
            button.textContent = "View live result of the example code above";
            document.body.append(button);
            button.addEventListener("click", () => window.open(location.href));
            return true;
        }
        return false;
    }

    const constraints = {
		video: {
			width: {
				min: 800,
				ideal: 1920,				
			},
			height: {
				min: 600,
				ideal: 1080,				
			},
			facingMode: {
				exact: 'environment'
			}
        },
        audio: false,
        brightness: true,
        focusMode: true
	}

    function AvviaFotocamera() {
        if (showViewLiveResultButton()) {
            return;
        }
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        startbutton = document.getElementById("startbutton");

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
                alert('Anomalia in fase apertura fotocamera:' + err)
            });

        video.addEventListener(
            "canplay",
            (ev) => {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);                    
                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }
                    let widthVideo, heightVideo;
                    heightVideo = 550;
                    widthVideo = heightVideo * (width/height);

                    video.setAttribute("width", widthVideo);
                    video.setAttribute("height", heightVideo);
                    canvas.setAttribute("width", width);
                    canvas.setAttribute("height", height);
                    streaming = true;
                }
            },
            false,
        );

        startbutton.addEventListener(
            "click",
            (ev) => {
                ScattaFoto();
                ev.preventDefault();
            },
            false,
        );

        Pulisci_e_Ricrea_Foto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    function Pulisci_e_Ricrea_Foto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function ScattaFoto() {
        const context = canvas.getContext("2d");
       
        if (height && width) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            const data = canvas.toDataURL("image/png");
            photo.setAttribute("src", data);
        } else {
            Pulisci_e_Ricrea_Foto();
        }
    }

    // Set up our event listener to run the AvviaFotocamera process
    // once loading is complete.
    window.addEventListener("load", AvviaFotocamera, false);
})();

/******OLD codice******/
//(function(){
//	ApriFotocamera();
//}());

//var erroreChiamata = 0;

//function ApriFotocamera() {
//	var video = document.querySelector("#videoElement");
//	var constraints = {
//		video: {
//			width: {
//				min: 1280,
//				ideal: 1920,
//				max: 2560,
//			},
//			height: {
//				min: 720,
//				ideal: 1080,
//				max: 1440
//			},
//			facingMode: {
//				exact: 'environment'
//			}
//		}
//	}

//	if (navigator.mediaDevices.getUserMedia) {
//		navigator.mediaDevices.getUserMedia(constraints)
//			.then(function (stream) {
//				document.getElementById('lblEsito').innerHTML = 'Camera aperta con successo'
//				video.srcObject = stream;
//			})
//			.catch(function (error) {
//				document.getElementById('lblEsito').innerHTML = 'Errore apertura camera'
//				console.log("Errore apertura camera " + error);
//				setTimeout(function () {
//					ApriFotocamera()
//				}, 500)

//			});
//	}
//}

function TEST() {
    let arrFoto = $("#txtFotoFile").prop('files'); //prendo la prima foto	

    arrFoto.forEach(function (foto, index) {
        //Nel caso si aprisse il file chhoser ma non selezionassi nessuna foto, per evitare errori aggiungo controllo sulla non nullità di foto:
        if (foto && isFoto(foto.name)) {
            alert(foto.name)
        } else {
            alert('Selezionare una foto!')
        }

    });


}