export type ServiceKind = "paid" | "free" | "locked";

export type ServiceCatalogItem = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tokenCost: number;
  kind: ServiceKind;
  category: string;
};

export type TutorialItem = {
  slug: string;
  title: string;
  description: string;
  tokenCost: number;
};

export const announcementText =
  "Wasiliana na 0698232313 kwa huduma za tokeni n.k";

export const whatsappNumber = "255698232313";
export const whatsappMessage =
  "Habari Steward Tz, nataka kununua tokeni. Namba yangu ni 0723232323.";
export const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const paid = (
  slug: string,
  name: string,
  description: string,
  icon: string,
  category: string,
): ServiceCatalogItem => ({ slug, name, description, icon, category, tokenCost: 2, kind: "paid" });

const free = (
  slug: string,
  name: string,
  description: string,
  icon: string,
  category: string,
): ServiceCatalogItem => ({ slug, name, description, icon, category, tokenCost: 0, kind: "free" });

const locked = (
  slug: string,
  name: string,
  description: string,
  icon: string,
  category: string,
): ServiceCatalogItem => ({ slug, name, description, icon, category, tokenCost: 0, kind: "locked" });

export const serviceCatalog: ServiceCatalogItem[] = [
  paid("cheti-tin", "Cheti cha TIN", "Pata cheti cha TIN kwa hatua rahisi.", "file-badge", "Huduma kuu"),
  paid("thibitisha-tin", "Thibitisha TIN", "Thibitisha taarifa za TIN yako.", "badge-check", "Huduma kuu"),
  paid("nakala-nida", "Nakala laini ya NIDA", "Omba nakala laini ya kitambulisho cha NIDA.", "contact", "Huduma kuu"),
  paid("stika-lipa", "Stika za LIPA", "Pata stika za LIPA kwa matumizi yako.", "qr-code", "Huduma kuu"),
  paid("mpiga-kura", "Mpiga kura", "Huduma na taarifa za mpiga kura.", "vote", "Huduma kuu"),
  paid("leseni-biashara", "Leseni ya biashara", "Anza mchakato wa leseni ya biashara.", "store", "Huduma kuu"),
  paid("stika-mawakala", "Stika za mawakala", "Pata stika za mawakala.", "ticket", "Huduma kuu"),
  paid("nakala-nida-2", "Nakala ya NIDA 2", "Nakala nyingine ya taarifa za NIDA.", "copy", "Huduma kuu"),
  paid("leseni-udereva", "Leseni ya udereva", "Msaada wa huduma za leseni ya udereva.", "car-front", "Huduma kuu"),
  free("utafutaji-nida", "Utafutaji wa NIDA", "Tafuta taarifa za NIDA bila tokeni.", "search", "Huduma za bure"),
  free("qr-mitandao", "QR ya mitandao yote", "Tengeneza msimbo wa QR wa mitandao yako.", "qr-code", "Huduma za bure"),
  paid("brela", "BRELA", "Msaada wa huduma za BRELA.", "landmark", "Huduma kuu"),
  locked("cheti-kuzaliwa", "Cheti cha kuzaliwa", "Huduma hii inasubiri kufunguliwa.", "baby", "Huduma zilizofungwa"),
  locked("visa-pasipoti", "Visa / Pasipoti", "Huduma hii inasubiri kufunguliwa.", "plane", "Huduma zilizofungwa"),
  locked("cheti-ndoa", "Cheti cha ndoa", "Huduma hii inasubiri kufunguliwa.", "heart-handshake", "Huduma zilizofungwa"),
  locked("ripoti-hasara", "Ripoti ya hasara", "Huduma hii inasubiri kufunguliwa.", "file-warning", "Huduma zilizofungwa"),
  paid("tengeneza-muziki", "Tengeneza muziki", "Tengeneza wazo la muziki wa kipekee.", "music-2", "Zana za ziada"),
  paid("tafuta-picha", "Tafuta picha", "Tafuta picha kwa matumizi yako.", "image", "Zana za ziada"),
  paid("simu-ya-tafuta", "Simu ya tafuta", "Pata msaada wa utafutaji wa simu.", "smartphone", "Zana za ziada"),
  paid("ondoa-usuli", "Ondoa usuli", "Ondoa usuli wa picha.", "scan-face", "Zana za ziada"),
  paid("wasifu", "Wasifu wa kuvutia", "Tengeneza wasifu wa kuvutia.", "user-round-pen", "Zana za ziada"),
  paid("nembo", "Nembo ya kipekee", "Tengeneza wazo la nembo.", "palette", "Zana za ziada"),
  paid("radio-maria", "Radio Maria", "Fungua Radio Maria kwa urahisi.", "radio", "Zana za ziada"),
  paid("simba-sc", "Simba SC", "Habari na huduma za Simba SC.", "trophy", "Zana za ziada"),
  paid("yanga-africans", "Yanga Africans", "Habari na huduma za Yanga Africans.", "star", "Zana za ziada"),
  paid("azam-tv", "Azam TV", "Fungua huduma ya Azam TV.", "tv", "Zana za ziada"),
];

export const specialServices = [
  { slug: "tic-tech", name: "Jiunge na kikundi cha TIC Tech", note: "WhatsApp", tone: "lagoon", action: "whatsapp" },
  { slug: "kikundi-bure", name: "Kikundi cha bure", note: "Bure kabisa", tone: "lagoon", action: "whatsapp" },
  { slug: "botani-biashara", name: "Batani ya biashara", note: "Programu ya kujionyesha", tone: "coral", action: "contact" },
  { slug: "kikundi-vip", name: "Kikundi VIP — 5,000", note: "Kulipia", tone: "coral", action: "contact" },
  { slug: "vip-usajili", name: "VIP ya usajili", note: "Lipia muda mrefu", tone: "coral", action: "contact" },
  { slug: "tangazo", name: "Lipia tangazo lako", note: "Litangazwe hapa", tone: "coral", action: "contact" },
] as const;

export const tutorials: TutorialItem[] = [
  { slug: "lipa-vodacom", title: "Kusajili Lipa Namba Vodacom", description: "Jifunze hatua za kusajili Lipa Namba Vodacom.", tokenCost: 2 },
  { slug: "download-tin", title: "Jinsi ya kupakua TIN", description: "Mwongozo wa kupakua cheti cha TIN.", tokenCost: 2 },
  { slug: "nunua-tokeni", title: "Kununua tokeni kwa WhatsApp", description: "Hatua rahisi za kupata tokeni zako.", tokenCost: 0 },
];
