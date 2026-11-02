import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderOpen,
  Clock,
  Plus,
  Layout,
  Layers,
  Image,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  Search,
  Download,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { StorageService } from '@/services/storageService';
import ExportModal from '@/pages/AlbumEditor/ExportModal';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedExportProject, setSelectedExportProject] = useState(null);
  const navigate = useNavigate();

  const loadProjects = async () => {
    setLoading(true);
    const list = await StorageService.getAllProjects();
    setProjects(list);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenProject = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleDuplicate = async (e, id) => {
    e.stopPropagation();
    await StorageService.duplicateProject(id);
    await loadProjects();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this album project? This action cannot be undone.')) {
      await StorageService.deleteProject(id);
      await loadProjects();
    }
  };

  const filteredProjects = projects.filter((p) => {
    const title = p.name || '';
    const eventName = p.event?.label || p.event || '';
    const query = search.toLowerCase();
    return title.toLowerCase().includes(query) || eventName.toLowerCase().includes(query);
  });

  const totalSheets = projects.reduce((sum, p) => sum + (p.sheetCount || p.sheets?.length || 0), 0);
  const totalPhotos = projects.reduce((sum, p) => sum + (p.photos?.length || 0), 0);

  return (
    <div className="min-h-screen bg-snavyo-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-snavyo-purple flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> SNAVYO VISUALS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-snavyo-text-main mt-1">
              Project Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-snavyo-text-secondary mt-1">
              Manage your saved wedding album projects, edit spreads, and export high-resolution sheets.
            </p>
          </div>

          <Button variant="luxury" to="/new-project" className="shadow-luxury">
            <Plus className="w-4 h-4 mr-2" />
            Create New Album
          </Button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-snavyo-lavender/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-snavyo-purple mb-2">
              <FolderOpen className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-snavyo-lavender px-2 py-0.5 rounded-full">
                Albums
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-snavyo-text-main">{projects.length}</div>
            <p className="text-xs text-snavyo-text-secondary mt-1">Total Projects</p>
          </div>

          <div className="bg-white border border-snavyo-lavender/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-snavyo-purple mb-2">
              <Layers className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-snavyo-lavender px-2 py-0.5 rounded-full">
                Spreads
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-snavyo-text-main">{totalSheets}</div>
            <p className="text-xs text-snavyo-text-secondary mt-1">Total Sheets Created</p>
          </div>

          <div className="bg-white border border-snavyo-lavender/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-snavyo-purple mb-2">
              <Image className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-snavyo-lavender px-2 py-0.5 rounded-full">
                Assets
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-snavyo-text-main">{totalPhotos}</div>
            <p className="text-xs text-snavyo-text-secondary mt-1">Total Photographs</p>
          </div>

          <div className="bg-white border border-snavyo-lavender/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-snavyo-purple mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-snavyo-lavender px-2 py-0.5 rounded-full">
                Storage
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-snavyo-text-main">IndexedDB</div>
            <p className="text-xs text-snavyo-text-secondary mt-1">Local Browser Storage</p>
          </div>
        </div>

        {/* Project List Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <h2 className="font-serif text-xl font-bold text-snavyo-text-main">
              Recent Album Projects ({filteredProjects.length})
            </h2>

            {projects.length > 0 && (
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-snavyo-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search album projects..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full border border-snavyo-lavender bg-white text-snavyo-text-main focus:outline-none focus:border-snavyo-purple focus:ring-1 focus:ring-snavyo-purple"
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-snavyo-lavender">
              <div className="w-8 h-8 rounded-full border-2 border-snavyo-purple border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-xs text-snavyo-text-secondary">Loading your album library...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white border border-snavyo-lavender rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-snavyo-lavender flex items-center justify-center mx-auto mb-4 border border-snavyo-purple/20">
                <FolderOpen className="w-8 h-8 text-snavyo-purple" />
              </div>
              <h3 className="font-serif text-xl font-bold text-snavyo-text-main mb-1">
                {search ? 'No Matching Albums Found' : 'No Album Projects Yet'}
              </h3>
              <p className="text-xs text-snavyo-text-secondary mb-6 max-w-sm mx-auto">
                {search
                  ? `No project matches your search "${search}". Try another keyword or clear the filter.`
                  : 'Get started by creating your first professional wedding album project.'}
              </p>
              <Button variant="luxury" to="/new-project">
                <Plus className="w-4 h-4 mr-2" />
                Create New Album
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const eventLabel = project.event?.label || project.event || 'Wedding';
                const eventColor = project.event?.colors?.primary || '#7550B8';
                const sizeLabel = project.albumSize?.inches || '12 × 36';
                const sheetCount = project.sheetCount || project.sheets?.length || 1;
                const photoCount = project.photos?.length || 0;
                const lastModified = project.updatedAt || project.createdAt || new Date().toISOString();

                return (
                  <div
                    key={project.id}
                    onClick={() => handleOpenProject(project.id)}
                    className="group bg-white border border-snavyo-lavender rounded-2xl p-5 shadow-sm hover:shadow-luxury hover:border-snavyo-purple/50 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white shadow-xs"
                          style={{ backgroundColor: eventColor }}
                        >
                          {eventLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-snavyo-text-secondary font-mono">
                          {sizeLabel} in
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-base font-bold text-snavyo-text-main group-hover:text-snavyo-purple transition-colors line-clamp-1">
                        {project.name || 'Untitled Album'}
                      </h3>

                      {/* Specs */}
                      <div className="mt-2 text-xs text-snavyo-text-secondary space-y-1">
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-snavyo-purple" />
                          <span>{sheetCount} Spreads ({sheetCount * 2} Pages)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image className="w-3.5 h-3.5 text-snavyo-gold" />
                          <span>{photoCount} Photographs imported</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-snavyo-lavender/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-snavyo-text-secondary text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(lastModified).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExportProject(project);
                          }}
                          className="p-1.5 rounded-lg text-snavyo-purple hover:bg-snavyo-lavender/60"
                          title="Export Album (JPEG, PNG, PDF, ZIP)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(e, project.id)}
                          className="p-1.5 rounded-lg text-snavyo-text-secondary hover:text-snavyo-purple hover:bg-snavyo-lavender/50"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, project.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-snavyo-purple font-semibold flex items-center gap-0.5 ml-1 text-xs group-hover:underline">
                          Open <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global Export Modal from Dashboard */}
        {selectedExportProject && (
          <ExportModal
            isOpen={!!selectedExportProject}
            onClose={() => setSelectedExportProject(null)}
            project={selectedExportProject}
            activeSheetIndex={0}
          />
        )}
      </div>
    </div>
  );
}
