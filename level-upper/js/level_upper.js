var stream = null;
var camActive = false;
var micActice = false;
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
                if (!camActive) {
                    return;
                }
                stream.getTracks().forEach(function (track) {
                    if (track.readyState == 'live' && track.kind === 'video') {
                        track.stop();
                        document.getElementById("camToggle").innerHTML = "Start Camera";
                        camActive = false;
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
    if (micActice) {
        return;
    }
    document.getElementById("micToggle").innerHTML = "Stop Recording";
    micActice = true;
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
            var mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 200000 });
            mediaRecorder.start();
            var audioChunks = [];
            mediaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });
            document.getElementById("playRecording").addEventListener("click", function () {
                document.getElementById("playRecording").innerHTML = "Playing recording...";
                var audioBlob = new Blob(audioChunks);
                var audioUrl = URL.createObjectURL(audioBlob);
                var audio = new Audio(audioUrl);
                audio.play();
                audio.onended = function () {
                    document.getElementById("playRecording").innerHTML = "Play Recording";
                };
                audioChunks = [];
            });
            document.getElementById("micToggle").addEventListener("click", function () {
                if (!micActice) {
                    return;
                }
                stream.getTracks().forEach(function (track) {
                    if (track.readyState == 'live' && track.kind === 'audio') {
                        track.stop();
                        document.getElementById("micToggle").innerHTML = "Start Recording";
                        micActice = false;
                    }
                });
                mediaRecorder.stop();
                mediaRecorder = null;
            });
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
document.getElementById("micToggle").addEventListener("click", testAudio);
//testAudio()
