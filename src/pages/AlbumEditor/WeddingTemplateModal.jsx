import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, Clock3, Heart, MapPin, Upload, X } from 'lucide-react';

const INITIAL_FORM = {
  photo: null,
  photoPreview: '',
  coupleNames: '',
  date: '',
  time: '',
  location: '',
};

export default function WeddingTemplateModal({ isOpen, onClose, onApply }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a JPG, PNG, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photo: file, photoPreview: reader.result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.photoPreview || !form.coupleNames || !form.date || !form.time || !form.location) {
      setError('Please complete the photo, names, date, time, and location fields.');
      return;
    }
    onApply(form);
    onClose();
  };

  return createPortal(
    (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#291b24]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="wedding-template-title">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/80 bg-[#fffaf7] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#ead9d0] bg-[#f9e8dc] px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-[#6d3f35]">
              <Heart className="h-4 w-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Wedding template</span>
            </div>
            <h2 id="wedding-template-title" className="mt-1 font-serif text-xl font-bold text-[#4b2b2a]">Personalise your Wed-Day spread</h2>
            <p className="mt-1 text-xs text-[#805d56]">Your details will be placed in the template style.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#805d56] hover:bg-white/70" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label className="block cursor-pointer rounded-xl border border-dashed border-[#c9a99a] bg-[#fffdfb] p-3 transition-colors hover:border-[#8c5a4c]">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg bg-[#f2e8e2] text-[#9d7769]">
                {form.photoPreview ? <img src={form.photoPreview} alt="Selected couple" className="h-full w-full object-cover" /> : <Upload className="h-5 w-5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#4b2b2a]">Upload the featured wedding photo</div>
                <div className="mt-1 text-[11px] text-[#805d56]">Choose a landscape or couple portrait.</div>
              </div>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="col-span-2 text-xs font-bold text-[#4b2b2a]">
              Your name & partner name
              <input value={form.coupleNames} onChange={updateField('coupleNames')} placeholder="Aarav & Meera" className="mt-1.5 w-full rounded-lg border border-[#decac0] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#8c5a4c]" />
            </label>
            <label className="text-xs font-bold text-[#4b2b2a]">
              <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Date</span>
              <input type="date" value={form.date} onChange={updateField('date')} className="mt-1.5 w-full rounded-lg border border-[#decac0] bg-white px-2.5 py-2 text-xs outline-none focus:border-[#8c5a4c]" />
            </label>
            <label className="text-xs font-bold text-[#4b2b2a]">
              <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Time</span>
              <input type="time" value={form.time} onChange={updateField('time')} className="mt-1.5 w-full rounded-lg border border-[#decac0] bg-white px-2.5 py-2 text-xs outline-none focus:border-[#8c5a4c]" />
            </label>
            <label className="col-span-2 text-xs font-bold text-[#4b2b2a]">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Location</span>
              <input value={form.location} onChange={updateField('location')} placeholder="The Rosewood Garden, Jaipur" className="mt-1.5 w-full rounded-lg border border-[#decac0] bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#8c5a4c]" />
            </label>
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-[#ead9d0] pt-4">
            <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-xs font-bold text-[#805d56] hover:bg-[#f6e8df]">Cancel</button>
            <button type="submit" className="rounded-lg bg-[#6d3f35] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#4b2b2a]">Apply to sheet</button>
          </div>
        </form>
      </div>
    </div>
    ),
    document.body,
  );
}
