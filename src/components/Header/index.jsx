import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Plus, MessageCircle, Phone } from 'lucide-react';
import { Button } from '../common/Button';
import BrandMark from '../common/BrandMark';
import { CONFIG, WHATSAPP_URL, PHONE_URL } from '@/constants/config';

const NAV_LINKS = [
  { name: 'Home', to: '/' },
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Create Album', to: '/new-project' },
  { name: 'Album Size Guide', to: '/album-size-guide' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If inside editor, header is handled by TopToolbar
  if (location.pathname.startsWith('/editor/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-snavyo-lavender/80 shadow-xs">
      <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
        {/* Brand Treatment */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => setMenuOpen(false)}
        >
          <BrandMark className="w-11 h-11 object-contain group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-bold text-snavyo-purple tracking-tight">SNAVYO</span>
              <span className="text-[10px] font-bold text-snavyo-gold uppercase tracking-[0.2em] px-1.5 py-0.5 rounded bg-snavyo-lavender/50">
                VISUALS
              </span>
            </div>
            <span className="block text-[9px] font-bold text-snavyo-text-secondary uppercase tracking-[0.18em] -mt-0.5">
              ALBUM STUDIO
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `text-xs font-bold transition-colors py-1 ${
                  isActive
                    ? 'text-snavyo-purple border-b-2 border-snavyo-purple'
                    : 'text-snavyo-text-secondary hover:text-snavyo-purple'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/new-project"
            className="px-5 py-2 bg-snavyo-purple text-white text-xs font-bold rounded-full shadow-luxury hover:bg-snavyo-purple-dark hover:shadow-gold transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Album</span>
          </Link>
          {WHATSAPP_URL && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="p-2 rounded-full bg-snavyo-lavender text-snavyo-purple hover:bg-snavyo-purple hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {PHONE_URL && (
            <a
              href={PHONE_URL}
              aria-label={CONFIG.contact.phone.label}
              className="p-2 rounded-full bg-snavyo-lavender text-snavyo-purple hover:bg-snavyo-purple hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 rounded-xl bg-white border border-snavyo-lavender text-snavyo-purple hover:bg-snavyo-lavender transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-snavyo-lavender px-6 py-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="block px-3 py-2 text-xs font-bold text-snavyo-text-main hover:bg-snavyo-lavender/50 hover:text-snavyo-purple rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate('/new-project');
            }}
            className="mt-2 w-full py-2.5 bg-snavyo-purple text-white text-xs font-bold rounded-xl text-center shadow-luxury"
          >
            + Create New Album
          </button>
        </div>
      )}
    </header>
  );
}
