// ==UserScript==
// @name         Replay Recorder
// @namespace    http://tampermonkey.net/
// @version      2025-03-04
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/game?replay=*
// @grant        none
// ==/UserScript==
const imgs = [];

tagpro.ready(function waitForBar() {
    if (!document.getElementById("replayShare")) {
        return setTimeout(waitForBar, 100);
    }
    const recordButton = document.createElement("button");
    recordButton.style.width = "16px";
    recordButton.style.height = "16px";
    recordButton.style.borderRadius = "50%";
    recordButton.style.backgroundColor = "red";
    recordButton.style.border = "none";
    recordButton.style.cursor = "pointer";
    recordButton.style.margin = '0px 5px';

    const stopButton = document.createElement("button");
    stopButton.style.width = "16px";
    stopButton.style.height = "16px";
    stopButton.style.backgroundColor = "red";
    stopButton.style.border = "none";
    stopButton.style.cursor = "pointer";
    stopButton.id = 'stopButton';
    stopButton.style.margin = '0px 5px';


    const replayShare = document.getElementById("replayShare");

    if (replayShare.parentNode) {
        replayShare.parentNode.insertBefore(recordButton, replayShare);
        replayShare.parentNode.insertBefore(stopButton, replayShare);
    }
    /*for(let i = 1; i < 100; i++){
        setTimeout(() => {
            captureCanvas()
        }, 17*i);
    }*/
    recordButton.addEventListener('click', captureCanvas);
});

function captureCanvas() {
    const canvas = document.getElementById("viewport"); // Select the canvas
    if (!canvas) {
        alert("No canvas found!");
        return;
    }
    const ctx = canvas.getContext("2d");

    const FPS = 60;

    const stream = canvas.captureStream(FPS);
    const options = {
        mimeType: "video/webm;codecs=vp9",
        videoBitsPerSecond: 5_000_000 // 5 Mbps for higher quality
    };

    const recorder = new MediaRecorder(stream, options);

    let chunks = [];

    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        //download video
        const a = document.createElement("a");
        a.href = url;
        a.download = "canvas_video.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("Done");
    };
    recorder.start();
    document.getElementById("stopButton").addEventListener('click', () => {recorder.stop();});
}
