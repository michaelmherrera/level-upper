let stream: MediaStream = null
let camActive: boolean = false

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
                    stream.getTracks().forEach(function (track) {
                        if (track.readyState == 'live' && track.kind === 'video') {
                            track.stop();
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
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder: MediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                const audioChunks: Blob[] = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks)
                    const audioUrl: string = URL.createObjectURL(audioBlob)
                    const audio = new Audio(audioUrl)
                    audio.play()
                })

                setTimeout(() => {
                    mediaRecorder.stop()
                }, 3000)

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

//testAudio()


