// --- Element references ---

const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");


// --- PDF Upload ---

uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async () => {
  const files = Array.from(fileInput.files);
  if (files.length === 0) return;

  await Promise.all(files.map(file => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch("/upload", { method: "POST", body: formData });
  }));

  fileInput.value = "";
});
