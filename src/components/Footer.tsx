import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-8 bg-surface border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-foreground">
              Safi <span className="text-primary italic">Café</span>
            </span>
          </Link>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Safi Café. Barcha huquqlar himoyalangan.
          </p>

          {/* Admin Link */}
          <Link
            to="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
