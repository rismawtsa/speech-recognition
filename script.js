if ("webkitSpeechRecognition" in window) {
  let speechRecognition = new webkitSpeechRecognition();
  let finalTranscript = "";

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "en";

  const lang = document.getElementById("selectLang");
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const close = document.getElementById("close");
  const copy = document.getElementById("copy");
  const text = document.getElementById("text");

  lang.onchange = (event) => {
    speechRecognition.lang = event.target.value;
  };

  start.onclick = () => {
    start.style.display = "none";
    stop.style.display = "inline";

    speechRecognition.start();
  };

  stop.onclick = () => {
    speechRecognition.stop();

    start.style.display = "inline";
    stop.style.display = "none";
    stop.classList.remove("animated");
  };

  close.onclick = () => {
    finalTranscript = "";
    text.value = "";

    speechRecognition.stop();
    close.style.display = "none";
    stop.style.display = "none";
    copy.style.display = "none";
    start.style.display = "inline";
    stop.classList.remove("animated");
  };

  copy.onclick = () => {
    text.select();
    navigator.clipboard.writeText(text.value);
  };

  text.oninput = () => {
    close.style.display = "inline";
    copy.style.display = "inline";
  };

  speechRecognition.onstart = () => {
    console.log("start");
  };

  speechRecognition.onend = () => {
    console.log("end");
  };

  speechRecognition.onresult = (event) => {
    stop.classList.add("animated");
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    text.value = finalTranscript + interimTranscript;
    copy.style.display = "inline";
    close.style.display = "inline";
  };

  speechRecognition.onerror = (event) => {
    console.log("error", event.error);
  };
} else {
  console.log("Speech Recognition is not available");
}
