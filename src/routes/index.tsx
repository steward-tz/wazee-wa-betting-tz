import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Search } from "lucide-react";

import { PortalShell } from "@/components/portal/shell";
import { ServiceCard } from "@/components/portal/service-card";
import { serviceCatalog, specialServices, whatsappUrl } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Huduma za Mtandaoni — Huduma za kiraia mtandaoni" },
      {
        name: "description",
        content:
          "Pata huduma za kiraia mtandaoni — NIDA, TIN, leseni, vyeti na zaidi. Haraka, salama, kwa tokeni.",
      },
      { property: "og:title", content: "Huduma za Mtandaoni — Huduma za kiraia mtandaoni" },
      {
        property: "og:description",
        content: "Pata huduma za kiraia mtandaoni — NIDA, TIN, leseni, vyeti na zaidi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const announcements = [
  {
    day: "18",
    month: "Julai",
    title: "Matengenezo ya mfumo — huduma zimesimama kwa muda",
    body: "Tunaboresha usalama wa usajili. Huduma zitarudi saa 4 jioni.",
  },
  {
    day: "09",
    month: "Julai",
    title: "Njia mpya ya kupata huduma za pasipoti",
    body: "Sasa unaweza kufuatilia ombi lako la safari kabla ya kwenda ofisini.",
  },
  {
    day: "27",
    month: "Juni",
    title: "Punguzo la huduma za familia",
    body: "Punguzo la asilimia 15 kwa huduma kadhaa za familia. Tumia sasa.",
  },
];

function HomePage() {
  const featured = serviceCatalog.slice(0, 7);

  return (
    <PortalShell>
      {/* Topbar */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-5 lg:px-10">
        <div>
          <p className="font-display text-lg font-semibold">Habari, karibu</p>
          <p className="text-xs text-muted-foreground">Huduma zote zinafanya kazi</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/huduma"
            className="hidden items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-accent sm:flex"
          >
            <Search size={15} /> Tafuta huduma…
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="brand-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white"
          >
            Nunua tokeni
          </a>
        </div>
      </header>

      <div className="max-w-[1400px] space-y-8 px-6 py-8 lg:px-10">
        {/* Hero */}
        <section className="lagoon-hero relative rounded-3xl p-8 lg:p-10">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Mfumo wa huduma mtandaoni
            </span>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] text-white lg:text-[2.6rem]">
              Huduma za kiraia, mtandaoni kwa urahisi.
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/85">
              Nunua tokeni, chagua huduma, na kamilisha kwa dakika chache — bila safari hadi ofisini.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/huduma"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm"
              >
                Anza huduma
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white"
              >
                Nunua tokeni
              </a>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex items-end justify-between lg:mt-8">
            <div className="min-w-[220px] rounded-2xl bg-white/90 px-6 py-5 shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-deep/70">
                Salio la tokeni
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-ink">0 tokeni</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-accent">
                <div className="h-full w-[8%] rounded-full bg-gradient-to-r from-lagoon to-coral" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Ingia au nunua tokeni ili kuanza
              </p>
            </div>
            <div className="hidden text-right text-xs leading-relaxed text-white/90 sm:block">
              <p className="font-display text-sm font-semibold text-white">
                {serviceCatalog.length} huduma
              </p>
              <p className="text-white/70">zipo mtandaoni</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Huduma zilizopo</h2>
            <Link to="/huduma" className="text-sm font-semibold text-brand-deep hover:underline">
              Zote →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((service, i) => (
              <ServiceCard key={service.slug} service={service} variant={i} />
            ))}
            <Link
              to="/huduma"
              className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/40 p-5 text-center transition hover:bg-accent"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-xl font-display font-bold text-brand-deep">
                +
              </div>
              <p className="mt-4 text-sm font-semibold">Huduma zaidi</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {serviceCatalog.length - featured.length} zaidi zipo
              </p>
            </Link>
          </div>
        </section>

        {/* Announcements + WhatsApp CTA */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Matukio na arifa</h2>
              <Link
                to="/arifa"
                className="rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold text-coral"
              >
                Zote
              </Link>
            </div>
            <div className="space-y-3">
              {announcements.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-2xl bg-background/70 p-4">
                  <div className="w-14 shrink-0 text-center">
                    <p className="font-display text-lg font-bold text-brand-deep">{item.day}</p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {item.month}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="whatsapp-gradient flex flex-col rounded-3xl p-6 text-white">
            <span className="inline-block w-max rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
              Huduma maalum
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">Nunua tokeni moja kwa moja</h2>
            <p className="mt-2 text-sm text-white/80">
              Jaza tokeni zako kwa WhatsApp — haraka, salama, na msaada wa moja kwa moja.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/90">
              <li className="flex gap-2"><span className="text-lagoon-light">✓</span> Uwasilishaji wa haraka</li>
              <li className="flex gap-2"><span className="text-lagoon-light">✓</span> Malipo salama</li>
              <li className="flex gap-2"><span className="text-lagoon-light">✓</span> Msaada wa muda wote</li>
            </ul>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-coral px-5 py-3 text-center text-sm font-bold text-ink transition hover:brightness-105"
            >
              <MessageCircle size={16} /> Nunua tokeni kwa WhatsApp
            </a>
            <p className="mt-3 text-[11px] text-white/60">Wastani wa kumaliza: chini ya dakika 2</p>
          </div>
        </section>

        {/* Special services */}
        <section className="rounded-3xl border border-border bg-gradient-to-br from-accent to-coral-soft/40 p-6 lg:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Huduma maalum</h2>
              <p className="text-xs text-muted-foreground">Huduma za ziada kwa mahitaji maalum</p>
            </div>
            <Link to="/msaada" className="flex items-center gap-1 text-sm font-semibold text-brand-deep hover:underline">
              Zaidi <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {specialServices.slice(0, 3).map((item) => (
              <a
                key={item.slug}
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5"
              >
                <p className={`text-xs font-semibold uppercase ${item.tone === "coral" ? "text-coral" : "text-brand-deep"}`}>
                  {item.note}
                </p>
                <p className="mt-2 text-sm font-semibold">{item.name}</p>
              </a>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 pb-4 pt-2 text-xs text-muted-foreground">
          <p>© 2026 Huduma za Mtandaoni — huduma salama, haraka na rahisi.</p>
          <div className="flex gap-5">
            <Link to="/msaada" className="hover:text-brand-deep">Msaada</Link>
            <Link to="/arifa" className="hover:text-brand-deep">Arifa</Link>
            <Link to="/huduma" className="hover:text-brand-deep">Huduma</Link>
          </div>
        </footer>
      </div>
    </PortalShell>
  );
}
