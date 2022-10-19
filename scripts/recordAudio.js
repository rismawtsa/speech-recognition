const recordAudio = () => {
  return new Promise((resolve) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      const start = () => {
        mediaRecorder.start();
      };

      const stop = () => {
        return new Promise((resolve) => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks, {
              type: "audio/ogg; codecs=opus",
            });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => {
              audio.play();
            };

            resolve({ audioBlob, audioUrl, play });
          });

          mediaRecorder.stop();
        });
      };

      resolve({ stream, start, stop });
    });
  });
};

const audioControl = (audioUrl) => {
  const audio = document.createElement("audio");
  audio.setAttribute("controls", "");
  audio.classList.add("audio");
  audio.controls = true;
  audio.src = audioUrl;

  return audio;
};

export { recordAudio, audioControl };
