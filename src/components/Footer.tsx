export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="InfraLens" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-semibold tracking-tight">InfraLens</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              ML infrastructure decision support for open-source models.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a
              href="#demo"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
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
