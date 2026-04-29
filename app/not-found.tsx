import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="flex items-center gap-2 text-white/20">
        <Terminal size={20} />
        <span className="font-mono text-sm tracking-widest uppercase">404</span>
      </div>
      <div>
        <h1 className="font-mono text-2xl font-bold text-white/60 mb-2">
          Page not found
        </h1>
        <p className="font-mono text-sm text-white/25">
          This route doesn&apos;t exist in the system.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 font-mono text-sm transition-all"
      >
        <ArrowLeft size={14} />
        Back to dashboard
      </Link>
    </div>
  );
}
