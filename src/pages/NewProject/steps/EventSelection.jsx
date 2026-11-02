import { useState } from 'react';
import {
  Heart,
  Star,
  Wine,
  Camera,
  Sparkles,
  Sun,
  Leaf,
  Music,
  Cake,
  Baby,
  HeartHandshake,
  Smile,
  Gift,
  Moon,
  Home,
  Award,
  Briefcase,
  GraduationCap,
  Building2,
  Users,
  PlusCircle,
  Search,
} from 'lucide-react';

const ICON_MAP = {
  Heart,
  Star,
  Wine,
  Camera,
  Sparkles,
  Sun,
  Flower: Leaf,
  Music,
  Cake,
  Baby,
  HeartHandshake,
  Smile,
  Gift,
  Moon,
  Sparkle: Sparkles,
  Home,
  Award,
  Briefcase,
  GraduationCap,
  Building: Building2,
  Users,
  PlusCircle,
};

const CATEGORIES = ['All', 'Wedding', 'Traditional', 'Family', 'Celebration', 'Corporate', 'Other'];

export default function EventSelection({ events, onSelect, selected }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = activeCategory === 'All' || ev.category === activeCategory;
    const matchesSearch =
      ev.label.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? events.length : events.filter((e) => e.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-snavyo-purple text-white shadow-sm'
                    : 'bg-white/80 text-snavyo-text-secondary hover:bg-snavyo-lavender/60 hover:text-snavyo-purple border border-snavyo-lavender/60'
                }`}
              >
                {cat} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-snavyo-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events (e.g. Haldi)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-snavyo-lavender bg-white text-snavyo-text-main focus:outline-none focus:border-snavyo-purple focus:ring-1 focus:ring-snavyo-purple"
          />
        </div>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEvents.map((ev) => {
          const Icon = ICON_MAP[ev.icon] || PlusCircle;
          const isSelected = selected === ev.id;
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => onSelect(ev)}
              className={`flex flex-col items-start p-4 rounded-premium-xl border transition-all duration-200 text-left cursor-pointer group relative ${
                isSelected
                  ? 'bg-white border-snavyo-purple shadow-gold ring-2 ring-snavyo-purple'
                  : 'bg-white border-snavyo-lavender/70 hover:border-snavyo-purple/50 hover:shadow-luxury hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-snavyo-purple text-white' : 'bg-snavyo-lavender/70 text-snavyo-purple'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-snavyo-background text-snavyo-text-secondary">
                  {ev.category}
                </span>
              </div>

              <div className="font-serif text-base font-bold text-snavyo-text-main group-hover:text-snavyo-purple transition-colors">
                {ev.label}
              </div>
              <p className="text-xs text-snavyo-text-secondary line-clamp-2 mt-1 leading-relaxed">
                {ev.description}
              </p>

              {/* Event Color & Details preview on hover / selected */}
              <div className="mt-3 pt-3 border-t border-snavyo-lavender/40 w-full flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: ev.colors?.primary || '#7550B8' }}
                    title="Primary Theme Color"
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: ev.colors?.accent || '#D4AF62' }}
                    title="Accent Theme Color"
                  />
                  <span className="text-[10px] text-snavyo-text-secondary">Palette</span>
                </div>
                {isSelected && (
                  <span className="text-[11px] font-bold text-snavyo-purple flex items-center gap-1">
                    Selected ✓
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-premium-xl border border-snavyo-lavender">
          <p className="text-sm text-snavyo-text-secondary">No events match your search &quot;{search}&quot;</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
            }}
            className="mt-2 text-xs font-semibold text-snavyo-purple hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
