import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Frame, Plus, FolderOpen, Clock, File, Layout, Download, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { OptionCard } from '@/components/common/Card';
import { StorageService } from '@/services/storageService';

const OPTIONS = [
  {
    id: 'create',
    to: '/new-project',
    title: 'Create New Album',
    desc: 'Start a new wedding album project across 22 event categories',
    icon: Plus,
    color: 'bg-snavyo-purple text-white',
  },
  {
    id: 'open',
    to: '/dashboard',
    title: 'Open Existing Project',
    desc: 'Resume a saved album project with all layers and photos',
    icon: FolderOpen,
    color: 'bg-snavyo-lavender text-snavyo-purple',
  },
  {
    id: 'recent',
    to: '/dashboard',
    title: 'Recent Projects',
    desc: 'View, duplicate, or manage recently edited album designs',
    icon: Clock,
    color: 'bg-snavyo-lavender text-snavyo-purple',
  },
  {
    id: 'size',
    to: '/album-size-guide',
    title: 'Album Size Guide',
    desc: 'Explore 9 standard print sizes and safety margin specifications',
    icon: Layout,
    color: 'bg-snavyo-purple/10 text-snavyo-purple',
  },
  {
    id: 'psd',
    to: '/import-psd',
    title: 'Import PSD',
    desc: 'Bring in a Photoshop album design preserving supported layers',
    icon: File,
    color: 'bg-snavyo-lavender text-snavyo-purple',
  },
  {
    id: 'export',
    to: '/dashboard',
    title: 'Exported Albums',
    desc: 'Manage print-ready 300 PPI export sheets and archives',
    icon: Download,
    color: 'bg-snavyo-lavender text-snavyo-purple',
  },
];

export default function Home() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalSheets: 0,
    totalPhotos: 0,
    recentlyEdited: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const projects = await StorageService.getAllProjects();
        const totalSheets = projects.reduce(
          (sum, p) => sum + (p.sheetCount || p.sheets?.length || 0),
          0
        );
        const totalPhotos = projects.reduce((sum, p) => sum + (p.photos?.length || 0), 0);

        setStats({
          totalProjects: projects.length,
          totalSheets,
          totalPhotos,
          recentlyEdited: Math.min(projects.length, 5),
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    }
    loadStats();
  }, []);

  const STAT_CARDS = [
    { key: 'totalProjects', label: 'Total Projects', icon: FolderOpen, suffix: ' albums' },
    { key: 'totalSheets', label: 'Total Sheets Created', icon: Layout, suffix: ' spreads' },
    { key: 'totalPhotos', label: 'Total Photographs', icon: Frame, suffix: ' images' },
    { key: 'recentlyEdited', label: 'Recently Edited', icon: Clock, suffix: ' projects' },
  ];

  return (
    <div className="min-h-screen bg-snavyo-background">
      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-white/80 shadow-sm mb-6">
          <div className="w-10 h-10 rounded-full bg-snavyo-purple flex items-center justify-center shadow-lg shadow-purple/40">
            <Frame className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-snavyo-lavender text-snavyo-purple text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Professional Wedding Album Studio
        </div>

        <h1 className="font-serif text-4xl md:text-6xl font-bold text-snavyo-text-main mb-4 tracking-tight">
          SNAVYO<span className="text-snavyo-purple"> ALBUM STUDIO</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-snavyo-gold mb-4">
          CREATE. DESIGN. RELIVE.
        </p>

        <p className="text-base md:text-lg text-snavyo-text-secondary mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          Craft professional wedding album spreads with intelligent photo placement, accurate 300 PPI print dimensions,
          100 px safety margins, and Photoshop-style layer editing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="luxury" to="/new-project">
            <Plus className="w-4 h-4 mr-1.5" /> Create New Album
          </Button>
          <Button variant="outline" size="md" to="/dashboard">
            <FolderOpen className="w-4 h-4 mr-1.5" /> View My Projects
          </Button>
          <Button variant="ghost" size="sm" to="/album-size-guide">
            Album Size Guide
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STAT_CARDS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="bg-white border border-snavyo-lavender/80 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-snavyo-lavender flex items-center justify-center text-snavyo-purple">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-snavyo-text-secondary text-xs font-medium">{stat.suffix}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-snavyo-text-main">
                  {stats[stat.key]}
                </div>
                <p className="mt-1 text-xs text-snavyo-text-secondary">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Navigation Options Grid */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl font-bold text-snavyo-text-main">Get Started</h2>
            <p className="text-xs text-snavyo-text-secondary mt-0.5">
              Choose an action to begin designing or reviewing projects
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {OPTIONS.map((opt) => (
            <Link
              key={opt.id}
              to={opt.to}
              className="group bg-white rounded-2xl border border-snavyo-lavender/80 p-6 shadow-sm hover:shadow-luxury hover:border-snavyo-purple/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${opt.color} shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <opt.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-snavyo-text-main group-hover:text-snavyo-purple transition-colors mb-2">
                  {opt.title}
                </h3>
                <p className="text-xs text-snavyo-text-secondary leading-relaxed">
                  {opt.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-snavyo-lavender/50 flex items-center text-xs font-bold text-snavyo-purple group-hover:translate-x-1 transition-transform">
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
