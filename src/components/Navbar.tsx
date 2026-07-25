import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useTheme } from "./ThemeProvider";
import logo from "../assets/logo.png";
import { cn } from "@/lib/utils";
const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Our Leaders", to: "/leaders" },
  { label: "Events", to: "/events" },
  { label: "Gallery", to: "/gallery" },
  { label: "Sermons", to: "/sermons" },
  {
    label: "Kingdom Partnership",
    children: [
      { label: "Tithes & Offering", to: "/give/tithes" },
      { label: "Project Funding", to: "/give/projects" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { label: "First Timer", to: "/first-timer" },
      { label: "Join the Workforce", to: "/join-workforce" },
      { label: "CSR", to: "/csr" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme } = useTheme();

  // If the theme is dark or vivid, we want the logo to be entirely white so it's visible.
  const isDark = theme === "dark" || theme === "vivid";

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-7xl glassmorphic rounded-full px-6 py-3 transition-all duration-300">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <img 
            src={logo} 
            alt="RCCG Impact House" 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 ml-auto">
          <ul className="flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <li key={link.label} className="relative group/nav">
                {link.children ? (
                  <div className="flex items-center gap-1.5 cursor-pointer text-sm font-medium tracking-wide text-foreground/70 hover:text-foreground transition-all duration-300 whitespace-nowrap">
                    {link.label}
                    <ChevronDown size={14} className="group-hover/nav:rotate-180 transition-transform duration-300" />
                    
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-4 w-56 glassmorphic rounded-2xl p-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 translate-y-2 group-hover/nav:translate-y-0 shadow-2xl overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={cn(
                            "block px-4 py-3 text-xs font-semibold tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-rose-gold/10 hover:text-rose-gold",
                            pathname === child.to ? "text-rose-gold bg-rose-gold/5" : "text-foreground/70"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.to!}
                    className={cn(
                      "text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 relative group/link",
                      pathname === link.to
                        ? "text-rose-gold"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-gold transition-all duration-300 group-hover/link:w-full",
                      pathname === link.to ? "w-full" : ""
                    )} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          <div className="h-6 w-px bg-foreground/20 mx-4" />
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
        <div className="lg:hidden absolute top-full left-0 right-0 mt-4 glassmorphic rounded-2xl overflow-hidden animate-fade-in border border-white/5 shadow-2xl max-h-[50vh] overflow-y-auto custom-scrollbar">
          <ul className="flex flex-col gap-1 px-2 py-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.children ? (
                  <div className="space-y-0.5">
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-gold/60 border-b border-white/5 mb-1 mt-1">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block px-4 py-2.5 text-sm font-medium tracking-wide rounded-xl transition-all duration-300",
                          pathname === child.to ? "text-rose-gold bg-rose-gold/10" : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    to={link.to!}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium tracking-wide rounded-xl transition-all duration-300",
                      pathname === link.to ? "text-rose-gold bg-rose-gold/10" : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
