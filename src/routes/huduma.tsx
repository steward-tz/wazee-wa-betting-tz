import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PortalShell } from "@/components/portal/shell";
import { ServiceCard } from "@/components/portal/service-card";
import { serviceCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/huduma")({
  head: () => ({
    meta: [
      { title: "Huduma zote — Huduma za Mtandaoni" },
      { name: "description", content: "Orodha kamili ya huduma za kiraia mtandaoni — NIDA, TIN, leseni, vyeti na zana za ziada." },
      { property: "og:title", content: "Huduma zote — Huduma za Mtandaoni" },
      { property: "og:description", content: "Orodha kamili ya huduma za kiraia mtandaoni." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? serviceCatalog.filter(
          (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
        )
      : serviceCatalog;
    const map = new Map<string, typeof filtered>();
    for (const service of filtered) {
      const list = map.get(service.category) ?? [];
      list.push(service);
      map.set(service.category, list);
    }
    return [...map.entries()];
  }, [query]);

  return (
    <PortalShell>
      <header className="border-b border-border bg-card/60 px-6 py-5 lg:px-10">
        <p className="font-display text-lg font-semibold">Huduma zote</p>
        <p className="text-xs text-muted-foreground">{serviceCatalog.length} huduma zinapatikana</p>
      </header>

      <div className="max-w-[1400px] space-y-8 px-6 py-8 lg:px-10">
        <label className="flex max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
          <Search size={17} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tafuta huduma — NIDA, TIN, leseni…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        {grouped.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Hakuna huduma inayolingana na utafutaji wako.
          </p>
        )}

        {grouped.map(([category, services]) => (
          <section key={category}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">{category}</h2>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-brand-deep">
                {services.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {services.map((service, i) => (
                <ServiceCard key={service.slug} service={service} variant={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PortalShell>
  );
}
