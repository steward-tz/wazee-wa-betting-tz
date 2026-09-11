import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { whatsappUrl, type ServiceCatalogItem } from "@/lib/catalog";
import { ServiceIcon } from "./service-icon";

const iconVariants = [
  "brand-gradient text-white",
  "coral-gradient text-white",
  "bg-lagoon-light text-brand-deep",
];

export function ServiceCard({
  service,
  variant = 0,
}: {
  service: ServiceCatalogItem;
  variant?: number;
}) {
  const locked = service.kind === "locked";

  const handleClick = () => {
    if (locked) {
      toast.info("Huduma hii inasubiri kufunguliwa.");
      return;
    }
    if (service.kind === "paid") {
      toast.info(`Huduma hii itatumia tokeni ${service.tokenCost}. Nunua tokeni kupitia WhatsApp.`, {
        action: { label: "WhatsApp", onClick: () => window.open(whatsappUrl, "_blank", "noopener,noreferrer") },
      });
      return;
    }
    toast.success("Huduma ya bure — inafunguliwa hivi karibuni.");
  };

  return (
    <button
      onClick={handleClick}
      className={`group rounded-2xl border p-5 text-left transition ${
        locked
          ? "border-border bg-card/60 opacity-70"
          : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/40"
      }`}
    >
      <div
        className={`grid size-11 place-items-center rounded-xl ${
          locked ? "bg-muted text-muted-foreground" : iconVariants[variant % iconVariants.length]
        }`}
      >
        {locked ? <LockKeyhole size={20} strokeWidth={1.9} /> : <ServiceIcon name={service.icon} />}
      </div>
      <p className="mt-4 text-sm font-semibold">{service.name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
      <p
        className={`mt-3 text-xs font-semibold ${
          locked ? "text-muted-foreground" : service.kind === "free" ? "text-coral" : "text-brand-deep"
        }`}
      >
        {locked ? "Imefungwa" : service.kind === "free" ? "Bure" : `Tokeni ${service.tokenCost}`}
      </p>
    </button>
  );
}
