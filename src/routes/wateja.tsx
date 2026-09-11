import { createFileRoute } from "@tanstack/react-router";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PortalShell } from "@/components/portal/shell";

export const Route = createFileRoute("/wateja")({
  head: () => ({
    meta: [
      { title: "Usajili wa wateja — Huduma za Mtandaoni" },
      { name: "description", content: "Jisajili kupata huduma za kiraia mtandaoni kwa tokeni." },
      { property: "og:title", content: "Usajili wa wateja — Huduma za Mtandaoni" },
      { property: "og:description", content: "Jisajili kupata huduma za kiraia mtandaoni kwa tokeni." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = () => {
    if (!form.firstName || !form.phone) {
      toast.error("Jaza jina la kwanza na namba ya simu.");
      return;
    }
    toast.success("Ombi lako limepokelewa. Tutakuthibitishia hivi karibuni.");
    setForm({ firstName: "", lastName: "", phone: "" });
  };

  return (
    <PortalShell>
      <header className="border-b border-border bg-card/60 px-6 py-5 lg:px-10">
        <p className="font-display text-lg font-semibold">Usajili wa wateja</p>
        <p className="text-xs text-muted-foreground">Fungua akaunti ili kuanza kutumia huduma</p>
      </header>

      <div className="max-w-[560px] px-6 py-8 lg:px-10">
        <div className="rounded-3xl border border-border bg-card p-6 lg:p-8">
          <div className="brand-gradient grid size-12 place-items-center rounded-2xl text-white">
            <UserRoundPlus size={22} />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold">Jisajili sasa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Baada ya kujisajili, admin atakuthibitisha na kukupa tokeni za kuanzia.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-foreground/80">
              Jina la kwanza
              <input
                value={form.firstName}
                onChange={update("firstName")}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="text-xs font-semibold text-foreground/80">
              Jina la mwisho
              <input
                value={form.lastName}
                onChange={update("lastName")}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <label className="mt-4 block text-xs font-semibold text-foreground/80">
            Namba ya simu
            <input
              inputMode="tel"
              placeholder="0698 232 313"
              value={form.phone}
              onChange={update("phone")}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <button
            onClick={submit}
            className="brand-gradient mt-6 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Tuma ombi la usajili
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Kwa kujisajili unakubali masharti ya matumizi ya huduma hii.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
