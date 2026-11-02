import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImagePlus, Upload, X } from 'lucide-react';

const EMPTY_PHOTOS = [null, null, null, null];

export default function WeddingGalleryModal({ isOpen, onClose, onApply }) {
  const [photos, setPhotos] = useState(EMPTY_PHOTOS);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPhotos(EMPTY_PHOTOS);
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

  const handlePhotoChange = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose JPG, PNG, or WebP images.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((current) => {
        const next = [...current];
        next[index] = { file, previewUrl: reader.result };
        return next;
      });
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedPhotos = photos.filter(Boolean);
    if (!selectedPhotos.length) {
      setError('Upload at least one image to place into the spread.');
      return;
    }
    onApply({ photos: selectedPhotos });
    onClose();
  };

  return createPortal(
    (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#211b25]/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="wedding-gallery-title">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/80 bg-[#fffaf7] shadow-2xl">
          <div className="flex items-start justify-between border-b border-[#ddd8ce] bg-[#eeeae6] px-5 py-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#55514b]">Wedding gallery spread</div>
              <h2 id="wedding-gallery-title" className="mt-1 font-serif text-xl font-bold text-[#37332f]">Add photos to the album frames</h2>
              <p className="mt-1 text-xs text-[#77716b]">Each photo is automatically cropped and fitted inside its frame.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full p-1.5 text-[#77716b] hover:bg-white" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <label key={index} className="group cursor-pointer rounded-xl border border-dashed border-[#c9c3bb] bg-[#faf9f7] p-2 transition-colors hover:border-[#81776d]">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handlePhotoChange(index, event)} className="hidden" />
                  <div className="flex h-24 items-center justify-center overflow-hidden rounded-lg bg-[#e9e6e1]">
                    {photo ? (
                      <img src={photo.previewUrl} alt={`Gallery photo ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center text-[#81776d]">
                        <ImagePlus className="mx-auto h-6 w-6" />
                        <span className="mt-1 block text-[10px] font-bold">Frame {index + 1}</span>
                        <span className="block text-[9px]">Upload image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between px-0.5 text-[10px] font-bold text-[#55514b]">
                    <span>{photo ? 'Replace image' : `Photo ${index + 1}`}</span>
                    <Upload className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </div>
                </label>
              ))}
            </div>

            {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700">{error}</p>}

            <div className="mt-5 flex justify-end gap-2 border-t border-[#e4ded8] pt-4">
              <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-xs font-bold text-[#77716b] hover:bg-[#eeeae6]">Cancel</button>
              <button type="submit" className="rounded-lg bg-[#4c4a47] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#2e2c2a]">Fit photos to spread</button>
            </div>
          </form>
        </div>
      </div>
    ),
    document.body,
  );
}
