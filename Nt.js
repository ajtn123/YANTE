const image = document.getElementById("image");

chrome.storage.local.get(["Image"], (result) => {
  image.style.backgroundImage = `url(${result.Image})`;
});

image.addEventListener("dragover", (e) => {
  e.preventDefault();
});

image.addEventListener("drop", (e) => {
  e.preventDefault();
  const reader = new FileReader();
  reader.onload = function (e) {
    image.style.backgroundImage = `url(${e.target.result})`;
    chrome.storage.local.clear(function () {
      chrome.storage.local.set({ Image: e.target.result });
    });
  };
  reader.readAsDataURL(e.dataTransfer.files[0]);
});
