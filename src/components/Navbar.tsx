import { useState } from "react";
import { Moon, Sun, LogOut, User, Menu } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="InfraLens" className="w-7 h-7 rounded-md object-cover" />
              <span className="font-semibold text-base tracking-[-0.03em]">InfraLens</span>
            </div>

            {/* Navigation Links (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("demo")}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Demo
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                How it works
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

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl gap-2 hidden sm:flex">
                      <User className="h-3.5 w-3.5" />
                      <span className="max-w-[120px] truncate text-xs">
                        {user.email?.split("@")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={signOut}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl hidden sm:flex"
                  onClick={() => setAuthOpen(true)}
                >
                  Sign in
                </Button>
              )}

              {/* Mobile hamburger */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl md:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <button
                      onClick={() => {
                        scrollToSection("demo");
                        setSheetOpen(false);
                      }}
                      className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors text-left py-2"
                    >
                      Demo
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("how-it-works");
                        setSheetOpen(false);
                      }}
                      className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors text-left py-2"
                    >
                      How it works
                    </button>
                    <div className="border-t border-border pt-4">
                      {user ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl gap-2"
                          onClick={() => {
                            signOut();
                            setSheetOpen(false);
                          }}
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign out
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl"
                          onClick={() => {
                            setAuthOpen(true);
                            setSheetOpen(false);
                          }}
                        >
                          Sign in
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
