export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">IL</span>
              </div>
              <span className="font-semibold tracking-tight">InfraLens</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              ML infrastructure decision support for open-source models.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a 
              href="#how-it-works" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a 
              href="#who-its-for" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Who it's for
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} InfraLens
          </div>
        </div>
      </div>
    </footer>
  );
}
