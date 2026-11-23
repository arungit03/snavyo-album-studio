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
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-snavyo-lavender/80 shadow-[0_4px_24px_rgba(117,80,184,0.06)]">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Brand Treatment */}
        <Link
          to="/"
          className="flex items-center gap-3.5 group"
          onClick={() => setMenuOpen(false)}
        >
          <div className="relative p-1 rounded-2xl bg-gradient-to-br from-amber-100/60 via-purple-50 to-white border border-amber-300/40 shadow-xs group-hover:border-amber-400 group-hover:shadow-[0_0_16px_rgba(212,175,98,0.35)] transition-all duration-300">
            <BrandMark className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-snavyo-purple group-hover:text-snavyo-purple-dark transition-colors">
                SNAVYO
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300/60 uppercase tracking-[0.2em] px-2 py-0.5 rounded-md shadow-2xs">
                VISUALS
              </span>
            </div>
            <span className="block text-[9px] font-bold text-snavyo-text-secondary uppercase tracking-[0.22em] mt-0.5">
              ALBUM STUDIO • 300 PPI
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `text-xs font-bold transition-all px-3.5 py-1.5 rounded-full ${
                  isActive
                    ? 'bg-snavyo-purple text-white shadow-[0_2px_10px_rgba(117,80,184,0.25)]'
                    : 'text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-snavyo-lavender/60'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <div className="h-5 w-[1px] bg-snavyo-lavender/90 mx-2" />

          <Link
            to="/new-project"
            className="px-5 py-2 bg-gradient-to-r from-snavyo-purple to-purple-800 text-white text-xs font-bold rounded-full shadow-luxury hover:shadow-[0_0_20px_rgba(212,175,98,0.45)] hover:border-amber-300 border border-transparent transition-all duration-300 inline-flex items-center gap-1.5 transform hover:-translate-y-0.5"
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
              className="p-2 rounded-full bg-snavyo-lavender/70 text-snavyo-purple hover:bg-snavyo-purple hover:text-white transition-all duration-200 border border-snavyo-lavender hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {PHONE_URL && (
            <a
              href={PHONE_URL}
              aria-label={CONFIG.contact.phone.label}
              className="p-2 rounded-full bg-snavyo-lavender/70 text-snavyo-purple hover:bg-snavyo-purple hover:text-white transition-all duration-200 border border-snavyo-lavender hover:scale-105"
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
