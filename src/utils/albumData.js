export const PPI = 300;
export const SAFETY_MARGIN_PX = 100;
export const CENTER_CLEARANCE_PX = 100;

export const EVENTS = [
  {
    id: 'wedding',
    label: 'Wedding',
    icon: 'Heart',
    description: 'Grand wedding celebrations & rituals',
    category: 'Wedding',
    colors: { primary: '#7550B8', secondary: '#F5F0FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Ivory, cream, and soft lavender gradients with gold accents',
    typography: 'Playfair Display serif headings with elegant typography',
    decoratives: ['Floral borders', 'Gold filigree', 'Champagne ribbons', 'Lace patterns'],
    textSuggestions: ['Wedding Moments', 'Forever Together', 'Our Wedding Story', 'The Beginning of Forever', 'A Lifetime of Love'],
    templates: ['Grand Hero Layout', 'Luxury Editorial', 'Cinematic Layout'],
    photoLayout: 'Large hero couple photos with supporting family and ritual images'
  },
  {
    id: 'engagement',
    label: 'Engagement',
    icon: 'Star',
    description: 'Ring exchange and romantic celebrations',
    category: 'Wedding',
    colors: { primary: '#9D6ED8', secondary: '#FBF5FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Soft blush, rose gold and lavender tones',
    typography: 'Romantic script paired with modern elegant serif',
    decoratives: ['Gold rings', 'Heart motifs', 'Soft sparkles', 'Pearl accents'],
    textSuggestions: ['Engaged', 'The Ring & The Promise', 'Forever Begins Today', 'Our Engagement Story'],
    templates: ['Couple Special Layout', 'Balanced Collage', 'Full-Bleed Layout'],
    photoLayout: 'Couple portraits as hero with close-up ring and detail shots'
  },
  {
    id: 'reception',
    label: 'Reception',
    icon: 'Wine',
    description: 'Grand evening party & celebrations',
    category: 'Wedding',
    colors: { primary: '#35204F', secondary: '#1A1522', accent: '#D4AF62', text: '#FFFFFF' },
    background: 'Premium dark backgrounds with cinematic gold highlights',
    typography: 'Bold serif with high contrast luxury aesthetic',
    decoratives: ['Gold borders', 'Cinematic light effects', 'Dark velvet textures', 'Spotlight glows'],
    textSuggestions: ['The Grand Reception', 'Celebration Night', 'A Night to Remember', 'Royal Evening'],
    templates: ['Cinematic Layout', 'Grand Hero Layout', 'Balanced Collage'],
    photoLayout: 'Wide reception hall shots with candid guest and stage moments'
  },
  {
    id: 'pre-wedding',
    label: 'Pre-Wedding',
    icon: 'Camera',
    description: 'Romantic outdoor and creative portraits',
    category: 'Wedding',
    colors: { primary: '#6B46C1', secondary: '#F5F0FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Scenic outdoor palettes with soft natural tones',
    typography: 'Light elegant serif with airy letter spacing',
    decoratives: ['Leaf silhouettes', 'Soft sun flares', 'Nature frames', 'Watercolor washes'],
    textSuggestions: ['Before Forever', 'Our Pre-Wedding Journey', 'The Road to I Do', 'Moments Before Forever'],
    templates: ['Luxury Editorial', 'Minimal Luxury', 'Full-Bleed Layout'],
    photoLayout: 'Full-bleed scenic couple portraits with nature and architectural backgrounds'
  },
  {
    id: 'post-wedding',
    label: 'Post-Wedding',
    icon: 'Sparkles',
    description: 'Newlywed memories and post-ceremony shoot',
    category: 'Wedding',
    colors: { primary: '#7550B8', secondary: '#EDE3FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Warm champagne, ivory, and golden light tones',
    typography: 'Warm serif with gentle curves and refined rhythm',
    decoratives: ['Gold ribbons', 'Wedding rings', 'Floral wreaths', 'Soft glows'],
    textSuggestions: ['After the Vows', 'Our First Days Together', 'Post-Wedding Bliss', 'Newly Married'],
    templates: ['Traditional Wedding', 'Balanced Collage', 'Couple Special Layout'],
    photoLayout: 'Couple portraits with family and peaceful candid moments'
  },
  {
    id: 'haldi',
    label: 'Haldi',
    icon: 'Sun',
    description: 'Turmeric ceremony full of joy and color',
    category: 'Traditional',
    colors: { primary: '#D97706', secondary: '#FEF3C7', accent: '#F59E0B', text: '#451A03' },
    background: 'Yellow, turmeric, and marigold festive warm tones',
    typography: 'Bright cheerful and celebratory typography',
    decoratives: ['Turmeric bowls', 'Marigold flowers', 'Haldi paste splashes', 'Yellow ribbons'],
    textSuggestions: ['Haldi Ceremony', 'Turmeric Glow', 'Golden Blessings', 'Joy & Marigolds'],
    templates: ['Creative Asymmetric', 'Balanced Collage', 'Grand Hero Layout'],
    photoLayout: 'Bright candid ceremony shots with family applying haldi and splashes'
  },
  {
    id: 'mehendi',
    label: 'Mehendi',
    icon: 'Flower',
    description: 'Henna celebration with music and patterns',
    category: 'Traditional',
    colors: { primary: '#15803D', secondary: '#F0FDF4', accent: '#D4AF62', text: '#14532D' },
    background: 'Green, emerald, and floral traditional patterns',
    typography: 'Flowing script with organic floral motifs',
    decoratives: ['Henna patterns', 'Marigold garlands', 'Peacock motifs', 'Leaf vines'],
    textSuggestions: ['Mehendi Ceremony', 'Henna Night', 'Green & Gold Memories', 'Colors of Henna'],
    templates: ['Floral Layout', 'Creative Asymmetric', 'Balanced Collage'],
    photoLayout: 'Mehendi hand and feet close-ups with ceremony and joyous portraits'
  },
  {
    id: 'sangeet',
    label: 'Sangeet',
    icon: 'Music',
    description: 'Musical night of dance and celebration',
    category: 'Wedding',
    colors: { primary: '#7C3AED', secondary: '#F5F3FF', accent: '#F59E0B', text: '#4338CA' },
    background: 'Vibrant purple, electric blue, and gold stage lights',
    typography: 'Bold energetic sans-serif and luxury serif accents',
    decoratives: ['Musical notes', 'Dhol drums', 'Dance silhouettes', 'Stage lights'],
    textSuggestions: ['Sangeet Night', 'Musical Celebration', 'Dance, Love & Joy', 'The Sangeet Celebration'],
    templates: ['Cinematic Layout', 'Creative Asymmetric', 'Balanced Collage'],
    photoLayout: 'Dynamic dance performances and energetic family group shots'
  },
  {
    id: 'birthday',
    label: 'Birthday',
    icon: 'Cake',
    description: 'Milestone and birthday celebrations',
    category: 'Celebration',
    colors: { primary: '#7550B8', secondary: '#F5F0FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Festive confetti, pastel balloons, and celebratory palettes',
    typography: 'Playful yet modern rounded typography',
    decoratives: ['Balloons', 'Confetti', 'Party hats', 'Streamers'],
    textSuggestions: ['Happy Birthday', 'Celebrating You', 'Another Year Wonderful', 'Birthday Joy'],
    templates: ['Creative Asymmetric', 'Balanced Collage', 'Grand Hero Layout'],
    photoLayout: 'Portrait subject as hero with cake cutting and guest photos'
  },
  {
    id: 'baby-shower',
    label: 'Baby Shower',
    icon: 'Baby',
    description: 'Welcoming the upcoming bundle of joy',
    category: 'Family',
    colors: { primary: '#8B5CF6', secondary: '#F0F9FF', accent: '#D4AF62', text: '#1E1B4B' },
    background: 'Soft pastel washes of mint, blush, and cloud blue',
    typography: 'Soft rounded script with gentle curves',
    decoratives: ['Rattles', 'Booties', 'Clouds', 'Stars'],
    textSuggestions: ['Welcome Little One', 'Baby Shower Love', 'Waiting For You', 'Tiny Blessings'],
    templates: ['Minimal Luxury', 'Creative Asymmetric', 'Balanced Collage'],
    photoLayout: 'Expecting parents portraits with decor and shower blessing moments'
  },
  {
    id: 'maternity',
    label: 'Maternity',
    icon: 'HeartHandshake',
    description: 'Graceful pregnancy and motherhood photoshoot',
    category: 'Family',
    colors: { primary: '#7550B8', secondary: '#FDF2F8', accent: '#D4AF62', text: '#1E1B4B' },
    background: 'Soft ivory, blush gradients, and natural light tones',
    typography: 'Elegant serif with flowing timeless curves',
    decoratives: ['Floral crowns', 'Silk drapes', 'Soft glows', 'Leaf frames'],
    textSuggestions: ['Maternity Glow', 'Our Little Miracle', 'The Beauty of Motherhood', 'A New Chapter'],
    templates: ['Premium Portrait Layout', 'Minimal Luxury', 'Full-Bleed Layout'],
    photoLayout: 'Maternity portraits as grand hero with soft detail shots'
  },
  {
    id: 'newborn-baby',
    label: 'Newborn Baby',
    icon: 'Smile',
    description: 'Pure and tender early days of babyhood',
    category: 'Family',
    colors: { primary: '#8B5CF6', secondary: '#F0FDF4', accent: '#D4AF62', text: '#1E1B4B' },
    background: 'Pure white, gentle cream, and feather-soft pastel washes',
    typography: 'Delicate script with generous breathing space',
    decoratives: ['Tiny crowns', 'Soft blankets', 'Cloud motifs', 'Baby footprints'],
    textSuggestions: ['Welcome to the World', 'Pure Love', 'Tiny Hands & Feet', 'First Precious Days'],
    templates: ['Premium Portrait Layout', 'Minimal Luxury', 'Balanced Collage'],
    photoLayout: 'Close-up newborn portraits with parents holding hands and sleeping poses'
  },
  {
    id: 'naming-ceremony',
    label: 'Naming Ceremony',
    icon: 'Gift',
    description: 'Traditional blessing and naming ceremony',
    category: 'Traditional',
    colors: { primary: '#7550B8', secondary: '#FEF9C3', accent: '#D4AF62', text: '#29213A' },
    background: 'Traditional cream and gold with floral accents',
    typography: 'Classic serif with formal spacing',
    decoratives: ['Name plaques', 'Flowers', 'Traditional ornaments', 'Blessing symbols'],
    textSuggestions: ['Naming Ceremony', 'A Blessed Name', 'Grace & Blessings', "Our Child's Name"],
    templates: ['Traditional Wedding', 'Balanced Collage', 'Grand Hero Layout'],
    photoLayout: 'Baby portrait as hero with elders blessing and family ceremony'
  },
  {
    id: 'cradle-ceremony',
    label: 'Cradle Ceremony',
    icon: 'Moon',
    description: 'Traditional cradle ceremony celebration',
    category: 'Traditional',
    colors: { primary: '#7550B8', secondary: '#F5F0FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Soft gold and ivory with traditional motifs',
    typography: 'Elegant serif with cultural flourishes',
    decoratives: ['Cradle illustrations', 'Gold bangles', 'Flowers', 'Traditional borders'],
    textSuggestions: ['Cradle Ceremony', 'In the Golden Cradle', 'Blessed Beginnings', 'Sweet Dreams'],
    templates: ['Traditional Wedding', 'Balanced Collage', 'Minimal Luxury'],
    photoLayout: 'Baby in decorated cradle as hero with family blessing moments'
  },
  {
    id: 'puberty-function',
    label: 'Puberty Function / Half Saree',
    icon: 'Sparkle',
    description: 'Coming of age traditional celebration',
    category: 'Traditional',
    colors: { primary: '#9333EA', secondary: '#FDF4FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Rich traditional silk colors with gold borders',
    typography: 'Formal serif with decorative luxury headers',
    decoratives: ['Saree drapes', 'Gold jewellery', 'Jasmine flowers', 'Traditional borders'],
    textSuggestions: ['Half Saree Ceremony', 'Tradition & Grace', 'A Beautiful Milestone', 'Blooming into Grace'],
    templates: ['Traditional Wedding', 'Grand Hero Layout', 'Balanced Collage'],
    photoLayout: 'Ceremony subject portrait as hero in traditional attire with family'
  },
  {
    id: 'housewarming',
    label: 'Housewarming',
    icon: 'Home',
    description: 'Blessing and entering a new home (Griha Pravesh)',
    category: 'Family',
    colors: { primary: '#059669', secondary: '#ECFDF5', accent: '#D4AF62', text: '#064E3B' },
    background: 'Fresh green, auspicious vermilion, and warm homey tones',
    typography: 'Clean welcoming sans-serif and traditional serif',
    decoratives: ['Traditional lamp', 'Mango leaves', 'Rangoli designs', 'Door frame borders'],
    textSuggestions: ['Griha Pravesh', 'Home Sweet Home', 'New Beginnings', 'Blessings in Our New Home'],
    templates: ['Minimal Luxury', 'Balanced Collage', 'Grand Hero Layout'],
    photoLayout: 'New home pooja and entrance shots with family gatherings'
  },
  {
    id: 'wedding-anniversary',
    label: 'Wedding Anniversary',
    icon: 'Award',
    description: 'Celebrating enduring love and milestones',
    category: 'Wedding',
    colors: { primary: '#7550B8', secondary: '#FAF5FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Romantic gold, champagne, and deep purple gradients',
    typography: 'Elegant serif with romantic flourishes',
    decoratives: ['Anniversary rings', 'Milestone numbers', 'Hearts', 'Champagne glasses'],
    textSuggestions: ['Years of Togetherness', 'Forever and Always', 'Celebrating Our Love', 'Golden Milestone'],
    templates: ['Luxury Editorial', 'Couple Special Layout', 'Full-Bleed Layout'],
    photoLayout: 'Couple portraits through the years with family and dinner party moments'
  },
  {
    id: 'retirement-function',
    label: 'Retirement Function',
    icon: 'Briefcase',
    description: 'Honoring a distinguished career and service',
    category: 'Corporate',
    colors: { primary: '#1E3A8A', secondary: '#EFF6FF', accent: '#D4AF62', text: '#1E3A8A' },
    background: 'Professional navy, gold, and regal parchment tones',
    typography: 'Clean dignified serif and modern sans-serif',
    decoratives: ['Laurel wreaths', 'Milestone dates', 'Certificates', 'Gold borders'],
    textSuggestions: ['A Career of Honor', 'Happy Retirement', 'The Next Great Adventure', 'Honoring Your Legacy'],
    templates: ['Balanced Collage', 'Grand Hero Layout', 'Minimal Luxury'],
    photoLayout: 'Career milestone photos with speeches, awards, and colleague portraits'
  },
  {
    id: 'graduation',
    label: 'Graduation',
    icon: 'GraduationCap',
    description: 'Academic achievement and graduation day',
    category: 'Celebration',
    colors: { primary: '#1D4ED8', secondary: '#EFF6FF', accent: '#D4AF62', text: '#1D4ED8' },
    background: 'Academic sapphire blue and gold with graduation motifs',
    typography: 'Bold confident serif with contemporary flair',
    decoratives: ['Graduation caps', 'Diplomas', 'Stars', 'Laurel ribbons'],
    textSuggestions: ['Graduation Day', 'Class of Achievement', 'The Future Begins Here', 'Dreams Achieved'],
    templates: ['Grand Hero Layout', 'Balanced Collage', 'Minimal Luxury'],
    photoLayout: 'Graduate in cap and gown as hero with diploma and proud parents'
  },
  {
    id: 'corporate-events',
    label: 'Corporate Events',
    icon: 'Building',
    description: 'Conferences, summits, and annual galas',
    category: 'Corporate',
    colors: { primary: '#1E293B', secondary: '#F8FAFC', accent: '#3B82F6', text: '#0F172A' },
    background: 'Clean corporate slate, minimalist whites, and blue accents',
    typography: 'Modern crisp geometric sans-serif',
    decoratives: ['Clean lines', 'Geometric frames', 'Stage light motifs', 'Minimal dividers'],
    textSuggestions: ['Annual Summit', 'Leadership & Innovation', 'Excellence Celebrated', 'Global Gathering'],
    templates: ['Balanced Collage', 'Grand Hero Layout', 'Minimal Luxury'],
    photoLayout: 'Keynote speakers on stage with networking, awards, and group photos'
  },
  {
    id: 'family-function',
    label: 'Family Function',
    icon: 'Users',
    description: 'Reunions, get-togethers, and family celebrations',
    category: 'Family',
    colors: { primary: '#7550B8', secondary: '#F5F0FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Warm homey tones with gentle gold highlights',
    typography: 'Friendly welcoming serif and sans-serif',
    decoratives: ['Family trees', 'Decorative frames', 'Warm hearts', 'Gold corners'],
    textSuggestions: ['Family Reunion', 'Ties That Bind', 'Cherished Moments', 'Together Always'],
    templates: ['Balanced Collage', 'Traditional Wedding', 'Minimal Luxury'],
    photoLayout: 'Generational group portraits with candid dining and laughter moments'
  },
  {
    id: 'other-events',
    label: 'Other Events',
    icon: 'PlusCircle',
    description: 'Custom celebration or personalized occasion',
    category: 'Other',
    colors: { primary: '#7550B8', secondary: '#FAF8FF', accent: '#D4AF62', text: '#29213A' },
    background: 'Versatile elegant neutral palette with customizable tones',
    typography: 'Flexible timeless typography',
    decoratives: ['Minimalist lines', 'Modern borders', 'Subtle geometry', 'Gold accents'],
    textSuggestions: ['Special Memories', 'An Unforgettable Day', 'Moments to Remember', 'Celebration'],
    templates: ['Balanced Collage', 'Minimal Luxury', 'Grand Hero Layout'],
    photoLayout: 'Flexible composition adapting to portrait and landscape images'
  }
];

// Standard 9 Wedding Album Spread Sizes (Section 7.1)
// In wedding albums, the spread is open flat horizontally.
// For a "12 x 36 inch" album, the spread width is 36 inches, height is 12 inches.
// Left page = 18" x 12", Right page = 18" x 12". Center cutting line is at 18 inches (50%).
export const ALBUM_SIZES = [
  {
    id: '8x24',
    inches: '8 × 24',
    cm: '20.3 × 61.0',
    spreadWidth: 24,
    height: 8,
    pageWidth: 12,
    orientation: 'Landscape Spread',
    category: 'Mini Album',
    description: 'Compact 8" high x 24" wide spread (two 12x8" pages)'
  },
  {
    id: '10x30',
    inches: '10 × 30',
    cm: '25.4 × 76.2',
    spreadWidth: 30,
    height: 10,
    pageWidth: 15,
    orientation: 'Landscape Spread',
    category: 'Standard Album',
    description: 'Standard 10" high x 30" wide spread (two 15x10" pages)'
  },
  {
    id: '12x24',
    inches: '12 × 24',
    cm: '30.5 × 61.0',
    spreadWidth: 24,
    height: 12,
    pageWidth: 12,
    orientation: 'Square Spread',
    category: 'Standard Album',
    description: 'Square pages 12" high x 24" wide spread (two 12x12" square pages)'
  },
  {
    id: '12x30',
    inches: '12 × 30',
    cm: '30.5 × 76.2',
    spreadWidth: 30,
    height: 12,
    pageWidth: 15,
    orientation: 'Landscape Spread',
    category: 'Standard Album',
    description: 'Popular 12" high x 30" wide spread (two 15x12" pages)'
  },
  {
    id: '12x36',
    inches: '12 × 36',
    cm: '30.5 × 91.4',
    spreadWidth: 36,
    height: 12,
    pageWidth: 18,
    orientation: 'Landscape Spread',
    category: 'Premium Album',
    description: 'Flagship wedding size 12" high x 36" wide spread (two 18x12" pages)'
  },
  {
    id: '15x30',
    inches: '15 × 30',
    cm: '38.1 × 76.2',
    spreadWidth: 30,
    height: 15,
    pageWidth: 15,
    orientation: 'Square Spread',
    category: 'Premium Album',
    description: 'Grand square pages 15" high x 30" wide spread (two 15x15" square pages)'
  },
  {
    id: '15x36',
    inches: '15 × 36',
    cm: '38.1 × 91.4',
    spreadWidth: 36,
    height: 15,
    pageWidth: 18,
    orientation: 'Landscape Spread',
    category: 'Luxury Album',
    description: 'Luxury panoramic 15" high x 36" wide spread (two 18x15" pages)'
  },
  {
    id: '18x24',
    inches: '18 × 24',
    cm: '45.7 × 61.0',
    spreadWidth: 24,
    height: 18,
    pageWidth: 12,
    orientation: 'Portrait Spread',
    category: 'Luxury Album',
    description: 'Tower portrait 18" high x 24" wide spread (two 12x18" portrait pages)'
  },
  {
    id: '18x36',
    inches: '18 × 36',
    cm: '45.7 × 91.4',
    spreadWidth: 36,
    height: 18,
    pageWidth: 18,
    orientation: 'Square Spread',
    category: 'Luxury Album',
    description: 'Grand royal square 18" high x 36" wide spread (two 18x18" square pages)'
  }
];

export const SHEET_PRESETS = [5, 10, 15, 20, 25, 30, 36, 40, 50, 75, 100];

export function pixelsForSize(spreadWidthInches, heightInches, ppi = PPI) {
  return {
    width: Math.round(spreadWidthInches * ppi),
    height: Math.round(heightInches * ppi),
    pageWidth: Math.round((spreadWidthInches / 2) * ppi)
  };
}

export function calculateSafetyGuides(spreadWidthPx, heightPx, marginPx = SAFETY_MARGIN_PX) {
  const centerFoldX = Math.round(spreadWidthPx / 2);
  return {
    top: marginPx,
    bottom: heightPx - marginPx,
    left: marginPx,
    right: spreadWidthPx - marginPx,
    centerFoldX,
    centerClearanceLeft: centerFoldX - marginPx,
    centerClearanceRight: centerFoldX + marginPx,
    safeWidth: spreadWidthPx - marginPx * 2,
    safeHeight: heightPx - marginPx * 2
  };
}

export function createDefaultSheet(sheetIndex, event) {
  const eventBg = event?.colors?.secondary || '#FAF8FF';
  return {
    id: `sheet_${sheetIndex}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    sheetNumber: sheetIndex,
    title: `Sheet ${sheetIndex}`,
    background: {
      type: 'color',
      value: eventBg,
      gradient: null,
      css: null,
      image: null,
      templateId: null,
      opacity: 1
    },
    layers: []
  };
}
