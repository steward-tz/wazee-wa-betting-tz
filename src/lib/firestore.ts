import {
  addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp,
  setDoc, where,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { calculateTotalOdds, type Selection } from "./betting";

export type PublicTicket = {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  creatorPhotoURL?: string;
  title: string;
  description?: string;
  sport: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  visibility: "PUBLIC" | "PRIVATE";
  access: "FREE" | "VIP";
  totalOdds: number;
  status: string;
  selectionCount: number;
  createdAt?: unknown;
};

export async function createTicket(input: {
  uid: string;
  username: string;
  displayName: string;
  photoURL?: string;
  title: string;
  description?: string;
  sport: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  visibility: "PUBLIC" | "PRIVATE";
  access: "FREE" | "VIP";
  selections: Selection[];
}) {
  if (!input.selections.length) throw new Error("Ongeza angalau selection moja.");
  const totalOdds = calculateTotalOdds(input.selections);
  const ref = await addDoc(collection(firestore, "tickets"), {
    creatorId: input.uid,
    creatorUsername: input.username,
    creatorName: input.displayName,
    creatorPhotoURL: input.photoURL ?? null,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    sport: input.sport,
    risk: input.risk,
    visibility: input.visibility,
    access: input.access,
    totalOdds,
    status: "PENDING",
    selectionCount: input.selections.length,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await Promise.all(input.selections.map((selection, index) =>
    setDoc(doc(firestore, "tickets", ref.id, "selections", String(index + 1)), {
      ...selection,
      odds: Number(selection.odds),
      status: "PENDING",
      createdAt: serverTimestamp(),
    }),
  ));
  return ref.id;
}

export async function listPublicTickets(max = 20) {
  const snap = await getDocs(query(
    collection(firestore, "tickets"),
    where("visibility", "==", "PUBLIC"),
    orderBy("createdAt", "desc"),
    limit(max),
  ));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() })) as PublicTicket[];
}

export async function listMatches(max = 30) {
  const snap = await getDocs(query(collection(firestore, "matches"), orderBy("kickoffAt", "asc"), limit(max)));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getTicket(ticketId: string) {
  const ticket = await getDoc(doc(firestore, "tickets", ticketId));
  if (!ticket.exists()) return null;
  const selections = await getDocs(query(collection(firestore, "tickets", ticketId, "selections"), orderBy("createdAt", "asc")));
  return {
    id: ticket.id,
    ...ticket.data(),
    selections: selections.docs.map((item) => ({ id: item.id, ...item.data() })),
  };
}

export async function getUserProfile(uid: string) {
  const snap = await getDoc(doc(firestore, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
