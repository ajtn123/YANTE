const image = document.getElementById("image");

// Open DB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ImageStore", 1);

    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore("images");
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveImage(blob) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", "readwrite");
    tx.objectStore("images").put(blob, "background");
    tx.oncomplete = resolve;
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function loadImage() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", "readonly");
    const request = tx.objectStore("images").get("background");
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Load on startup
(async () => {
  const blob = await loadImage();
  if (blob) {
    image.style.backgroundImage = `url(${URL.createObjectURL(blob)})`;
  }
})();

// Drag and drop
image.addEventListener("dragover", (e) => e.preventDefault());

image.addEventListener("drop", async (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (!file) return;

  await saveImage(file);
  image.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
});