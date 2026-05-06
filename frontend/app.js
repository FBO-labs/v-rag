// --- Element references ---

const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const docList   = document.getElementById("doc-list");
const docCount  = document.getElementById("doc-count");

// --- State ---
const docs = []; // { name: string, active: boolean }

// --- Document list ---

function renderDocList() {
  docList.innerHTML = "";

  docs.forEach((doc, index) => {
    const li       = document.createElement("li");
    li.className   = "doc-item" + (doc.active ? "" : " inactive");

    const checkbox    = document.createElement("input");
    checkbox.type     = "checkbox";
    checkbox.checked  = doc.active;
    checkbox.addEventListener("change", () => toggleDoc(index));

    const name      = document.createElement("span");
    name.className  = "doc-name";
    name.textContent = doc.name;

    li.appendChild(checkbox);
    li.appendChild(name);
    docList.appendChild(li);
  });

  const active = docs.filter(d => d.active).length;
  docCount.textContent = `${docs.length} document${docs.length !== 1 ? "s" : ""} · ${active} active`;
}

function toggleDoc(index) {
  docs[index].active = !docs[index].active;
  renderDocList();
}

// --- Load files on page load ---

async function loadFiles() {
  const response = await fetch("/files");
  const data     = await response.json();

  data.files.forEach(name => docs.push({ name, active: true }));
  renderDocList();
}

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

  files.forEach(file => docs.push({ name: file.name, active: true }));
  renderDocList();

  fileInput.value = "";
});

// --- Init ---

loadFiles();
