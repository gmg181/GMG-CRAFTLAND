const firebaseConfig = window.firebaseConfig;
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("uploadBtn").onclick = () => {
  document.getElementById("uploadForm").classList.toggle("hidden");
};

async function uploadImage() {
  const file = document.getElementById("imageInput").files[0];
  const mapCode = document.getElementById("mapCodeInput").value;
  if (!file || !mapCode) return alert("Please provide image and map code");

  const storageRef = storage.ref("maps/" + Date.now() + "-" + file.name);
  await storageRef.put(file);
  const imageUrl = await storageRef.getDownloadURL();

  await db.collection("maps").add({ imageUrl, mapCode, timestamp: Date.now() });
  alert("Uploaded!");
  loadGallery();
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  const snapshot = await db.collection("maps").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "bg-white p-2 shadow rounded";
    div.innerHTML = \`
      <img src="\${data.imageUrl}" alt="map" class="w-full h-32 object-cover rounded"/>
      <p class="mt-2 font-mono text-sm">Code: \${data.mapCode}</p>
    \`;
    gallery.appendChild(div);
  });
}

window.onload = loadGallery;
