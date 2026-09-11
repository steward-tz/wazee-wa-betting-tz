import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, PlayCircle } from "lucide-react";

import { PortalShell } from "@/components/portal/shell";
import { tutorials, whatsappUrl } from "@/lib/catalog";

export const Route = createFileRoute("/msaada")({
  head: () => ({
    meta: [
      { title: "Msaada na mawasiliano — Huduma za Mtandaoni" },
      { name: "description", content: "Pata msaada wa haraka kwa WhatsApp au simu, na mafunzo ya kutumia huduma." },
      { property: "og:title", content: "Msaada na mawasiliano — Huduma za Mtandaoni" },
      { property: "og:description", content: "Pata msaada wa haraka kwa WhatsApp au simu, na mafunzo ya kutumia huduma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <PortalShell>
      <header className="border-b border-border bg-card/60 px-6 py-5 lg:px-10">
        <p className="font-display text-lg font-semibold">Msaada na mawasiliano</p>
        <p className="text-xs text-muted-foreground">Tupo tayari kukusaidia muda wote</p>
      </header>

      <div className="max-w-[1100px] space-y-8 px-6 py-8 lg:px-10">
        <section className="grid gap-4 sm:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="whatsapp-gradient rounded-3xl p-6 text-white transition hover:brightness-105"
          >
            <MessageCircle size={24} />
            <h2 className="mt-3 font-display text-lg font-semibold">WhatsApp</h2>
            <p className="mt-1 text-sm text-white/80">
              Wasiliana nasi moja kwa moja — nunua tokeni au uliza swali.
            </p>
            <p className="mt-4 text-sm font-bold underline underline-offset-4">Fungua WhatsApp →</p>
          </a>
          <a
            href="tel:+255698232313"
            className="rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-0.5"
          >
            <Phone size={24} className="text-brand-deep" />
            <h2 className="mt-3 font-display text-lg font-semibold">Simu</h2>
            <p className="mt-1 text-sm text-muted-foreground">Piga simu kwa msaada wa haraka.</p>
            <p className="mt-4 text-sm font-bold text-brand-deep">0698 232 313</p>
          </a>
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold">Mafunzo ya haraka</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.slug}
                className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5"
              >
                <div className="grid h-24 place-items-center rounded-xl bg-accent text-brand-deep">
                  <PlayCircle size={28} strokeWidth={1.6} />
                </div>
                <p className="mt-4 text-sm font-semibold">{tutorial.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{tutorial.description}</p>
                <p className="mt-3 text-xs font-semibold text-brand-deep">
                  {tutorial.tokenCost === 0 ? "Bure" : `Tokeni ${tutorial.tokenCost}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
