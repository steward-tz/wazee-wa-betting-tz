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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
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
let currentProfile = null;
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
    ${registering ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label>First name<input data-first-name placeholder="Juma" /></label><label>Last name<input data-last-name placeholder="Mzee" /></label></div><label>Username<input data-username placeholder="mzee_wa_odds" /></label><label>Phone number<input data-phone type="tel" placeholder="+255 7XX XXX XXX" /></label>' : ""}
    <label>Barua pepe<input data-email type="email" placeholder="username@mfano.com" /></label>
    <label>Password<input data-password type="password" placeholder="Angalau herufi 8" /></label>
    ${registering ? '<label>Confirm password<input data-confirm-password type="password" placeholder="Rudia password" /></label>' : ""}
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
    const firstName = modal.querySelector("[data-first-name]")?.value.trim() || "";
    const lastName = modal.querySelector("[data-last-name]")?.value.trim() || "";
    const username = modal.querySelector("[data-username]")?.value.trim().toLowerCase() || "";
    const phone = modal.querySelector("[data-phone]")?.value.trim() || "";
    const confirmPassword = modal.querySelector("[data-confirm-password]")?.value || "";
    const error = modal.querySelector("[data-error]");
    error.style.display = "none";
    try {
      if (registering) {
        if (!firstName || !lastName || !username || !email || !phone || !password || !confirmPassword) throw new Error("Jaza fields zote za usajili.");
        if (!/^[a-z0-9_]{3,24}$/.test(username)) throw new Error("Username iwe na herufi ndogo, namba au underscore (3–24).");
        if (password.length < 8) throw new Error("Password iwe na angalau herufi 8.");
        if (password !== confirmPassword) throw new Error("Password hazifanani.");
        if (!/^\+?[0-9\s-]{9,18}$/.test(phone)) throw new Error("Weka namba ya simu iliyo sahihi.");
        if ((await getDoc(doc(db, "usernames", username))).exists()) throw new Error("Username hiyo tayari inatumika.");
      }
      const result = registering
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      const displayName = registering ? `${firstName} ${lastName}`.trim() : result.user.displayName || email.split("@")[0];
      const existingProfile = registering ? null : await getDoc(doc(db, "users", result.user.uid));
      const existingRole = existingProfile?.exists() ? existingProfile.data().role || "USER" : "USER";
      if (registering) await updateProfile(result.user, { displayName });
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        firstName: registering ? firstName : result.user.displayName?.split(" ")[0] || displayName,
        lastName: registering ? lastName : result.user.displayName?.split(" ").slice(1).join(" ") || "",
        displayName,
        ...(registering ? { username, phone, role: "USER" } : { role: existingRole }),
        updatedAt: serverTimestamp(),
        ...(registering ? { createdAt: serverTimestamp() } : {}),
      }, { merge: true });
      if (registering) await setDoc(doc(db, "usernames", username), { uid: result.user.uid, username, createdAt: serverTimestamp() });
      closeModal();
      notify(registering ? "Akaunti imetengenezwa." : "Umeingia kwa mafanikio.");
    } catch (authError) {
      error.textContent = authError?.code === "permission-denied"
        ? "Firestore Rules hazijaruhusu usajili. Publish firestore.rules kwenye Firebase project wazee-wa-betting-tz-e7183, kisha jaribu tena."
        : authError?.message || "Imeshindikana kuingia.";
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

async function readDashboardData(uid, publicOnly = false) {
  const ticketQuery = publicOnly
    ? query(collection(db, "tickets"), where("creatorId", "==", uid), where("visibility", "==", "PUBLIC"))
    : query(collection(db, "tickets"), where("creatorId", "==", uid));
  const draftsRequest = publicOnly ? Promise.resolve({ docs: [] }) : getDocs(collection(db, "users", uid, "drafts"));
  const savedRequest = publicOnly ? Promise.resolve({ docs: [] }) : getDocs(query(collection(db, "savedTickets"), where("userId", "==", uid)));
  const [profileSnapshot, ticketsSnapshot, draftsSnapshot, savedSnapshot, followersSnapshot, followingSnapshot] = await Promise.all([
    getDoc(doc(db, "users", uid)),
    getDocs(ticketQuery),
    draftsRequest,
    savedRequest,
    getDocs(query(collection(db, "followers"), where("followedId", "==", uid))),
    getDocs(query(collection(db, "followers"), where("followerId", "==", uid))),
  ]);
  const tickets = ticketsSnapshot.docs.map((ticket) => ({ id: ticket.id, ...ticket.data() }));
  const statuses = tickets.map((ticket) => String(ticket.status || "PENDING").toUpperCase());
  const won = statuses.filter((status) => status === "WON").length;
  const lost = statuses.filter((status) => status === "LOST").length;
  const pending = statuses.filter((status) => !["WON", "LOST"].includes(status)).length;
  return {
    profile: profileSnapshot.exists() ? profileSnapshot.data() : {},
    tickets,
    drafts: draftsSnapshot.docs.map((draft) => ({ id: draft.id, ...draft.data() })),
    saved: savedSnapshot.docs.map((ticket) => ({ id: ticket.id, ...ticket.data() })),
    won,
    lost,
    pending,
    winRate: won + lost ? `${Math.round((won / (won + lost)) * 100)}%` : "—",
    followers: followersSnapshot.size,
    following: followingSnapshot.size,
  };
}

function statMarkup(label, value) {
  return `<div class="stat-card"><div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div></div>`;
}

async function showDashboardModal() {
  if (!currentUser) return showAuthModal();
  closeModal();
  const modal = document.createElement("div");
  modal.className = "modal-backdrop firebase-modal";
  modal.innerHTML = '<div class="modal" data-modal-panel><p>Inapakia dashboard...</p></div>';
  document.body.appendChild(modal);
  try {
    const data = await readDashboardData(currentUser.uid);
    currentProfile = data.profile;
    const profile = data.profile;
    modal.querySelector("[data-modal-panel]").innerHTML = `<div class="modal-head"><div><span class="section-kicker">USER DASHBOARD</span><h2>${escapeHtml(profile.displayName || currentUser.email || "Mwanachama")}</h2><p>@${escapeHtml(profile.username || "username")} · ${escapeHtml(profile.role || "USER")}</p></div><button data-close>×</button></div>
      <div class="dashboard-stats">${statMarkup("Tickets", data.tickets.length)}${statMarkup("Won", data.won)}${statMarkup("Lost", data.lost)}${statMarkup("Pending", data.pending)}${statMarkup("Win rate", data.winRate)}${statMarkup("Followers", data.followers)}${statMarkup("Following", data.following)}</div>
      <div class="dashboard-actions"><button class="primary-button" data-create-ticket>Create Ticket</button><button class="ghost-button" data-public-profile>Public profile</button><button class="ghost-button" data-logout>Logout</button></div>
      <div class="dashboard-section"><span class="section-kicker">PROFILE</span><div class="profile-fields"><label>First name<input data-first-name value="${escapeHtml(profile.firstName || "")}" /></label><label>Last name<input data-last-name value="${escapeHtml(profile.lastName || "")}" /></label><label>Username<input value="${escapeHtml(profile.username || "")}" disabled /></label><label>Email<input value="${escapeHtml(profile.email || currentUser.email || "")}" disabled /></label><label>Phone<input data-phone value="${escapeHtml(profile.phone || "")}" /></label><label>Bio<input data-bio value="${escapeHtml(profile.bio || "")}" /></label></div><button class="ghost-button full" data-save-profile>Save profile</button></div>
      <div class="dashboard-section"><span class="section-kicker">MY TICKETS</span><div data-ticket-list>${data.tickets.length ? data.tickets.map((ticket) => `<div class="selection-row"><span>${escapeHtml(ticket.title || "Untitled ticket")}</span><b>${escapeHtml(ticket.status || "PENDING")}</b></div>`).join("") : '<div class="empty-slip">Bado hujapublish ticket yoyote.</div>'}</div></div>
      <div class="dashboard-section"><span class="section-kicker">SAVED TICKETS</span><div>${data.saved.length ? data.saved.map((ticket) => `<div class="selection-row"><span>${escapeHtml(ticket.title || ticket.ticketId || "Saved ticket")}</span></div>`).join("") : '<div class="empty-slip">Hakuna saved tickets bado.</div>'}</div></div>
      <label style="text-align:left">Profile image<input data-avatar type="file" accept="image/*" /></label><button class="ghost-button full" data-upload>Upload picha</button>`;
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest("[data-close]")) closeModal();
    });
    modal.querySelector("[data-logout]").addEventListener("click", async () => { await signOut(auth); closeModal(); notify("Umetoka kwenye akaunti."); });
    modal.querySelector("[data-create-ticket]").addEventListener("click", showDraftModal);
    modal.querySelector("[data-public-profile]").addEventListener("click", () => { if (profile.username) location.href = `?profile=${encodeURIComponent(profile.username)}`; else notify("Username haijawekwa.", "error"); });
    modal.querySelector("[data-save-profile]").addEventListener("click", async () => {
      const firstName = modal.querySelector("[data-first-name]").value.trim();
      const lastName = modal.querySelector("[data-last-name]").value.trim();
      const phone = modal.querySelector("[data-phone]").value.trim();
      const bio = modal.querySelector("[data-bio]").value.trim();
      if (!firstName || !lastName) return notify("First name na last name zinahitajika.", "error");
      try { await updateDoc(doc(db, "users", currentUser.uid), { firstName, lastName, phone, bio, displayName: `${firstName} ${lastName}`, updatedAt: serverTimestamp() }); await updateProfile(currentUser, { displayName: `${firstName} ${lastName}` }); currentProfile = { ...currentProfile, firstName, lastName, phone, bio, displayName: `${firstName} ${lastName}` }; notify("Profile imehifadhiwa."); } catch (profileError) { notify(profileError?.message || "Profile haijahifadhiwa.", "error"); }
    });
    modal.querySelector("[data-upload]").addEventListener("click", async () => {
      const file = modal.querySelector("[data-avatar]").files[0];
      if (!file) return notify("Chagua picha kwanza.", "error");
      if (file.size > 5 * 1024 * 1024) return notify("Picha iwe chini ya 5 MB.", "error");
      try { const imageRef = ref(storage, `users/${currentUser.uid}/avatar-${Date.now()}-${file.name}`); await uploadBytes(imageRef, file, { contentType: file.type }); const photoURL = await getDownloadURL(imageRef); await updateDoc(doc(db, "users", currentUser.uid), { photoURL, updatedAt: serverTimestamp() }); currentProfile = { ...currentProfile, photoURL }; notify("Profile image imehifadhiwa."); } catch (storageError) { notify(storageError?.message || "Upload imeshindikana.", "error"); }
    });
  } catch (dashboardError) {
    modal.querySelector("[data-modal-panel]").innerHTML = `<div class="modal-head"><h2>Dashboard haijapatikana</h2><button data-close>×</button></div><p class="modal-error">${escapeHtml(dashboardError?.message || "Jaribu tena baadaye.")}</p>`;
    modal.querySelector("[data-close]").addEventListener("click", closeModal);
  }
}

