let stream: MediaStream = null
let camActive: boolean = false
let micActice: boolean = false

function testCam() {
    if (camActive) {
        return;
    }
    var video: HTMLVideoElement = document.querySelector("#videoElement");
    document.getElementById("camToggle").innerHTML = "Stop Camera"
    camActive = true
    if (navigator.mediaDevices.getUserMedia) {

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {

                // Stop the camera
                document.getElementById("camToggle").addEventListener("click", () => {
                    if (!camActive){
                        return;
                    }
                    stream.getTracks().forEach(function (track) {
                        if (track.readyState == 'live' && track.kind === 'video') {
                            track.stop();
                            document.getElementById("camToggle").innerHTML = "Start Camera"
                            camActive = false
                        }
                    });
                });



                video.srcObject = stream;
            })
            .catch(er => {
                console.log("Something went wrong!");
            });
    }
}



function testAudio() {
    if (micActice) { 
        return;
    }
    document.getElementById("micToggle").innerHTML = "Stop Recording"
    micActice = true
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                var mediaRecorder: MediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond: 200000});
                mediaRecorder.start();
                

                var audioChunks: Blob[] = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });


                document.getElementById("playRecording").addEventListener("click", () => {
                    document.getElementById("playRecording").innerHTML = "Playing recording..."
                    const audioBlob = new Blob(audioChunks)
                    const audioUrl: string = URL.createObjectURL(audioBlob)
                    const audio = new Audio(audioUrl)
                    audio.play()
                    audio.onended = function () {
                        document.getElementById("playRecording").innerHTML = "Play Recording"
                    };
                    
                    audioChunks = []
                })

                document.getElementById("micToggle").addEventListener("click", () => {
                    if (!micActice){
                        return;
                    }
                    stream.getTracks().forEach(function (track) {
                        if (track.readyState == 'live' && track.kind === 'audio') {
                            track.stop();
                            document.getElementById("micToggle").innerHTML = "Start Recording"
                            micActice = false
                        }
                    });
                    mediaRecorder.stop()
                    mediaRecorder = null;
                });

                

            });
    }
}
document.getElementById("camToggle").addEventListener("click", testCam)
document.getElementById("camFunctional").addEventListener("click", () => {
    document.getElementById("CamResults").innerHTML = "Functional"
});
document.getElementById("camNonFunctional").addEventListener("click", () => {
    document.getElementById("CamResults").innerHTML = "Non-Functional"
});
document.getElementById("micToggle").addEventListener("click", testAudio);
//testAudio()


// Implements buttons to copy property values
var elements = document.getElementsByClassName("btn btn-primary btn-sm prop");
for (let elem of elements){
    elem.addEventListener("click", event =>{
        // Get the element that triggered the event
        var triggeringElem: Element = (<Element>event.target)
        // Get the value of the property with which the copy button is associated
        var propVal = triggeringElem.parentElement.children[1].innerHTML;

        // Created a dummy input so that the value can be copied to the clipboard
        var tempInput = document.createElement("input");
        tempInput.value = propVal;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    })
}



