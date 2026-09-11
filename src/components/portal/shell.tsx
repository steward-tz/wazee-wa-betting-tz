import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const navItems = [
  { to: "/", label: "Mwanzo", dot: "bg-coral" },
  { to: "/huduma", label: "Huduma zote", dot: "bg-lagoon" },
  { to: "/arifa", label: "Matukio na arifa", dot: "bg-lagoon" },
  { to: "/wateja", label: "Usajili wa wateja", dot: "bg-lagoon" },
  { to: "/msaada", label: "Msaada na mawasiliano", dot: "bg-lagoon" },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-card/70">
      <div className="flex items-center gap-3 px-7 py-7">
        <div className="brand-gradient grid size-11 place-items-center rounded-2xl font-display text-lg font-bold text-white">
          H
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-semibold">Huduma za Mtandaoni</p>
          <p className="text-[11px] tracking-wide text-muted-foreground">Digital Services Portal</p>
        </div>
      </div>

      <nav className="mt-2 space-y-1 px-4">
        {navItems.map(({ to, label, dot }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={
                active
                  ? "flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-brand-deep"
                  : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground/70 transition-colors hover:bg-accent"
              }
            >
              <span className={`size-2 rounded-full ${active ? "bg-coral" : dot}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mt-auto mb-6 rounded-2xl border border-border bg-gradient-to-br from-accent to-card p-4">
        <p className="mb-1 text-xs font-semibold text-brand-deep">Karibu tena, mgeni</p>
        <p className="text-[11px] text-muted-foreground">Ingia ili kuona tokeni na historia yako</p>
      </div>
    </div>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-card shadow-xl">
            <button
              aria-label="Funga menyu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-accent"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Mobile top bar with menu button */}
        <div className="flex items-center gap-3 border-b border-border bg-card/60 px-4 py-3 md:hidden">
          <button
            aria-label="Fungua menyu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-accent"
          >
            <Menu size={20} />
          </button>
          <p className="font-display text-sm font-semibold">Huduma za Mtandaoni</p>
        </div>
        {children}
      </div>
    </div>
  );
}
