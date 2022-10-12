if ("webkitSpeechRecognition" in window) {
  let speechRecognition = new webkitSpeechRecognition();
  let finalTranscript = "";

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "en-US";

  const start = document.getElementById("start");
  const stop = document.getElementById("stop");

  start.onclick = () => {
    start.style.display = "none";
    stop.style.display = "block";

    speechRecognition.start();
  };

  stop.onclick = () => {
    speechRecognition.stop();

    start.style.display = "block";
    stop.style.display = "none";
  };

  speechRecognition.onstart = () => {
    console.log("start");
  };

  speechRecognition.onend = () => {
    console.log("end");
  };

  speechRecognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    console.log({ finalTranscript, interimTranscript });

    document.querySelector("#final").innerHTML = finalTranscript;
    document.querySelector("#interim").innerHTML = interimTranscript;
  };

  speechRecognition.onerror = (event) => {
    console.log("error", event.error);
  };
} else {
  console.log("Speech Recognition is not available");
}
