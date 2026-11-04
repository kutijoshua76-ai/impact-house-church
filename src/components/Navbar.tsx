import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import NotificationBell from "./pwa/NotificationBell";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavItem {
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
}

const navLinks: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", to: "/about" },
      { label: "Our Leaders", to: "/leaders" },
    ],
  },
  { label: "Events", to: "/events" },
  { label: "Sermons", to: "/sermons" },
  { label: "Daily Verse", to: "/daily-verse" },
  { label: "Gallery", to: "/gallery" },
  {
    label: "Giving",
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
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl transition-all duration-300 ease-out",
        scrolled ? "top-3 sm:top-4" : "top-6"
      )}
    >
      <div
        className={cn(
          "glassmorphic rounded-2xl flex items-center justify-between border border-foreground/10 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out",
          scrolled
            ? "px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#0a0a0a]/90 shadow-black/50"
            : "px-4 sm:px-6 py-2.5 sm:py-3"
        )}
      >
        <Link
          to="/"
          className="flex items-center group shrink-0"
          aria-label="RCCG Impact House Home"
        >
          <img
            src={logo}
            alt="RCCG Impact House"
            className={cn(
              "w-auto object-contain transition-all duration-300 ease-out group-hover:scale-105 drop-shadow-[0_0_2px_rgba(255,255,255,0.95)] drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]",
              scrolled
                ? "h-7 sm:h-8 md:h-9"
                : "h-9 sm:h-11 md:h-12"
            )}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <li key={link.label} className="relative group/item shrink-0">
                {link.children ? (
                  <div className="relative">
                    <button
                      className={cn(
                        "flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-semibold tracking-wide uppercase rounded-xl transition-all duration-300 whitespace-nowrap",
                        link.children.some((c) => c.to === pathname)
                          ? "text-rose-gold font-bold"
                          : "text-foreground/75 hover:text-foreground hover:bg-foreground/5"
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={11}
                        className="shrink-0 transition-transform duration-300 group-hover/item:rotate-180 text-foreground/50"
                      />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:pointer-events-auto transition-all duration-300 z-50">
                      <div className="bg-[#0e0b14]/95 rounded-2xl p-2 min-w-[210px] shadow-2xl border border-white/10 backdrop-blur-2xl">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className={cn(
                              "block px-3.5 py-2 text-xs font-medium tracking-wide rounded-xl transition-all duration-300 whitespace-nowrap",
                              pathname === child.to
                                ? "text-rose-gold bg-rose-gold/15 font-semibold"
                                : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.to!}
                    className={cn(
                      "relative px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-semibold tracking-wide uppercase rounded-xl transition-all duration-300 block group/link whitespace-nowrap",
                      pathname === link.to
                        ? "text-rose-gold font-bold"
                        : "text-foreground/75 hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-2 right-2 h-0.5 bg-rose-gold transition-all duration-300 scale-x-0 group-hover/link:scale-x-100",
                        pathname === link.to ? "scale-x-100" : ""
                      )}
                    />
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="h-5 w-px bg-foreground/15 mx-1.5 xl:mx-2 shrink-0" />
          <div className="flex items-center gap-1.5 shrink-0">
            <NotificationBell />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile toggle & quick icons */}
        <div className="lg:hidden flex items-center gap-2">
          <NotificationBell />
          <ThemeSwitcher />
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-xl text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
            aria-label="Toggle navigation menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-3 bg-[#0a0a0a]/98 backdrop-blur-2xl rounded-2xl overflow-hidden animate-fade-in border border-white/10 shadow-2xl max-h-[65vh] overflow-y-auto custom-scrollbar">
          <ul className="flex flex-col gap-1 p-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.children ? (
                  <div className="space-y-0.5 py-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-gold/70 border-b border-white/5 mb-1">
                      {link.label}
                    </div>
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block px-3 py-2 text-xs font-medium rounded-xl transition-all",
                          pathname === child.to
                            ? "text-rose-gold bg-rose-gold/15 font-semibold"
                            : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
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
                      "block px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all",
                      pathname === link.to
                        ? "text-rose-gold bg-rose-gold/15 font-bold"
                        : "text-foreground/75 hover:bg-white/5 hover:text-foreground"
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
