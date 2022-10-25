import { recordAudio, audioControl } from "./recordAudio.js";

const lang = document.getElementById("selectLang");
const start = document.getElementById("start");
const voice = document.querySelector("#voice");
const stop = document.getElementById("stop");
const close = document.getElementById("close");
const copy = document.getElementById("copy");
const text = document.getElementById("text");
const bottomRightContainer = document.querySelector(".right");

const synth = window.speechSynthesis;
const speechRecognition = new webkitSpeechRecognition();
let finalTranscript = "";
let recorder = null;
let audio = null;
let audioElement;
let audioChunks = [];

speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = "en";

lang.onchange = (event) => {
  speechRecognition.lang = event.target.value;
};

start.onclick = async () => {
  start.style.display = "none";
  stop.style.display = "inline";
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
  audio = await recorder.stop();

  audioChunks = audio.audioChunks;
  if (audioElement) {
    document.querySelector(".audio").remove();
  }

  speechRecognition.stop();
  recorder.stream.getAudioTracks()[0].stop();
  bottomRightContainer.insertBefore(audioControl(audio.audioUrl), copy);
  audioElement = true;

  start.style.display = "inline";
  stop.style.display = "none";
  stop.classList.remove("animated");
};

close.onclick = () => {
  finalTranscript = "";
  text.value = "";
  audio = null;

  speechRecognition.stop();
  close.style.display = "none";
  stop.style.display = "none";
  copy.style.display = "none";
  voice.style.display = "none";
  stop.classList.remove("animated");
  if (audioElement) {
    document.querySelector(".audio").remove();
  }

  start.style.display = "inline";
};

copy.onclick = () => {
  text.select();
  navigator.clipboard.writeText(text.value);
};

text.oninput = (event) => {
  close.style.display = "inline";
  copy.style.display = "inline";
  if (event.target.value) {
    voice.style.display = "inline";
  }
};

voice.onclick = () => {
  const utterThis = new SpeechSynthesisUtterance(text.value);
  utterThis.onend = function (event) {
    console.log("SpeechSynthesisUtterance.onend");
  };

  utterThis.onerror = function (event) {
    console.error("SpeechSynthesisUtterance.onerror", { error: event.error });
  };

  synth.speak(utterThis);
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

  text.value = finalTranscript + interimTranscript;
  text.focus();
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
