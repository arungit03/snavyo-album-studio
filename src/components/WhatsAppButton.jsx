import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL, CONFIG } from '@/constants/config';

/**
 * Floating WhatsApp button rendered in the bottom-right corner of the storefront.
 * Reads the WhatsApp number from src/constants/config.js.
 */
export default function WhatsAppButton() {
  if (!WHATSAPP_URL || !CONFIG.features.showWhatsappButton) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-snavyo-purple text-white shadow-luxury hover:bg-snavyo-purple-dark hover:shadow-gold transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-snavyo-gold focus:ring-offset-2 focus:ring-offset-snavyo-background"
    >
      <MessageCircle className="w-5 h-5" aria-hidden="true" />
    </a>
  );
}