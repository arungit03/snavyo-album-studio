import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import {
  Plus,
  Sparkles,
  Upload,
  ShoppingBag,
  Check,
  Image as ImageIcon,
  Layers,
  Ruler,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import BrandMark from '@/components/common/BrandMark';
import SectionHeading from '@/components/SectionHeading';
import ThemeCard from '@/components/ThemeCard';
import FaqAccordion from '@/components/FaqAccordion';
import { CONFIG, WHATSAPP_URL, PHONE_URL, EMAIL_URL } from '@/constants/config';
import { THEME_CATEGORIES, THEMES } from '@/constants/themes';
import { ORIENTATIONS, PAPER_TYPES, COVER_OPTIONS, LAMINATION_OPTIONS } from '@/constants/products';

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Choose design',
    desc: 'Pick a theme, orientation, album size, and paper finish from the template gallery.',
    icon: Sparkles,
  },
  {
    step: 2,
    title: 'Upload photos',
    desc: 'Import your favourite photographs — the editor arranges them into editable layers.',
    icon: Upload,
  },
  {
    step: 3,
    title: 'Preview and order',
    desc: 'Review your design at 300 PPI with safety guides, then place your print order.',
    icon: ShoppingBag,
  },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'What print resolution do you use?',
    answer: 'All sheets are prepared at 300 PPI with 100 px safety margins on all outer edges and 100 px clearance on both sides of the centre cutting line.',
  },
  {
    id: 'faq-2',
    question: 'Which export formats are supported?',
    answer: 'You can export each sheet individually or the full album as JPEG, PNG, PDF, or layered PSD.',
  },
  {
    id: 'faq-3',
    question: 'Can I edit the auto-generated designs?',
    answer: 'Yes. Every generated sheet is fully editable — photos, text, shapes, backgrounds, and decorations are all individual layers you can move, resize, replace, or delete.',
  },
  {
    id: 'faq-4',
    question: 'How many sheets or pages can I create?',
    answer: 'Wedding albums support 1–100 sheets. Photo books support 24–100 pages, in A5, A4, or A3 sizes.',
  },
  {
    id: 'faq-5',
    question: 'Are the prices on this site final?',
    answer: 'Prices shown are placeholders for demonstration. The final quote is confirmed before you place an order.',
  },
];

