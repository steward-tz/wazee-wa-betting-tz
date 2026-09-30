import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMWh-yKE13mQ-SRA3lDugpHXV1kuVMBK8",
  authDomain: "wazee-wa-betting-tz-e7183.firebaseapp.com",
  projectId: "wazee-wa-betting-tz-e7183",
  storageBucket: "wazee-wa-betting-tz-e7183.firebasestorage.app",
  messagingSenderId: "790161817035",
  appId: "1:790161817035:web:f217cebf1fca1dcb240a4e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let currentUser = null;
let selections = [];
let registering = false;

const escapeHtml = (value) =>
  String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);

function notify(message, type = "success") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `position:fixed;right:20px;bottom:20px;z-index:50;background:${type === "error" ? "#6a2d27" : "#b8f34b"};color:${type === "error" ? "#fff" : "#071714"};padding:12px 16px;border-radius:8px;font:600 12px Manrope,sans-serif;box-shadow:0 10px 30px #0008`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function closeModal() {
  document.querySelectorAll(".firebase-modal").forEach((modal) => modal.remove());
}

function showAuthModal() {
  closeModal();
  const modal = document.createElement("div");
  modal.className = "modal-backdrop firebase-modal";
  modal.innerHTML = `<div class="modal login-modal" data-modal-panel>
    <button class="modal-close" data-close aria-label="Funga">×</button>
    <div class="login-mark">W</div>
    <span class="section-kicker">KARIBU KWENYE JAMII</span>
    <h2>${registering ? "Tengeneza akaunti" : "Ingia kwenye akaunti"}</h2>
    <p>Unda mikeka, fuatilia creators na shiriki tips zako.</p>
    ${registering ? '<label>Jina lako<input data-name placeholder="Mzee wa Odds" /></label>' : ""}
    <label>Barua pepe<input data-email type="email" placeholder="username@mfano.com" /></label>
    <label>Password<input data-password type="password" placeholder="••••••••" /></label>
    <p class="modal-error" data-error style="display:none"></p>
    <button class="primary-button full" data-submit>${registering ? "Jisajili" : "Ingia"}</button>
    <button class="ghost-button full" data-google>Endelea na Google</button>
    <button class="link-button" data-toggle>${registering ? "Tayari una akaunti? Ingia" : "Huna akaunti? Jisajili"}</button>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close]")) closeModal();
    if (event.target.closest("[data-toggle]")) {
      registering = !registering;
      showAuthModal();
    }
  });
  modal.querySelector("[data-submit]").addEventListener("click", async () => {
    const email = modal.querySelector("[data-email]").value.trim();
    const password = modal.querySelector("[data-password]").value;
    const name = modal.querySelector("[data-name]")?.value.trim() || "";
    const error = modal.querySelector("[data-error]");
    error.style.display = "none";
    try {
      const result = registering
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      if (registering && name) await updateProfile(result.user, { displayName: name });
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || name || email.split("@")[0],
        updatedAt: serverTimestamp(),
        ...(registering ? { createdAt: serverTimestamp() } : {}),
      }, { merge: true });
      closeModal();
      notify(registering ? "Akaunti imetengenezwa." : "Umeingia kwa mafanikio.");
    } catch (authError) {
      error.textContent = authError?.message || "Imeshindikana kuingia.";
      error.style.display = "block";
    }
  });
  modal.querySelector("[data-google]").addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      closeModal();
      notify("Umeingia kwa Google.");
    } catch (authError) {
      const error = modal.querySelector("[data-error]");
      error.textContent = authError?.message || "Google sign-in imeshindikana.";
      error.style.display = "block";
    }
  });
}

function showAccountModal() {
  closeModal();
  const modal = document.createElement("div");
  modal.className = "modal-backdrop firebase-modal";
  modal.innerHTML = `<div class="modal login-modal" data-modal-panel>
    <button class="modal-close" data-close aria-label="Funga">×</button>
    <div class="login-mark">W</div>
    <span class="section-kicker">AKAUNTI YAKO</span>
    <h2>${escapeHtml(currentUser.displayName || currentUser.email || "Mwanachama")}</h2>
    <p>${escapeHtml(currentUser.email || "")}</p>
    <label style="text-align:left">Profile image<input data-avatar type="file" accept="image/*" /></label>
    <button class="ghost-button full" data-upload>Upload picha</button>
    <button class="primary-button full" data-logout>Toka kwenye akaunti</button>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close]")) closeModal();
  });
  modal.querySelector("[data-logout]").addEventListener("click", async () => {
    await signOut(auth);
    closeModal();
    notify("Umetoka kwenye akaunti.");
  });
  modal.querySelector("[data-upload]").addEventListener("click", async () => {
    const file = modal.querySelector("[data-avatar]").files[0];
    if (!file) return notify("Chagua picha kwanza.", "error");
    if (file.size > 5 * 1024 * 1024) return notify("Picha iwe chini ya 5 MB.", "error");
    try {
      const imageRef = ref(storage, `users/${currentUser.uid}/avatar-${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      const photoURL = await getDownloadURL(imageRef);
      await setDoc(doc(db, "users", currentUser.uid), { photoURL, updatedAt: serverTimestamp() }, { merge: true });
      notify("Profile image imehifadhiwa.");
    } catch (storageError) {
      notify(storageError?.message || "Upload imeshindikana.", "error");
    }
  });
}

function showDraftModal() {
  closeModal();
  if (!currentUser) {
    notify("Ingia kwanza ili kuhifadhi mkeka kwenye Firestore.", "error");
    showAuthModal();
    return;
  }
  const modal = document.createElement("div");
  modal.className = "modal-backdrop firebase-modal";
  modal.innerHTML = `<div class="modal" data-modal-panel>
    <div class="modal-head"><div><span class="section-kicker">TICKET BUILDER</span><h2>Hifadhi mkeka</h2></div><button data-close>×</button></div>
    <label>Kichwa cha mkeka<input data-title placeholder="Weekend ya uhakika" /></label>
    <div class="modal-selections"><div class="label-row"><b>Selections</b><span>${selections.length} zimechaguliwa</span></div>
      ${selections.length ? selections.map((selection) => `<div class="selection-row"><span>${escapeHtml(selection)}</span><b>1.65</b></div>`).join("") : '<div class="empty-slip">Chagua mechi au pick kwenye ukurasa.</div>'}
    </div>
    <button class="primary-button full" data-save>Hifadhi draft kwenye Firestore</button>
  </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.closest("[data-close]")) closeModal();
  });
  modal.querySelector("[data-save]").addEventListener("click", async () => {
    try {
      await addDoc(collection(db, "users", currentUser.uid, "drafts"), {
        title: modal.querySelector("[data-title]").value.trim() || "Mkeka mpya",
        selections,
        totalOdds: Number((selections.length ? 1.65 ** selections.length : 1).toFixed(2)),
        status: "DRAFT",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      closeModal();
      notify("Mkeka umehifadhiwa kwenye Firestore.");
    } catch (firestoreError) {
      notify(firestoreError?.message || "Imeshindikana kuhifadhi draft.", "error");
    }
  });
}

function wirePage() {
  document.querySelectorAll(".profile-button").forEach((button) => button.addEventListener("click", () => currentUser ? showAccountModal() : showAuthModal()));
  document.querySelectorAll(".primary-button").forEach((button) => {
    if (button.closest(".modal")) return;
    button.addEventListener("click", showDraftModal);
  });
  document.querySelectorAll(".match-card, .picks button").forEach((button) => button.addEventListener("click", () => {
    const label = button.textContent.replace(/\s+/g, " ").trim().replace(/\+ ongeza$/, "");
    if (!selections.includes(label)) selections.push(label);
    notify("Selection imeongezwa kwenye mkeka.");
  }));
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  document.querySelectorAll(".profile-button").forEach((button) => {
    const copy = button.querySelector(".profile-copy");
    if (copy) {
      copy.querySelector("b").textContent = user?.displayName || "Karibu";
      copy.querySelector("small").textContent = user ? "Akaunti yangu" : "Ingia / Jisajili";
    }
  });
});

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wirePage);
else wirePage();
