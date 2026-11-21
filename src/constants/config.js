//
// Global storefront configuration for SNAVYO ALBUM STUDIO.
// All contact, brand, and feature-flag values live here so they can be edited in one place.
//

export const CONFIG = {
  brand: {
    name: 'SNAVYO ALBUM STUDIO',
    tagline: 'CREATE. DESIGN. RELIVE.',
    company: 'SNAVYO VISUALS',
    colors: {
      background: '#F5F0FF',
      primary: '#7550B8',
      gold: '#D4AF62',
      white: '#FFFFFF',
    },
  },

  contact: {
    whatsapp: {
      enabled: true,
      number: '+919999999999', // PLACEHOLDER: replace with real WhatsApp number
      message: 'Hi SNAVYO VISUALS, I would like to know more about your album designs.',
    },
    phone: {
      enabled: true,
      number: '+919999999999', // PLACEHOLDER: replace with real phone number
      label: 'Call us',
    },
    email: {
      enabled: true,
      address: 'hello@snavyo.example', // PLACEHOLDER: replace with real email
    },
  },

  printSpecs: {
    resolution: '300 PPI',
    safetyMargin: '100 px',
    centerClearance: '100 px',
    formats: ['JPEG', 'PNG', 'PDF', 'PSD'],
    paper: 'Premium photo paper',
    binding: 'Lay-flat hardcover',
  },

  features: {
    showWhatsappButton: true,
    showPhoneButton: true,
    showEmailButton: true,
    showFaqAccordion: true,
    showThemeGallery: true,
    showOrientationShowcase: true,
  },

  // PLACEHOLDER values - replace with real data before launch
  placeholderNotices: {
    whatsapp: 'WhatsApp number is a placeholder. Update src/constants/config.js to enable.',
    phone: 'Phone number is a placeholder. Update src/constants/config.js to enable.',
    email: 'Email address is a placeholder. Update src/constants/config.js to enable.',
  },
};

export const WHATSAPP_URL = CONFIG.contact.whatsapp.enabled
  ? `https://wa.me/${CONFIG.contact.whatsapp.number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(CONFIG.contact.whatsapp.message)}`
  : null;

export const PHONE_URL = CONFIG.contact.phone.enabled
  ? `tel:${CONFIG.contact.phone.number.replace(/[^0-9+]/g, '')}`
  : null;

export const EMAIL_URL = CONFIG.contact.email.enabled
  ? `mailto:${CONFIG.contact.email.address}`
  : null;