const ORIENTATION_SHOWCASE = [
  { id: 'horizontal', label: 'Horizontal', shape: 'aspect-[16/9]' },
  { id: 'vertical', label: 'Vertical', shape: 'aspect-[3/4]' },
  { id: 'square', label: 'Square', shape: 'aspect-square' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const featuredThemes = activeCategory === 'all'
    ? THEMES.slice(0, 8)
    : THEMES.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-snavyo-background">
      {/* HERO */}
      <section className="relative px-6 pt-16 pb-14 md:pt-24 md:pb-20 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-purple-200/35 via-amber-100/30 to-purple-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-md border border-amber-300/50 shadow-[0_10px_30px_rgba(117,80,184,0.12)] mb-6 p-2.5 transition-transform hover:scale-105 duration-300">
          <BrandMark className="w-full h-full object-contain" />
        </div>

        <div className="block">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100/90 via-amber-50 to-purple-100/90 border border-amber-300/60 text-purple-950 text-[11px] font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>Royal Wedding &amp; Event Album Studio</span>
          </div>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-snavyo-text-main mb-4 tracking-tight leading-tight">
          SNAVYO <span className="purple-text-gradient">ALBUM STUDIO</span>
        </h1>

        <p className="text-xs font-extrabold uppercase tracking-[0.28em] gold-text-gradient mb-5">
          {CONFIG.brand.tagline}
        </p>

        <p className="text-sm md:text-base text-snavyo-text-secondary mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
          Craft heirloom-quality wedding albums, engagement photobooks, and reception spreads with 300 PPI print-ready precision, smart photo slots, and layered creative freedom.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/new-project"
            className="px-8 py-3.5 bg-gradient-to-r from-snavyo-purple via-purple-700 to-snavyo-purple text-white text-sm font-bold rounded-full shadow-[0_10px_25px_rgba(117,80,184,0.32)] hover:shadow-[0_12px_32px_rgba(212,175,98,0.45)] hover:border-amber-300 border border-amber-200/30 hover:-translate-y-0.5 active:translate-y-0 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>Start Designing Album</span>
          </Link>
          <Link
            to="/album-size-guide"
            className="px-7 py-3.5 bg-white/90 backdrop-blur-sm border border-snavyo-lavender text-snavyo-purple text-sm font-bold rounded-full shadow-xs hover:bg-snavyo-lavender/60 hover:border-snavyo-purple/40 transition-all inline-flex items-center gap-2"
          >
            <Ruler className="w-4 h-4 text-snavyo-purple" aria-hidden="true" />
            <span>Album Size Guide</span>
          </Link>
        </div>

        {/* 4-Metric Trust Banner */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
          {[
            { title: '300 PPI Ultra-HD', subtitle: 'Print-ready resolution' },
            { title: '17+ Spread Templates', subtitle: 'Royal Mandap & modern designs' },
            { title: 'Layer Control', subtitle: 'Move, resize & crop photos' },
            { title: 'Safe Margins', subtitle: 'Built-in spine & cut guides' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-snavyo-lavender/80 shadow-2xs hover:border-amber-300/60 transition-colors"
            >
              <div className="text-xs font-bold text-snavyo-purple">{item.title}</div>
              <div className="text-[11px] text-snavyo-text-secondary mt-0.5">{item.subtitle}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-14 md:py-18 bg-white/90 backdrop-blur-sm border-y border-snavyo-lavender/70">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Workflow"
            title="How It Works"
            description="From template selection to print-ready spreads in three seamless steps."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group bg-gradient-to-b from-white to-snavyo-background/40 rounded-2xl border border-snavyo-lavender/80 p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(117,80,184,0.12)] hover:border-amber-300/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-snavyo-purple to-purple-700 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(117,80,184,0.3)] mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-amber-200" aria-hidden="true" />
                  </div>
                  <div className="badge-gold mb-2">
                    Step 0{item.step}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-snavyo-text-main mb-2">{item.title}</h3>
                  <p className="text-xs text-snavyo-text-secondary leading-relaxed font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* THEME CATEGORY GRID */}
      <section className="px-6 py-14 md:py-18 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Exclusive Collections"
          title="Designer Theme Gallery"
          description="Browse curated wedding, engagement, haldi, and celebration templates."
        />
        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-8">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-snavyo-purple text-white shadow-[0_4px_14px_rgba(117,80,184,0.3)] border border-amber-300/40'
                : 'bg-white text-snavyo-text-secondary border border-snavyo-lavender hover:border-snavyo-purple hover:bg-snavyo-lavender/30'
            }`}
          >
            All Themes ({THEMES.length})
          </button>
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-snavyo-purple text-white shadow-[0_4px_14px_rgba(117,80,184,0.3)] border border-amber-300/40'
                  : 'bg-white text-snavyo-text-secondary border border-snavyo-lavender hover:border-snavyo-purple hover:bg-snavyo-lavender/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      </section>

      {/* QUALITY / PRINT SPECS */}
      <section className="px-6 py-12 md:py-16 bg-white border-y border-snavyo-lavender/60">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Quality"
            title="Print specifications"
            description="Plain facts about how your album is prepared for print."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { icon: Ruler, label: 'Resolution', value: CONFIG.printSpecs.resolution },
              { icon: Layers, label: 'Safety margin', value: CONFIG.printSpecs.safetyMargin },
              { icon: ImageIcon, label: 'Export formats', value: CONFIG.printSpecs.formats.join(', ') },
              { icon: Check, label: 'Binding', value: CONFIG.printSpecs.binding },
            ].map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="bg-snavyo-background/60 rounded-premium-xl border border-snavyo-lavender/70 p-5 text-center">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple mb-3">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">{spec.label}</div>
                  <div className="mt-1 text-sm font-bold text-snavyo-text-main">{spec.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ORIENTATION SHOWCASE */}
      <section className="px-6 py-12 md:py-16 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Shapes"
          title="Orientation & shape showcase"
          description="Horizontal, vertical, and square layouts for every product type."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
          {ORIENTATION_SHOWCASE.map((o) => (
            <div key={o.id} className="bg-white rounded-premium-xl border border-snavyo-lavender/80 shadow-sm p-5 flex flex-col items-center">
              <div className={`w-full ${o.shape} bg-gradient-to-br from-snavyo-lavender to-snavyo-purple/20 rounded-xl border border-snavyo-lavender flex items-center justify-center mb-3`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-snavyo-purple">{o.label}</span>
              </div>
              <span className="text-xs font-bold text-snavyo-text-main">{o.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-12 md:py-16 max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers about specs, formats, and editing."
        />
        <div className="mt-8">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="px-6 py-14 md:py-18 bg-gradient-to-r from-snavyo-purple-dark via-purple-900 to-snavyo-purple-dark text-white border-t border-amber-300/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-amber-300/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" /> Personalized Studio Support
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Ready to design your wedding album?
          </h2>
          <p className="text-sm text-purple-200/90 max-w-xl mx-auto font-light leading-relaxed">
            Connect directly with our master album designers for custom spreads, luxury sizing, and printing consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
            {WHATSAPP_URL && (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 text-purple-950 text-xs font-bold rounded-full shadow-[0_4px_20px_rgba(212,175,98,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,98,0.5)] hover:scale-105 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-purple-950" aria-hidden="true" /> Chat on WhatsApp
              </a>
            )}
            {PHONE_URL && (
              <a
                href={PHONE_URL}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-sm border border-white/40 text-white text-xs font-bold rounded-full hover:bg-white/20 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-300" aria-hidden="true" /> {CONFIG.contact.phone.number}
              </a>
            )}
            {EMAIL_URL && (
              <a
                href={EMAIL_URL}
                className="inline-flex items-center gap-2 px-7 py-3 bg-white/10 backdrop-blur-sm border border-white/40 text-white text-xs font-bold rounded-full hover:bg-white/20 transition-all"
              >
                <Mail className="w-4 h-4 text-amber-300" aria-hidden="true" /> Email Studio
              </a>
            )}
          </div>
        </div>
      </section>

      {/* OPTION SUMMARY STRIP (data-driven from constants) */}
      <section className="px-6 py-10 bg-snavyo-background border-t border-snavyo-lavender/60">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">Orientations</div>
            <div className="mt-1 text-sm font-bold text-snavyo-text-main">{ORIENTATIONS.length}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">Paper types</div>
            <div className="mt-1 text-sm font-bold text-snavyo-text-main">{PAPER_TYPES.length}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">Covers</div>
            <div className="mt-1 text-sm font-bold text-snavyo-text-main">{COVER_OPTIONS.length}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-snavyo-text-secondary">Laminations</div>
            <div className="mt-1 text-sm font-bold text-snavyo-text-main">{LAMINATION_OPTIONS.length}</div>
          </div>
        </div>
      </section>
    </div>
  );
}