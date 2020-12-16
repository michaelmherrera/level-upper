var stream = null;
var camActive = false;
function testCam() {
    if (camActive) {
        return;
    }
    var video = document.querySelector("#videoElement");
    document.getElementById("camToggle").innerHTML = "Stop Camera";
    camActive = true;
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
            // Stop the camera
            document.getElementById("camToggle").addEventListener("click", function () {
                stream.getTracks().forEach(function (track) {
                    if (track.readyState == 'live' && track.kind === 'video') {
                        track.stop();
                    }
                });
            });
            video.srcObject = stream;
        })
            .catch(function (er) {
            console.log("Something went wrong!");
        });
    }
}
function testAudio() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
            var mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            var audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });
            mediaRecorder.addEventListener("stop", function () {
                var audioBlob = new Blob(audioChunks);
                var audioUrl = URL.createObjectURL(audioBlob);
                var audio = new Audio(audioUrl);
                audio.play();
            });
            setTimeout(function () {
                mediaRecorder.stop();
            }, 3000);
        });
    }
}
document.getElementById("camToggle").addEventListener("click", testCam);
document.getElementById("camFunctional").addEventListener("click", function () {
    document.getElementById("camResults").innerHTML = "Functional";
});
document.getElementById("camNonFunctional").addEventListener("click", function () {
    document.getElementById("camResults").innerHTML = "Non-Functional";
});
//document.getElementById("stopVid").addEventListener("click", stopVideo)
//testAudio()
