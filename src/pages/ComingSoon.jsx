import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function ComingSoon({ label, stage, backTo = '/' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
      <div className="w-16 h-16 rounded-full bg-snavyo-lavender flex items-center justify-center mb-6 border border-snavyo-purple/20 shadow-sm">
        <Clock className="w-9 h-9 text-snavyo-purple" />
      </div>
      <h2 className="text-2xl font-bold text-snavyo-text-main mb-2">{label}</h2>
      <p className="text-snavyo-text-secondary mb-2">
        This feature is planned for <span className="text-snavyo-purple font-semibold">{stage}</span> and is not part of Stage 1.
      </p>
      <p className="text-sm text-snavyo-text-secondary mb-8 max-w-xs">
        Continue building your album using the available options below.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="outline" size="sm" to={backTo}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button variant="luxury" size="sm" to="/new-project">
          Create New Album
        </Button>
      </div>
    </div>
  );
}
