import { recordAudio, audioControl } from "./recordAudio.js";
import { calcHeight } from "./utils.js";

const languangeSelect = document.querySelector("#languangeSelect");
const textarea = document.querySelector("textarea");
const audio = document.querySelector(".audio");
const mainControlsRight = document.querySelector(".main-controls-right");
const start = document.getElementById("start");
const voice = document.getElementById("voice");
const stop = document.getElementById("stop");
const close = document.getElementById("close");
const copy = document.getElementById("copy");

const synth = window.speechSynthesis;
const speechRecognition = new webkitSpeechRecognition();

let finalTranscript = "";
let recorder = null;
let audioChunks = [];

speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = "en";

languangeSelect.onchange = (event) => {
  speechRecognition.lang = event.target.value;
};

start.onclick = async () => {
  start.style.display = "none";
  stop.style.display = "inline";
  languangeSelect.disabled = true;
  if (finalTranscript) finalTranscript += " ";

  try {
    recorder = await recordAudio(audioChunks);
    recorder.start();
    speechRecognition.start();
  } catch (error) {
    console.log("getMedia", { error });
    alert(error.message + ", please check your microphone setting");
    start.style.display = "inline";
    stop.style.display = "none";
  }
};

stop.onclick = async () => {
  const audioObj = await recorder.stop();

  audioChunks = audioObj.audioChunks;
  if (audio) audio.remove();

  speechRecognition.stop();
  recorder.stream.getAudioTracks()[0].stop();
  mainControlsRight.insertBefore(audioControl(audioObj.audioUrl), copy);

  start.style.display = "inline";
  stop.style.display = "none";
  languangeSelect.disabled = false;
  stop.classList.remove("animated");
};

close.onclick = () => {
  finalTranscript = "";
  textarea.value = "";
  audioChunks = [];

  speechRecognition.stop();

  if (audio) audio.remove();
  close.style.display = "none";
  stop.style.display = "none";
  copy.style.display = "none";
  voice.style.display = "none";
  languangeSelect.disabled = false;
  stop.classList.remove("animated");
  start.style.display = "inline";
  textarea.style.height = "inherit";
};

copy.onclick = () => {
  textarea.select();
  navigator.clipboard.writeText(textarea.value);
};

textarea.oninput = (event) => {
  close.style.display = "inline";
  copy.style.display = "inline";
  if (event.target.value) {
    voice.style.display = "inline";
  }
};

textarea.onkeyup = (event) => {
  textarea.style.height = calcHeight(textarea.value) + "px";
  if (event.target.value) {
    voice.style.display = "inline";
    close.style.display = "inline";
    copy.style.display = "inline";
  } else {
    voice.style.display = "none";
    close.style.display = "none";
    copy.style.display = "none";
  }
};

voice.onclick = () => {
  let timeoutResumeInfinity;

  function resumeInfinity() {
    synth.pause();
    synth.resume();
    timeoutResumeInfinity = setTimeout(resumeInfinity, 1000);
  }

  const voices = synth.getVoices();
  const utterThis = new SpeechSynthesisUtterance(textarea.value);

  utterThis.onstart = () => {
    resumeInfinity();
    console.log("SpeechSynthesisUtterance.onstart");
  };
  utterThis.onend = () => {
    console.log("SpeechSynthesisUtterance.onend");
    clearTimeout(timeoutResumeInfinity);
    voice.disabled = false;
  };

  utterThis.onerror = (event) => {
    console.error("SpeechSynthesisUtterance.onerror", { error: event.error });
  };

  const selectedOption =
    languangeSelect.selectedOptions[0].getAttribute("data-name");
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  utterThis.rate = 0.8;
  speechSynthesis.cancel();
  synth.speak(utterThis);

  voice.disabled = true;
};

speechRecognition.onstart = () => {
  console.log("start");
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

  textarea.value = finalTranscript + interimTranscript;
  textarea.focus();
  voice.style.display = "inline";
  copy.style.display = "inline";
  close.style.display = "inline";
};

speechRecognition.onend = () => {
  console.log("end");
};

speechRecognition.onerror = (event) => {
  console.log("error", event.error);
};
