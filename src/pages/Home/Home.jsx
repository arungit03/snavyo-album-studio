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
      <section className="px-6 pt-14 pb-12 md:pt-20 md:pb-16 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white border border-white/80 shadow-sm mb-5 p-2">
          <BrandMark className="w-full h-full object-contain" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-snavyo-lavender text-snavyo-purple text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Professional Album Studio
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-snavyo-text-main mb-4 tracking-tight">
          SNAVYO<span className="text-snavyo-purple"> ALBUM STUDIO</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-snavyo-gold-dark mb-4">
          {CONFIG.brand.tagline}
        </p>
        <p className="text-sm md:text-base text-snavyo-text-secondary mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          Design professional wedding albums and photo books with intelligent layouts, accurate 300 PPI print dimensions, and Photoshop-style layer editing.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="outline" size="md" to="/new-project">
            <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" /> Create New Album
          </Button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-12 md:py-16 bg-white border-y border-snavyo-lavender/60">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            description="From design to delivery in three simple steps."
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-snavyo-background/60 rounded-premium-xl border border-snavyo-lavender/70 p-6 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-snavyo-purple text-white flex items-center justify-center shadow-luxury mb-4">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-snavyo-gold mb-1">
                    Step {item.step}
                  </div>
                  <h3 className="font-serif text-base font-bold text-snavyo-text-main mb-1.5">{item.title}</h3>
                  <p className="text-xs text-snavyo-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* THEME CATEGORY GRID */}
      <section className="px-6 py-12 md:py-16 max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Gallery"
          title="Theme categories"
          description="Browse designs by occasion. Every theme is fully editable."
        />
        <div className="flex flex-wrap justify-center gap-2 mt-8 mb-6">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              activeCategory === 'all'
                ? 'bg-snavyo-purple text-white'
                : 'bg-white text-snavyo-text-secondary border border-snavyo-lavender hover:border-snavyo-purple'
            }`}
          >
            All
          </button>
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-snavyo-purple text-white'
                  : 'bg-white text-snavyo-text-secondary border border-snavyo-lavender hover:border-snavyo-purple'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <section className="px-6 py-12 md:py-16 bg-snavyo-purple text-white">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            eyebrow="Contact"
            title="Ready to start your album?"
            description="Reach out and we will help you bring your memories to print."
            className="[&_h2]:text-white [&_p]:text-white/80 [&_span]:text-white/80"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            {WHATSAPP_URL && (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-snavyo-purple text-xs font-bold rounded-full shadow-luxury hover:bg-snavyo-lavender transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
              </a>
            )}
            {PHONE_URL && (
              <a
                href={PHONE_URL}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/70 text-white text-xs font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" /> {CONFIG.contact.phone.number}
              </a>
            )}
            {EMAIL_URL && (
              <a
                href={EMAIL_URL}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/70 text-white text-xs font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" /> Email us
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