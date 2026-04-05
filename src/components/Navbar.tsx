import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "./ThemeProvider";
import logo from "../assets/logo.png";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Our Leaders", to: "/leaders" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme } = useTheme();

  // If the theme is dark or vivid, we want the logo to be entirely white so it's visible.
  const isDark = theme === "dark" || theme === "vivid";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl glassmorphic rounded-full px-6 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img 
            src={logo} 
            alt="RCCG Impact House" 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                    pathname === link.to
                      ? "text-rose-gold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-gold transition-all duration-300 group-hover:w-full ${pathname === link.to ? "w-full" : ""}`} />
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="h-6 w-px bg-foreground/20 mx-2" />
          <ThemeSwitcher />
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="text-foreground active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-4 glassmorphic rounded-2xl overflow-hidden animate-fade-in">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-sm font-medium tracking-wide transition-colors ${
                    pathname === link.to
                      ? "text-rose-gold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