async function showPublicProfile(username) {
  closeModal();
  const modal = document.createElement("div");
  modal.className = "modal-backdrop firebase-modal";
  modal.innerHTML = '<div class="modal" data-modal-panel><p>Inapakia profile...</p></div>';
  document.body.appendChild(modal);
  try {
    const usernameSnapshot = await getDoc(doc(db, "usernames", username.toLowerCase()));
    if (!usernameSnapshot.exists()) throw new Error("Profile hii haikupatikana.");
    const uid = usernameSnapshot.data().uid;
    const data = await readDashboardData(uid, true);
    const profile = data.profile;
    const followId = currentUser ? `${currentUser.uid}_${uid}` : null;
    const alreadyFollowing = followId ? (await getDoc(doc(db, "followers", followId))).exists() : false;
    modal.querySelector("[data-modal-panel]").innerHTML = `<div class="modal-head"><div><span class="section-kicker">PUBLIC PROFILE</span><h2>${escapeHtml(profile.displayName || `@${username}`)}</h2><p>@${escapeHtml(profile.username || username)}</p></div><button data-close>×</button></div><p>${escapeHtml(profile.bio || "Mwanachama wa Wazee wa Betting TZ.")}</p><div class="dashboard-stats">${statMarkup("Tickets", data.tickets.length)}${statMarkup("Won", data.won)}${statMarkup("Lost", data.lost)}${statMarkup("Pending", data.pending)}${statMarkup("Win rate", data.winRate)}${statMarkup("Followers", data.followers)}${statMarkup("Following", data.following)}</div><button class="primary-button full" data-follow>${alreadyFollowing ? "Unfollow" : "Follow"}</button><div class="dashboard-section"><span class="section-kicker">MY TICKETS</span><div>${data.tickets.length ? data.tickets.map((ticket) => `<div class="selection-row"><span>${escapeHtml(ticket.title || "Untitled ticket")}</span><b>${escapeHtml(ticket.status || "PENDING")}</b></div>`).join("") : '<div class="empty-slip">Hakuna public tickets bado.</div>'}</div></div>`;
    modal.addEventListener("click", (event) => { if (event.target === modal || event.target.closest("[data-close]")) closeModal(); });
    modal.querySelector("[data-follow]").addEventListener("click", async () => {
      if (!currentUser) return showAuthModal();
      try {
        if (alreadyFollowing) await deleteDoc(doc(db, "followers", followId));
        else await setDoc(doc(db, "followers", followId), { followerId: currentUser.uid, followedId: uid, createdAt: serverTimestamp() });
        notify(alreadyFollowing ? "Umeacha kufollow." : "Umeanza kufollow creator.");
        await showPublicProfile(username);
      } catch (followError) { notify(followError?.message || "Follow action imeshindikana.", "error"); }
    });
  } catch (profileError) {
    modal.querySelector("[data-modal-panel]").innerHTML = `<div class="modal-head"><h2>Profile haijapatikana</h2><button data-close>×</button></div><p class="modal-error">${escapeHtml(profileError?.message || "Jaribu tena baadaye.")}</p>`;
    modal.querySelector("[data-close]").addEventListener("click", closeModal);
  }
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
  document.querySelectorAll(".profile-button").forEach((button) => button.addEventListener("click", () => currentUser ? showDashboardModal() : showAuthModal()));
  document.querySelectorAll(".primary-button").forEach((button) => {
    if (button.closest(".modal")) return;
    button.addEventListener("click", showDraftModal);
  });
  document.querySelectorAll(".match-card, .picks button").forEach((button) => button.addEventListener("click", () => {
    const label = button.textContent.replace(/\s+/g, " ").trim().replace(/\+ ongeza$/, "");
    if (!selections.includes(label)) selections.push(label);
    notify("Selection imeongezwa kwenye mkeka.");
  }));
  const profileUsername = new URLSearchParams(location.search).get("profile");
  if (profileUsername) showPublicProfile(profileUsername);
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  currentProfile = null;
  if (user) getDoc(doc(db, "users", user.uid)).then((snapshot) => { currentProfile = snapshot.exists() ? snapshot.data() : null; });
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
