import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MessageCircle } from 'lucide-react';
import { CONFIG, WHATSAPP_URL, PHONE_URL, EMAIL_URL } from '@/constants/config';
import BrandMark from './common/BrandMark';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-snavyo-lavender/80 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-snavyo-lavender flex items-center justify-center p-1.5">
                <BrandMark className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-snavyo-purple">SNAVYO</div>
                <div className="text-[9px] font-bold text-snavyo-text-secondary uppercase tracking-[0.18em]">
                  Album Studio
                </div>
              </div>
            </div>
            <p className="text-xs text-snavyo-text-secondary leading-relaxed max-w-sm">
              Professional wedding album designing platform by {CONFIG.brand.company}. Create, design, and relive your precious moments with print-ready 300 PPI output.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-snavyo-gold mt-3">
              {CONFIG.brand.tagline}
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-main mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-snavyo-text-secondary hover:text-snavyo-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/new-project" className="text-snavyo-text-secondary hover:text-snavyo-purple transition-colors">
                  Create Album
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-snavyo-text-secondary hover:text-snavyo-purple transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/album-size-guide" className="text-snavyo-text-secondary hover:text-snavyo-purple transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-snavyo-text-main mb-3">
              Contact
            </h3>
            <ul className="space-y-2 text-xs">
              {WHATSAPP_URL && (
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-snavyo-text-secondary hover:text-snavyo-purple transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </li>
              )}
              {PHONE_URL && (
                <li>
                  <a
                    href={PHONE_URL}
                    className="flex items-center gap-2 text-snavyo-text-secondary hover:text-snavyo-purple transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{CONFIG.contact.phone.number}</span>
                  </a>
                </li>
              )}
              {EMAIL_URL && (
                <li>
                  <a
                    href={EMAIL_URL}
                    className="flex items-center gap-2 text-snavyo-text-secondary hover:text-snavyo-purple transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{CONFIG.contact.email.address}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-snavyo-lavender/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-snavyo-text-secondary">
            © {new Date().getFullYear()} {CONFIG.brand.company}. All rights reserved.
          </p>
          <p className="text-[11px] text-snavyo-text-secondary flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-snavyo-gold" aria-hidden="true" /> for wedding memories
          </p>
        </div>
      </div>
    </footer>
  );
}