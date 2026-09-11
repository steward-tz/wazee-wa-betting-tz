import { createFileRoute } from "@tanstack/react-router";

import { PortalShell } from "@/components/portal/shell";
import { announcementText } from "@/lib/catalog";

export const Route = createFileRoute("/arifa")({
  head: () => ({
    meta: [
      { title: "Matukio na arifa — Huduma za Mtandaoni" },
      { name: "description", content: "Arifa na taarifa mpya kutoka Huduma za Mtandaoni." },
      { property: "og:title", content: "Matukio na arifa — Huduma za Mtandaoni" },
      { property: "og:description", content: "Arifa na taarifa mpya kutoka Huduma za Mtandaoni." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnnouncementsPage,
});

const events = [
  {
    day: "18",
    month: "Julai",
    tag: "Matengenezo",
    title: "Matengenezo ya mfumo — huduma zimesimama kwa muda",
    body: "Tunaboresha usalama wa usajili. Huduma zitarudi saa 4 jioni. Samahani kwa usumbufu wowote.",
  },
  {
    day: "09",
    month: "Julai",
    tag: "Mpya",
    title: "Njia mpya ya kupata huduma za pasipoti",
    body: "Sasa unaweza kufuatilia ombi lako la safari kabla ya kwenda ofisini. Tumia sehemu ya huduma kuu.",
  },
  {
    day: "27",
    month: "Juni",
    tag: "Punguzo",
    title: "Punguzo la huduma za familia",
    body: "Punguzo la asilimia 15 kwa huduma kadhaa za familia. Tumia sasa kabla ya mwisho wa mwezi.",
  },
  {
    day: "15",
    month: "Juni",
    tag: "Taarifa",
    title: "Mfumo mpya wa tokeni umezinduliwa",
    body: "Tokeni sasa zinatumika kwa huduma zote za kulipia. Kila upakuaji hukata tokeni 2.",
  },
];

function AnnouncementsPage() {
  return (
    <PortalShell>
      <header className="border-b border-border bg-card/60 px-6 py-5 lg:px-10">
        <p className="font-display text-lg font-semibold">Matukio na arifa</p>
        <p className="text-xs text-muted-foreground">{announcementText}</p>
      </header>

      <div className="max-w-[900px] space-y-4 px-6 py-8 lg:px-10">
        {events.map((event) => (
          <article key={event.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="w-14 shrink-0 text-center">
              <p className="font-display text-xl font-bold text-brand-deep">{event.day}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{event.month}</p>
            </div>
            <div>
              <span className="rounded-full bg-coral-soft px-2.5 py-0.5 text-[11px] font-semibold text-coral">
                {event.tag}
              </span>
              <h2 className="mt-2 text-sm font-semibold">{event.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{event.body}</p>
            </div>
          </article>
        ))}
      </div>
    </PortalShell>
  );
}
