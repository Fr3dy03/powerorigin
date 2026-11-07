import Link from "next/link";
import { BotChainFooter } from "@/components/BotChainFooter";

const nav = [
  { href: "/app", label: "Energy Overview" },
  { href: "/app/sites", label: "Sites" },
  { href: "/app/meters", label: "Meter Feeds" },
  { href: "/app/claims", label: "Energy Claims" },
  { href: "/app/certificates", label: "Certificates" },
  { href: "/app/grid", label: "Grid Data" },
  { href: "/app/audits", label: "Audits" },
  { href: "/app/reports", label: "Reports" },
  { href: "/app/integrations", label: "Integrations" },
  { href: "/app/settings", label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <div className="flex flex-1">
        <aside className="w-60 bg-white border-r border-borderc p-4 hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-forest flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="font-heading font-bold text-deepgreen">PowerOrigin</span>
          </div>
          <nav className="space-y-1">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="block px-3 py-2 rounded-lg text-sm text-graphite hover:bg-sage hover:text-forest">
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <BotChainFooter />
    </div>
  );
}

