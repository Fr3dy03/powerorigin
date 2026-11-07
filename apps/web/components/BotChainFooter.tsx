import Link from "next/link";

export function BotChainFooter() {
  return (
    <footer className="border-t border-borderc bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm text-secondary whitespace-nowrap">Built on</span>
          <a href="https://www.botchain.ai/en/" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-lg bg-deepgreen px-3 py-2 shadow-sm">
            <img src="/botchain-logo.svg" alt="BOT Chain" className="block h-7 w-auto max-w-[170px] object-contain" />
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a href="https://scan.botchain.ai/" target="_blank" rel="noreferrer" className="text-forest hover:underline">BOT Chain Explorer</a>
          <Link href="/app" className="text-secondary hover:text-forest">Application</Link>
        </div>
        <p className="text-xs text-secondary text-center md:text-right leading-relaxed">© 2026 PowerOrigin.<br className="hidden md:block" /> Energy provenance and evidence platform.</p>
      </div>
    </footer>
  );
}
