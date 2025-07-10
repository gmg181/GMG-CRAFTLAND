// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Upload function
async function upload() {
  const code = document.getElementById('mapCode').value.trim();
  const file = document.getElementById('mapImage').files[0];
  const status = document.getElementById('status');

  if (!code || !file) {
    status.innerText = "Please enter code and choose an image.";
    return;
  }

  const ref = storage.ref('maps/' + file.name);
  await ref.put(file);
  const url = await ref.getDownloadURL();

  await db.collection('maps').add({ code, imageUrl: url, created: new Date() });
  status.innerText = "Upload successful!";
}

// Show uploaded maps
if (location.pathname.includes("maps.html")) {
  db.collection('maps').orderBy("created", "desc").onSnapshot(snapshot => {
    const mapList = document.getElementById('mapList');
    mapList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "map";
      div.innerHTML = `<strong>${data.code}</strong><br/><img src="${data.imageUrl}" alt="map"/>`;
      mapList.appendChild(div);
    });
  });
}
