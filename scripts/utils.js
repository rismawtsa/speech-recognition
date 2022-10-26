function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
  return newHeight;
}

function deleteAudioElement() {
  const audio = document.querySelector("audio");
  if (audio) audio.remove();
}

export { calcHeight, deleteAudioElement };
