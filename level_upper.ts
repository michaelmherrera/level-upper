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
    document.getElementById("camResults").innerHTML = "Functional"
});
document.getElementById("camNonFunctional").addEventListener("click", () => {
    document.getElementById("camResults").innerHTML = "Non-Functional"
});
document.getElementById("micToggle").addEventListener("click", testAudio);
//testAudio()


