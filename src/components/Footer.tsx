import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-8">
          {/* Top row: logo + links + copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Description */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="InfraLens" className="w-7 h-7 rounded-lg object-cover" />
              <span className="font-semibold tracking-tight">InfraLens</span>
              <span className="text-sm text-muted-foreground hidden sm:inline ml-1">
                - ML infrastructure decision support
              </span>
            </div>

            {/* GitHub */}
            <a
              href="https://github.com/11Ananya/model-navigator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50 text-xs text-muted-foreground/60">
            <span>© {new Date().getFullYear()} InfraLens</span>
            <span>
              Built with{" "}
              <span className="text-muted-foreground">Hugging Face</span>
              {" · "}
              <span className="text-muted-foreground">Supabase</span>
              {" · "}
              <span className="text-muted-foreground">Claude</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
