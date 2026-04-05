import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-midnight border-t border-foreground/5 text-foreground/90">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-rose-gold">RCCG Impact House</h3>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
            A place of worship, growth, and transformation — raising a generation of impactful youths for God's kingdom.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-rose-gold/80">Quick Links</h4>
          <ul className="space-y-3 text-sm text-foreground/60">
            <li><Link to="/" className="hover:text-rose-gold transition-colors duration-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-rose-gold transition-colors duration-200">About Us</Link></li>
            <li><Link to="/leaders" className="hover:text-rose-gold transition-colors duration-200">Our Leaders</Link></li>
            <li><Link to="/contact" className="hover:text-rose-gold transition-colors duration-200">Contact</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-rose-gold/80">Service Times</h4>
          <ul className="space-y-3 text-sm text-foreground/60">
            <li className="flex justify-between"><span>First Service (Sun)</span> <span className="text-rose-gold/60">7:30 – 8:30 AM</span></li>
            <li className="flex justify-between"><span>Sunday School</span> <span className="text-rose-gold/60">8:30 – 9:30 AM</span></li>
            <li className="flex justify-between"><span>Second Service (Sun)</span> <span className="text-rose-gold/60">9:30 – 11:30 AM</span></li>
            <li className="flex justify-between"><span>Bible Study (Wed)</span> <span className="text-rose-gold/60">5:00 – 6:30 PM</span></li>
            <li className="flex justify-between"><span>Prayer Meeting (Thu)</span> <span className="text-rose-gold/60">5:00 – 7:00 PM</span></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-[10px] uppercase tracking-widest text-foreground/30">
          © {new Date().getFullYear()} RCCG Impact House. All rights reserved.
        </p>
        <p className="text-[10px] uppercase tracking-widest text-foreground/30 flex items-center gap-2">
          Built with <Heart size={10} className="text-rose-gold/60 fill-rose-gold/20" /> for His glory
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
