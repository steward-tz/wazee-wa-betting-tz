import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  type Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  type Firestore,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type FirebaseStorage,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyCMWh-yKE13mQ-SRA3lDugpHXV1kuVMBK8",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "wazee-wa-betting-tz-e7183.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "wazee-wa-betting-tz-e7183",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "wazee-wa-betting-tz-e7183.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "790161817035",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:790161817035:web:f217cebf1fca1dcb240a4e",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);

let authInstance: Auth | null = null;
export function getFirebaseAuth() {
  if (typeof window === "undefined") return null;
  authInstance ??= getAuth(firebaseApp);
  return authInstance;
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return auth ? onAuthStateChanged(auth, callback) : () => undefined;
}

export async function registerWithEmail(
  email: string,
  password: string,
  profile: { firstName: string; lastName: string; username: string; phone: string },
) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth inapatikana kwenye browser pekee.");
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const displayName = `${profile.firstName} ${profile.lastName}`.trim();
  if (displayName) await updateProfile(result.user, { displayName });
  await setDoc(doc(firestore, "users", result.user.uid), {
    uid: result.user.uid,
    email: result.user.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    phone: profile.phone,
    displayName: displayName || email.split("@")[0],
    role: "USER",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return result.user;
}

export async function loginWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth inapatikana kwenye browser pekee.");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function loginWithGoogle() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth inapatikana kwenye browser pekee.");
  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  await setDoc(
    doc(firestore, "users", result.user.uid),
    {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return result.user;
}

export async function logout() {
  const auth = getFirebaseAuth();
  if (auth) await signOut(auth);
}

export async function saveBettingDraft(
  uid: string,
  draft: { title: string; selections: string[]; totalOdds: number },
) {
  return addDoc(collection(firestore, "users", uid, "drafts"), {
    ...draft,
    status: "DRAFT",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function uploadProfileImage(uid: string, file: File) {
  const imageRef = ref(storage, `users/${uid}/avatar-${Date.now()}-${file.name}`);
  await uploadBytes(imageRef, file, { contentType: file.type });
  const photoURL = await getDownloadURL(imageRef);
  await setDoc(
    doc(firestore, "users", uid),
    { photoURL, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return photoURL;
}
