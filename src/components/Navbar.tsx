import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Bosh sahifa", href: "/" },
  { name: "Menu", href: "/#menu" },
  { name: "Maxsus taom", href: "/#featured" },
  { name: "Aloqa", href: "/#contact" },
];

interface NavbarProps {
  cartItemsCount?: number;
  onCartClick?: () => void;
}

export function Navbar({ cartItemsCount = 0, onCartClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const element = document.querySelector(href.replace("/", ""));
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-display font-bold text-foreground">
              Safi <span className="text-primary italic">Café</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+998901234567"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4" />
              +998 90 123 45 67
            </a>

            <Button
              variant="default"
              size="sm"
              className="hidden md:flex"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-4 h-4" />
              Buyurtma
              {cartItemsCount > 0 && (
                <span className="ml-1 bg-background text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Button
              variant="default"
              className="mt-2"
              onClick={() => {
                setIsOpen(false);
                onCartClick?.();
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Buyurtma {cartItemsCount > 0 && `(${cartItemsCount})`}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
