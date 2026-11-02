import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { StepIndicator } from '@/components/common/StepIndicator';
import { SectionCard } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { EVENTS, ALBUM_SIZES, pixelsForSize, PPI, createDefaultSheet } from '@/utils/albumData';
import { StorageService } from '@/services/storageService';
import EventSelection from './steps/EventSelection';
import AlbumSizeSelection from './steps/AlbumSizeSelection';
import SheetCountSelection from './steps/SheetCountSelection';
import Summary from './steps/Summary';

const STEPS = [
  { id: 'event', label: '1. Select Event' },
  { id: 'size', label: '2. Select Album Size' },
  { id: 'sheets', label: '3. Select Sheets' },
  { id: 'summary', label: '4. Confirm Details' },
];

export default function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState(EVENTS[0]); // default to Wedding
  const [albumSize, setAlbumSize] = useState(ALBUM_SIZES.find((s) => s.id === '12x36')); // default to 12x36
  const [sheetCount, setSheetCount] = useState(30); // default to 30 sheets
  const [customWidth, setCustomWidth] = useState('36');
  const [customHeight, setCustomHeight] = useState('12');
  const [isCreating, setIsCreating] = useState(false);

  const goNext = () => {
    if (step < 4) setStep((s) => s + 1);
  };
  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const canProceed =
    step === 1 ? !!event : step === 2 ? !!albumSize : step === 3 ? !!sheetCount : true;

  const handleCreate = async (customProjectName) => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const projectId = 'snavyo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      const name =
        customProjectName ||
        `${event.label} Album - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      // Generate empty sheets according to sheet count
      const initialSheets = [];
      const count = Math.max(1, Math.min(100, sheetCount || 20));
      for (let i = 1; i <= count; i++) {
        initialSheets.push(createDefaultSheet(i, event));
      }

      const project = {
        id: projectId,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        event: {
          id: event.id,
          label: event.label,
          category: event.category,
          colors: event.colors,
          background: event.background,
          decoratives: event.decoratives,
          textSuggestions: event.textSuggestions,
        },
        albumSize: {
          id: albumSize.id,
          inches: albumSize.inches,
          cm: albumSize.cm,
          spreadWidth: albumSize.spreadWidth,
          height: albumSize.height,
          pageWidth: albumSize.pageWidth,
          orientation: albumSize.orientation,
          category: albumSize.category,
          ppi: albumSize.ppi || PPI,
          pixels: pixelsForSize(albumSize.spreadWidth, albumSize.height, albumSize.ppi || PPI),
        },
        sheetCount: count,
        activeSheetIndex: 0,
        sheets: initialSheets,
        photos: [],
        settings: {
          ppi: albumSize.ppi || PPI,
          safetyMarginPx: 100,
          centerClearancePx: 100,
          showGuides: true,
          showCenterSpine: true,
          showGrid: false,
          snapToGrid: true,
        },
      };

      await StorageService.saveProject(project);

      // Navigate straight to the professional album editor
      navigate(`/editor/${projectId}`);
    } catch (err) {
      console.error('Failed to create album project:', err);
      alert('Could not create project. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-snavyo-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" to="/">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
          </Button>
          <span className="text-xs font-semibold uppercase tracking-wider text-snavyo-purple flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> New Album Studio Wizard
          </span>
        </div>

        <SectionCard className="shadow-luxury">
          <div className="border-b border-snavyo-lavender/60 pb-6 mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-snavyo-text-main">
              Create New Album
            </h1>
            <p className="text-sm text-snavyo-text-secondary mt-1">
              Select your event, print dimensions, and sheet count. You will be able to customize every layer in the studio.
            </p>
          </div>

          {/* 4-Step Indicator */}
          <StepIndicator currentStep={step} steps={STEPS} />

          {/* Active Step Content */}
          <div className="pt-2 min-h-[420px]">
            {step === 1 && (
              <EventSelection
                events={EVENTS}
                onSelect={(ev) => setEvent(ev)}
                selected={event ? event.id : null}
              />
            )}

            {step === 2 && (
              <AlbumSizeSelection
                sizes={ALBUM_SIZES}
                onSelect={(sz) => setAlbumSize(sz)}
                selected={albumSize ? albumSize.id : null}
                customWidth={customWidth}
                customHeight={customHeight}
                onCustomChange={setCustomWidth}
                onCustomHeightChange={setCustomHeight}
              />
            )}

            {step === 3 && (
              <SheetCountSelection
                onSelect={(count) => setSheetCount(count)}
                selected={sheetCount}
                albumSize={albumSize}
              />
            )}

            {step === 4 && (
              <Summary
                event={event}
                albumSize={albumSize}
                sheetCount={sheetCount}
                onCreate={handleCreate}
              />
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-snavyo-lavender flex items-center justify-between">
            {step > 1 ? (
              <Button variant="outline" size="sm" onClick={goBack} disabled={isCreating}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button variant="luxury" size="md" onClick={goNext} disabled={!canProceed || isCreating}>
                Continue to Step {step + 1} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                variant="gold"
                size="md"
                onClick={() => handleCreate()}
                disabled={isCreating}
              >
                {isCreating ? 'Creating Workspace...' : 'Create Album Project'}
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
