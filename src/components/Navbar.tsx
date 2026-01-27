import { Moon, Sun, ExternalLink } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IL</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">InfraLens</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection("who-its-for")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Who it's for
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              asChild
              className="rounded-xl hidden sm:flex"
            >
              <a
                href="https://infralens.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get recommendations
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
