import { Product } from '../types';

export type KoreanCategoryKey =
  | 'party-glam'
  | 'campus-cafe'
  | 'office-brunch'
  | 'bodycon-maxi'
  | 'sheath-aline'
  | 'relaxed-shirts';

export interface KoreanStoreSection {
  id: 'party-glam' | 'campus-cafe' | 'office-brunch';
  title: string;
  hangul: string;
  subtitle: string;
  badge: string;
  tagline: string;
  accentColor: string;
  bgGradient: string;
  border: string;
  filterKey: KoreanCategoryKey;
  image: string;
  images: string[];
  fitsCount: number;
  startingPrice: number;
  highlightPills: string[];
}

export const K_STORE_SECTIONS: KoreanStoreSection[] = [
  {
    id: 'party-glam',
    title: 'Party & Evening Glam',
    hangul: '파티 & 나이트 룩',
    subtitle: 'Figure-sculpting corset bodycons, satin cowl midis, chic shrugs & cocktail night fits',
    badge: '♡ CATEGORY 01',
    tagline: 'Corset Bodycons, Satin Midis & Evening Fits',
    accentColor: '#FF4D6D',
    bgGradient: 'from-[#FFF1F2] to-[#FFE4E6]',
    border: 'border-[#FECDD3]',
    filterKey: 'party-glam',
    image: '/Square Neck Backles Crisscross Yellow - 1.jpg',
    images: [
      '/Square Neck Backles Crisscross Yellow - 1.jpg',
      '/METRONAUT Women Bodycon Black - 1.webp',
      '/Traquila Women Bodycon Maroon - 1.webp',
      '/Women Cowl Neck Black - 1.jpg',
    ],
    fitsCount: 7,
    startingPrice: 599,
    highlightPills: ['Corset Bodycons', 'Satin Midis', 'Night Fits'],
  },
  {
    id: 'campus-cafe',
    title: 'Campus & Cafe Everyday',
    hangul: '캠퍼스 & 카페 데이',
    subtitle: 'Breezy relaxed cotton button-downs, light blue Seoul streetwear & casual flare dresses',
    badge: '♡ CATEGORY 02',
    tagline: 'Seoul Relaxed Cotton Shirts & Campus Fits',
    accentColor: '#7C3AED',
    bgGradient: 'from-[#F3EEFF] to-[#EDE9FE]',
    border: 'border-[#DDD6FE]',
    filterKey: 'campus-cafe',
    image: '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
    images: [
      '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
      '/Spense Clothing Women Relaxed Fit - 1.webp',
      '/maaesa Women Relaxed Fit Shirt - 1.webp',
      '/TIARA WORLD Women A-line White, Blue - 1.webp',
    ],
    fitsCount: 3,
    startingPrice: 549,
    highlightPills: ['Cotton Shirts', 'Streetwear Fits', 'Campus Casual'],
  },
  {
    id: 'office-brunch',
    title: 'Office & Weekend Brunch',
    hangul: '오피스 & 브런치 데이트',
    subtitle: 'Tailored desk-to-dinner sheath midis, elegant beige knits & boardroom poise',
    badge: '✧ CATEGORY 03',
    tagline: 'Tailored Sheath Midis & Minimalist Knits',
    accentColor: '#C026D3',
    bgGradient: 'from-[#FDF4FF] to-[#FAE8FF]',
    border: 'border-[#F5D0FE]',
    filterKey: 'office-brunch',
    image: '/PATTZALA Women Sheath Purple - 1.webp',
    images: [
      '/PATTZALA Women Sheath Purple - 1.webp',
      '/PATTZALA Women Sheath Black - 1.webp',
      '/Puff Sleeve Biege - 1.jpg',
      '/Women Cowl Neck Brown - 1.jpg',
    ],
    fitsCount: 5,
    startingPrice: 699,
    highlightPills: ['Tailored Sheaths', 'Minimalist Knits', 'Brunch Poise'],
  },
];

export interface KAestheticCategory {
  id: KoreanCategoryKey;
  name: string;
  hangul: string;
  tagline: string;
  priceBadge: string;
  image: string;
  filterKey: KoreanCategoryKey;
  bgGradient: string;
  accentColor: string;
  heartIcon?: string;
}

export interface KTrendBanner {
  id: string;
  title: string;
  hangul: string;
  subtitle: string;
  priceTag: string;
  image: string;
  filterTarget: KoreanCategoryKey;
  palette: {
    bg: string;
    border: string;
    pillBg: string;
    pillText: string;
    tagBg: string;
    tagText: string;
    patternColor: string;
  };
}

export interface KStampOccasion {
  id: string;
  title: string;
  hangul: string;
  subtitle: string;
  tagline: string;
  stampPrice: string;
  image: string;
  filterTarget: KoreanCategoryKey;
  stampColor: string;
  borderColor: string;
  accentBadge: string;
}

export interface KProduct extends Product {
  hangulName?: string;
  koreanTagline?: string;
  koreanCategory: KoreanCategoryKey;
  subCategoryRef?: string;
  aestheticBadge?: string;
  badgeType?: 'ig-link' | 'instant-checkout' | 'trending' | 'bestseller';
  gender: 'female';
}

export function getProductStoreSection(product: KProduct): 'party-glam' | 'campus-cafe' | 'office-brunch' {
  if (product.koreanCategory === 'party-glam') return 'party-glam';
  if (product.koreanCategory === 'campus-cafe') return 'campus-cafe';
  if (product.koreanCategory === 'office-brunch') return 'office-brunch';

  // ID-based specific mappings
  if (product.id === 'k-pattzala-sheath-midi' || product.id === 'k-stylecast-beige-bodycon') {
    return 'office-brunch';
  }
  if (
    product.id === 'k-spense-relaxed-shirt' ||
    product.id === 'k-maaesa-relaxed-shirt' ||
    product.id === 'k-tiara-world-a-line'
  ) {
    return 'campus-cafe';
  }
  return 'party-glam';
}

// =========================================================================
// 1. "SHOP BY KOREAN AESTHETIC" - EXACTLY 3 KOREAN CATEGORIES (2 PRODUCTS EACH)
// 100% Female-Focused Models & Verified Catalog Products
// =========================================================================
export const K_AESTHETIC_CATEGORIES: KAestheticCategory[] = [
  {
    id: 'bodycon-maxi',
    name: 'Party & Evening Glam',
    hangul: '파티 & 나이트 룩',
    tagline: 'Figure-sculpting corset bodycons, satin midis & night silhouettes',
    priceBadge: '7 Curated Fits',
    image: '/Square Neck Backles Crisscross Yellow - 1.jpg',
    filterKey: 'bodycon-maxi',
    bgGradient: 'from-[#FFF0F5] via-[#FFE4E1] to-[#FFD1DC]',
    accentColor: '#FF4D6D',
    heartIcon: '♡',
  },
  {
    id: 'sheath-aline',
    name: 'Sheath & A-Line Dresses',
    hangul: '테일러드 시스 & A라인',
    tagline: 'Tailored office sheaths, animal print bodycons & strapless fits',
    priceBadge: '6 Curated Fits',
    image: '/PATTZALA Women Sheath Purple - 1.webp',
    filterKey: 'sheath-aline',
    bgGradient: 'from-[#FDF4FF] via-[#FAE8FF] to-[#F5D0FE]',
    accentColor: '#C026D3',
    heartIcon: '♡',
  },
  {
    id: 'relaxed-shirts',
    name: 'Relaxed Shirts & Tops',
    hangul: '서울 릴랙스 캐주얼 셔츠',
    tagline: 'Breathable pure cotton button-downs & aesthetic printed tops',
    priceBadge: '2 Curated Fits',
    image: '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
    filterKey: 'relaxed-shirts',
    bgGradient: 'from-[#F3EEFF] via-[#E9D5FF] to-[#D8B4FE]',
    accentColor: '#7C3AED',
    heartIcon: '♡',
  },
];

// =========================================================================
// 2. "KOREAN TRENDS" - 3 SPOTLIGHT BANNERS (ONE FOR EACH CATEGORY)
// Grid-Lined Pastel Backgrounds
// =========================================================================
export const K_TREND_BANNERS: KTrendBanner[] = [
  {
    id: 'trend-bodycon',
    title: 'PARTY & EVENING GLAM',
    hangul: '미니멀 바디콘 & 맥시',
    subtitle: 'Corset Bodycons, Satin Midis & Shrug Fits',
    priceTag: '7 Fits • From ₹599',
    image: '/Square Neck Backles Crisscross Yellow - 1.jpg',
    filterTarget: 'bodycon-maxi',
    palette: {
      bg: 'bg-gradient-to-br from-[#FFF5F7] to-[#FFE4E8]',
      border: 'border-[#FFB6C1]',
      pillBg: 'bg-[#FF4D6D]',
      pillText: 'text-white',
      tagBg: 'bg-[#FF4D6D]/15',
      tagText: 'text-[#E11D48]',
      patternColor: '#FFCCD5',
    },
  },
  {
    id: 'trend-sheath-aline',
    title: 'SHEATH & A-LINE DRESSES',
    hangul: '시스 & 데님 플레어',
    subtitle: 'PATTZALA, DressBerry & StyleCast Fits',
    priceTag: '6 Fits • From ₹699',
    image: '/PATTZALA Women Sheath Purple - 1.webp',
    filterTarget: 'sheath-aline',
    palette: {
      bg: 'bg-gradient-to-br from-[#FDF4FF] to-[#FAE8FF]',
      border: 'border-[#F5D0FE]',
      pillBg: 'bg-[#C026D3]',
      pillText: 'text-white',
      tagBg: 'bg-[#C026D3]/15',
      tagText: 'text-[#86198F]',
      patternColor: '#F5D0FE',
    },
  },
  {
    id: 'trend-shirts',
    title: 'SEOUL RELAXED SHIRTS',
    hangul: '서울 릴랙스 캐주얼 셔츠',
    subtitle: 'Spense & maaesa Cotton Shirts',
    priceTag: '2 Fits • From ₹549',
    image: '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
    filterTarget: 'relaxed-shirts',
    palette: {
      bg: 'bg-gradient-to-br from-[#F3EEFF] to-[#EDE9FE]',
      border: 'border-[#DDD6FE]',
      pillBg: 'bg-[#7C3AED]',
      pillText: 'text-white',
      tagBg: 'bg-[#7C3AED]/15',
      tagText: 'text-[#6D28D9]',
      patternColor: '#DDD6FE',
    },
  },
];

// =========================================================================
// 3. "SHOP BY OCCASION" (Postage Stamp Frame Section - 3 Occasions)
// Interactive cards with pastel postage stamp cutouts & perforations
// =========================================================================
export const K_STAMP_OCCASIONS: KStampOccasion[] = [
  {
    id: 'occ-party',
    title: 'Party & Evening Glam',
    hangul: '파티 & 나이트 룩',
    subtitle: 'Figure-sculpting corset bodycons, satin midis & shrug silhouettes',
    tagline: 'Corset Bodycons, Satin Midis & Evening Shrugs',
    stampPrice: '7 Fits • From ₹599',
    image: '/Square Neck Backles Crisscross Yellow - 1.jpg',
    filterTarget: 'bodycon-maxi',
    stampColor: 'from-[#FFF1F2] to-[#FFE4E6]',
    borderColor: 'border-[#FECDD3]',
    accentBadge: '♡ PARTY GLAM',
  },
  {
    // CARD 2: Office & Weekend Brunch (Now showing Campus Products)
    id: 'occ-office-brunch',
    title: 'Office & Weekend Brunch',
    hangul: '캠퍼스 & 카페 데이',
    subtitle: 'Breezy relaxed button-downs & artistic printed rayon shirts',
    tagline: 'Spense & maaesa Cotton Shirts',
    stampPrice: '2 Fits • From ₹549',
    image: '/maaesa Women Relaxed Fit Shirt - 1.webp',
    filterTarget: 'relaxed-shirts',
    stampColor: 'from-[#F3EEFF] to-[#EDE9FE]',
    borderColor: 'border-[#DDD6FE]',
    accentBadge: '♡ CAMPUS & CAFE',
  },
  {
    // CARD 3: Campus & Cafe Everyday (Now showing Office Products)
    id: 'occ-campus-cafe',
    title: 'Campus & Cafe Everyday',
    hangul: '오피스 & 브런치 데이트',
    subtitle: 'Tailored desk-to-dinner sheaths, animal print & strapless minis',
    tagline: 'PATTZALA, DressBerry & StyleCast Fits',
    stampPrice: '6 Fits • From ₹699',
    image: '/TIARA WORLD Women A-line White, Blue - 1.webp',
    filterTarget: 'sheath-aline',
    stampColor: 'from-[#FDF4FF] to-[#FAE8FF]',
    borderColor: 'border-[#F5D0FE]',
    accentBadge: '✧ OFFICE & BRUNCH',
  },
];

// =========================================================================
// 4. 100% FEMALE-FOCUSED K-AESTHETIC PRODUCTS
// STRICTLY THE 6 USER-SELECTED PRODUCTS (3 CATEGORIES x 2 PRODUCTS EACH)
// NO UNSELECTED PRODUCTS - NO UNWANTED ITEMS
// =========================================================================
export const K_PRODUCTS: KProduct[] = [
  // -----------------------------------------------------------------------
  // CATEGORY 1: BODYCON & MAXI DRESSES (2 PRODUCTS)
  // -----------------------------------------------------------------------
  // 1. METRONAUT Minimalist Bodycon Maxi Dress
  {
    id: 'k-metronaut-bodycon-maxi',
    name: 'METRONAUT Women Minimalist Bodycon Black & Wine Maxi Dress',
    hangulName: '메트로넛 미니멀리스트 바디콘 맥시 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Korean Store',
    price: 599,
    originalPrice: 1999, // 70% OFF
    image: '/METRONAUT Women Bodycon Black - 1.webp',
    galleryImages: [
      '/METRONAUT Women Bodycon Black - 1.webp',
      '/METRONAUT Women Bodycon Black -2.webp',
      '/METRONAUT Women Bodycon Black - 3.webp',
      '/METRONAUT Women Bodycon Black - 4.webp',
      '/METRONAUT Women Bodycon Black - 5.webp',
      '/METRONAUT Women Bodycon Wine - 1.webp',
      '/METRONAUT Women Bodycon Wine - 2.webp',
      '/METRONAUT Women Bodycon Wine - 3.webp',
      '/METRONAUT Women Bodycon Wine - 4.webp',
      '/METRONAUT Women Bodycon Wine - 5.webp',
    ],
    fabric: 'Polyester Blend / Stretch Knit',
    color: 'Black & Wine',
    description: 'Elevate your aesthetic wardrobe with this figure-sculpting Korean minimalist bodycon maxi dress. Crafted with a premium stretch-knit drape, clean round neckline, and sleek floor-length silhouette.',
    craftDetails: 'Brand: METRONAUT | Type: Bodycon Maxi Dress | Fit: Slim Fit | Length: Maxi / Floor Length | Neck: Round Neck | Sleeve: Sleeveless | Pattern: Solid | Occasion: Party, Evening & Casual | Care: Machine Wash Cold',
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 420,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    koreanTagline: 'Trending Minimalist Silhouette',
    aestheticBadge: '♡ Minimalist Maxi',
    badgeType: 'instant-checkout',
    availableColors: ['Black', 'Wine'],
    colorVariants: [
      {
        name: 'Black',
        image: '/METRONAUT Women Bodycon Black - 1.webp',
        galleryImages: [
          '/METRONAUT Women Bodycon Black - 1.webp',
          '/METRONAUT Women Bodycon Black -2.webp',
          '/METRONAUT Women Bodycon Black - 3.webp',
          '/METRONAUT Women Bodycon Black - 4.webp',
          '/METRONAUT Women Bodycon Black - 5.webp',
        ],
        hex: '#111827',
      },
      {
        name: 'Wine',
        image: '/METRONAUT Women Bodycon Wine - 1.webp',
        galleryImages: [
          '/METRONAUT Women Bodycon Wine - 1.webp',
          '/METRONAUT Women Bodycon Wine - 2.webp',
          '/METRONAUT Women Bodycon Wine - 3.webp',
          '/METRONAUT Women Bodycon Wine - 4.webp',
          '/METRONAUT Women Bodycon Wine - 5.webp',
        ],
        hex: '#831843',
      },
    ],
    gender: 'female',
  },

  // 2. Traquila Women Bodycon Square Neck Midi Dress
  {
    id: 'k-traquila-bodycon-midi',
    name: 'Traquila Women Bodycon Square Neck Midi Dress',
    hangulName: '트라킬라 스퀘어넥 바디콘 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Korean Store',
    price: 649,
    originalPrice: 2199, // 70% OFF
    image: '/Traquila Women Bodycon Black - 1.webp',
    galleryImages: [
      '/Traquila Women Bodycon Black - 1.webp',
      '/Traquila Women Bodycon Black - 2.webp',
      '/Traquila Women Bodycon Black - 3.webp',
      '/Traquila Women Bodycon Black - 4.webp',
      '/Traquila Women Bodycon Black - 5.webp',
      '/Traquila Women Bodycon Maroon - 1.webp',
      '/Traquila Women Bodycon Maroon - 2.webp',
      '/Traquila Women Bodycon Maroon - 3.webp',
      '/Traquila Women Bodycon Maroon -  4.webp',
      '/Traquila Women Bodycon Maroon - 5.webp',
    ],
    fabric: 'Ribbed Knit & Elastane',
    color: 'Black & Maroon',
    description: 'Chic Gen-Z Korean nightlife and weekend date bodycon dress with flattering square neckline, snug contouring stretch fabric, and comfortable midi length.',
    craftDetails: 'Brand: Traquila | Type: Bodycon Midi Dress | Neck: Square Neck | Sleeve: Sleeveless / Strappy | Pattern: Solid Ribbed | Occasion: Night Out, Club, Party & Date',
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 380,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    koreanTagline: 'Seoul Nightlife & Cafe Chic',
    aestheticBadge: '🔥 Trending Fit',
    badgeType: 'instant-checkout',
    availableColors: ['Black', 'Maroon'],
    colorVariants: [
      {
        name: 'Black',
        image: '/Traquila Women Bodycon Black - 1.webp',
        galleryImages: [
          '/Traquila Women Bodycon Black - 1.webp',
          '/Traquila Women Bodycon Black - 2.webp',
          '/Traquila Women Bodycon Black - 3.webp',
          '/Traquila Women Bodycon Black - 4.webp',
          '/Traquila Women Bodycon Black - 5.webp',
        ],
        hex: '#09090b',
      },
      {
        name: 'Maroon',
        image: '/Traquila Women Bodycon Maroon - 1.webp',
        galleryImages: [
          '/Traquila Women Bodycon Maroon - 1.webp',
          '/Traquila Women Bodycon Maroon - 2.webp',
          '/Traquila Women Bodycon Maroon - 3.webp',
          '/Traquila Women Bodycon Maroon -  4.webp',
          '/Traquila Women Bodycon Maroon - 5.webp',
        ],
        hex: '#7f1d1d',
      },
    ],
    gender: 'female',
  },

  // 3. Square Neck Backless Crisscross Lace Up Ruched Boning Corset Bodycon Dress
  {
    id: 'k-corset-bodycon-dress',
    name: 'Square Neck Backless Crisscross Lace Up Ruched Boning Corset Bodycon Dress',
    hangulName: '스퀘어넥 백리스 레이스업 코르셋 바디콘 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Party & Evening Glam',
    price: 799,
    originalPrice: 1299,
    image: '/Square Neck Backles Crisscross Yellow - 1.jpg',
    galleryImages: [
      '/Square Neck Backles Crisscross Yellow - 1.jpg',
      '/Square Neck Backles Crisscross Yellow - 2.jpg',
      '/Square Neck Backles Crisscross Yellow - 3.jpg',
      '/Square Neck Backles Crisscross Yellow - 4.jpg',
      '/Square Neck Backles Crisscross White - 1.jpg',
      '/Square Neck Backles Crisscross White - 2.jpg',
      '/Square Neck Backles Crisscross White - 3.jpg',
      '/Square Neck Backles Crisscross Black - 1.jpg',
      '/Square Neck Backles Crisscross Black - 2.jpg',
      '/Square Neck Backles Crisscross Black - 3.jpg',
      '/Square Neck Backles Crisscross Black - 4.jpg',
      '/Square Neck Backles Crisscross Red - 1.jpg',
      '/Square Neck Backles Crisscross Red - 2.jpg',
      '/Square Neck Backles Crisscross Red - 3.jpg',
      '/Square Neck Backles Crisscross Red - 4.jpg',
    ],
    fabric: 'Polyester Blend with Elastane & Satin Lining',
    color: 'Yellow (Also in White, Black, Red)',
    availableColors: ['Yellow', 'White', 'Black', 'Red'],
    colorVariants: [
      {
        name: 'Yellow',
        image: '/Square Neck Backles Crisscross Yellow - 1.jpg',
        galleryImages: [
          '/Square Neck Backles Crisscross Yellow - 1.jpg',
          '/Square Neck Backles Crisscross Yellow - 2.jpg',
          '/Square Neck Backles Crisscross Yellow - 3.jpg',
          '/Square Neck Backles Crisscross Yellow - 4.jpg',
        ],
        hex: '#eab308',
      },
      {
        name: 'White',
        image: '/Square Neck Backles Crisscross White - 1.jpg',
        galleryImages: [
          '/Square Neck Backles Crisscross White - 1.jpg',
          '/Square Neck Backles Crisscross White - 2.jpg',
          '/Square Neck Backles Crisscross White - 3.jpg',
        ],
        hex: '#ffffff',
      },
      {
        name: 'Black',
        image: '/Square Neck Backles Crisscross Black - 1.jpg',
        galleryImages: [
          '/Square Neck Backles Crisscross Black - 1.jpg',
          '/Square Neck Backles Crisscross Black - 2.jpg',
          '/Square Neck Backles Crisscross Black - 3.jpg',
          '/Square Neck Backles Crisscross Black - 4.jpg',
        ],
        hex: '#18181b',
      },
      {
        name: 'Red',
        image: '/Square Neck Backles Crisscross Red - 1.jpg',
        galleryImages: [
          '/Square Neck Backles Crisscross Red - 1.jpg',
          '/Square Neck Backles Crisscross Red - 2.jpg',
          '/Square Neck Backles Crisscross Red - 3.jpg',
          '/Square Neck Backles Crisscross Red - 4.jpg',
        ],
        hex: '#b91c1c',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Glamorous Party and Festive creation featuring a square neckline, backless design with crisscross tie-up lace-back, structured ruched boning corset bodice, and concealed back zipper.',
    craftDetails: 'Shape: Bodycon | Neck: Square Neck | Length: Mini / Above Knee | Sleeves: Sleeveless | Closure: Concealed Zipper & Lace-Up Back | Boning: Structured Ruched Boning | Wash Care: Hand Wash or Gentle Machine Wash | Net Quantity: 1.',
    specs: {
      'Pattern': 'Solid',
      'Sleeve Length': 'Sleeveless',
      'Neck': 'Square Neck',
      'Length': 'Mini / Above Knee',
      'Closure': 'Concealed Back Zipper & Lace-Up',
      'Fit': 'Slim Fit / Bodycon',
      'Lining': 'Fully Lined',
      'Occasion': 'Party, Evening Glam & Cocktail',
      'Wash Care': 'Hand Wash or Gentle Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    koreanTagline: 'Ruched Corset Bodycon Fit',
    aestheticBadge: '♡ Party Glam',
    badgeType: 'instant-checkout',
    gender: 'female',
  },

  // 4. Women Crop Shrug
  {
    id: 'k-crop-shrug',
    name: 'Women Crop Shrug',
    hangulName: '여성 크롭 쉬러그 카디건',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Party & Evening Glam',
    price: 799,
    originalPrice: 1499,
    image: '/Women Crop Shrug - 1.jpg',
    galleryImages: [
      '/Women Crop Shrug - 1.jpg',
      '/Women Crop Shrug - 2.jpg',
      '/Women Crop Shrug - 3.jpg',
      '/Women Crop Shrug - 4.jpg',
      '/Women Crop Shrug - 5.jpg',
      '/Women Crop Shrug - 6.jpg',
    ],
    fabric: 'Soft Viscose Rayon Knit Blend',
    color: 'White',
    availableColors: ['White'],
    colorVariants: [
      {
        name: 'White',
        image: '/Women Crop Shrug - 1.jpg',
        galleryImages: [
          '/Women Crop Shrug - 1.jpg',
          '/Women Crop Shrug - 2.jpg',
          '/Women Crop Shrug - 3.jpg',
          '/Women Crop Shrug - 4.jpg',
          '/Women Crop Shrug - 5.jpg',
          '/Women Crop Shrug - 6.jpg',
        ],
        hex: '#ffffff',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Chic Women Crop Shrug designed with an open front and long sleeves. A versatile layering piece crafted from soft comfortable stretch fabric, perfect draped over bodycon dresses and evening party ensembles.',
    craftDetails: 'Length: Cropped | Front: Open Front | Sleeves: Long Sleeves | Fabric: Soft Viscose Rayon Knit Blend | Fit: Snug Regular Fit | Care: Machine Wash Gentle | Net Quantity: 1.',
    specs: {
      'Pattern': 'Solid',
      'Length': 'Cropped',
      'Sleeve Length': 'Long Sleeves',
      'Neck': 'Open Front',
      'Closure': 'Open Front Slip-On',
      'Occasion': 'Evening Glam, Party & Layering',
      'Wash Care': 'Machine Wash Gentle',
    },
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    koreanTagline: 'Chic Ribbed Crop Layer',
    aestheticBadge: '♡ Glam Shrug',
    badgeType: 'trending',
    gender: 'female',
  },

  // 5. Puff Sleeve A-Line Midi Dress
  {
    id: 'k-puff-sleeve-midi',
    name: 'Puff Sleeve A-Line Midi Dress',
    hangulName: '퍼프 슬리브 A라인 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Party & Evening Glam',
    price: 950,
    originalPrice: 2499,
    image: '/Puff Sleeve Brown - 1.jpg',
    galleryImages: [
      '/Puff Sleeve Brown - 1.jpg',
      '/Puff Sleeve Brown - 2.jpg',
      '/Puff Sleeve Brown - 3.jpg',
      '/Puff Sleeve Brown - 4.jpg',
      '/Puff Sleeve Biege - 1.jpg',
      '/Puff Sleeve Biege - 2.jpg',
      '/Puff Sleeve Biege - 3.jpg',
      '/Puff Sleeve Biege - 4.jpg',
      '/Puff Sleeve Red - 1.jpg',
      '/Puff Sleeve Red - 2.jpg',
      '/Puff Sleeve Red - 3.jpg',
      '/Puff Sleeve Red - 4.jpg',
      '/Puff Sleeve Turquiesh - 1.jpg',
      '/Puff Sleeve Turquiesh - 2.jpg',
      '/Puff Sleeve Turquiesh - 3.jpg',
      '/Puff Sleeve Turquiesh - 4.jpg',
    ],
    fabric: 'Textured Poly Cotton Blend & Crepe',
    color: 'Brown (Also in Beige, Red, Turquoise Blue)',
    availableColors: ['Brown', 'Beige', 'Red', 'Turquoise Blue'],
    colorVariants: [
      {
        name: 'Brown',
        image: '/Puff Sleeve Brown - 1.jpg',
        galleryImages: [
          '/Puff Sleeve Brown - 1.jpg',
          '/Puff Sleeve Brown - 2.jpg',
          '/Puff Sleeve Brown - 3.jpg',
          '/Puff Sleeve Brown - 4.jpg',
        ],
        hex: '#78350f',
      },
      {
        name: 'Beige',
        image: '/Puff Sleeve Biege - 1.jpg',
        galleryImages: [
          '/Puff Sleeve Biege - 1.jpg',
          '/Puff Sleeve Biege - 2.jpg',
          '/Puff Sleeve Biege - 3.jpg',
          '/Puff Sleeve Biege - 4.jpg',
        ],
        hex: '#d4b996',
      },
      {
        name: 'Red',
        image: '/Puff Sleeve Red - 1.jpg',
        galleryImages: [
          '/Puff Sleeve Red - 1.jpg',
          '/Puff Sleeve Red - 2.jpg',
          '/Puff Sleeve Red - 3.jpg',
          '/Puff Sleeve Red - 4.jpg',
        ],
        hex: '#b91c1c',
      },
      {
        name: 'Turquoise Blue',
        image: '/Puff Sleeve Turquiesh - 1.jpg',
        galleryImages: [
          '/Puff Sleeve Turquiesh - 1.jpg',
          '/Puff Sleeve Turquiesh - 2.jpg',
          '/Puff Sleeve Turquiesh - 3.jpg',
          '/Puff Sleeve Turquiesh - 4.jpg',
        ],
        hex: '#06b6d4',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Graceful A-Line Midi Dress featuring dramatic puff sleeves, sweetheart neckline, and a gathered empire waistline that cascades into a breezy flared hemline.',
    craftDetails: 'Shape: A-Line Midi | Neck: Sweetheart Neck | Sleeves: Short Puff Sleeves | Hem: Flared Hem | Care: Hand Wash or Dry Clean | Net Quantity: 1.',
    specs: {
      'Pattern': 'Solid',
      'Sleeve Length': 'Short Puff Sleeves',
      'Neck': 'Sweetheart Neck',
      'Length': 'Midi / Calf Length',
      'Fit': 'A-Line Fit & Flare',
      'Occasion': 'Evening Party, Festive & Cocktail',
      'Wash Care': 'Hand Wash or Dry Clean',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    koreanTagline: 'Flared Puff Sleeve Silhouette',
    aestheticBadge: '♡ Evening Flare',
    badgeType: 'bestseller',
    gender: 'female',
  },

  // 6. Women Cowl Neck Satin Fit & Flare Midi Dress With Slits
  {
    id: 'k-cowl-neck-satin',
    name: 'Women Cowl Neck Satin Fit & Flare Midi Dress With Slits',
    hangulName: '여성 카울넥 새틴 핏 앤 플레어 슬릿 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Party & Evening Glam',
    price: 699,
    originalPrice: 3399,
    image: '/Women Cowl Neck Brown - 1.jpg',
    galleryImages: [
      '/Women Cowl Neck Brown - 1.jpg',
      '/Women Cowl Neck Brown - 2.jpg',
      '/Women Cowl Neck Brown - 3.jpg',
      '/Women Cowl Neck Brown - 4.jpg',
      '/Women Cowl Neck Brown - 5.jpg',
      '/Women Cowl Neck Brown - 6.jpg',
      '/Women Cowl Neck Black - 1.jpg',
      '/Women Cowl Neck Black - 2.jpg',
      '/Women Cowl Neck Black - 3.jpg',
      '/Women Cowl Neck Gold - 1.jpg',
      '/Women Cowl Neck Gold - 2.jpg',
      '/Women Cowl Neck Gold - 3.jpg',
    ],
    fabric: 'Lustrous Silk Satin',
    color: 'Brown (Also in Black, Gold)',
    availableColors: ['Brown', 'Black', 'Gold'],
    colorVariants: [
      {
        name: 'Brown',
        image: '/Women Cowl Neck Brown - 1.jpg',
        galleryImages: [
          '/Women Cowl Neck Brown - 1.jpg',
          '/Women Cowl Neck Brown - 2.jpg',
          '/Women Cowl Neck Brown - 3.jpg',
          '/Women Cowl Neck Brown - 4.jpg',
          '/Women Cowl Neck Brown - 5.jpg',
          '/Women Cowl Neck Brown - 6.jpg',
        ],
        hex: '#6d3b24',
      },
      {
        name: 'Black',
        image: '/Women Cowl Neck Black - 1.jpg',
        galleryImages: [
          '/Women Cowl Neck Black - 1.jpg',
          '/Women Cowl Neck Black - 2.jpg',
          '/Women Cowl Neck Black - 3.jpg',
        ],
        hex: '#18181b',
      },
      {
        name: 'Gold',
        image: '/Women Cowl Neck Gold - 1.jpg',
        galleryImages: [
          '/Women Cowl Neck Gold - 1.jpg',
          '/Women Cowl Neck Gold - 2.jpg',
          '/Women Cowl Neck Gold - 3.jpg',
        ],
        hex: '#d97706',
      },
    ],
    sizes: ['M', 'L', 'XL'],
    description: 'Glamorous satin fit & flare midi dress boasting a lustrous sheen, elegant draped cowl neckline, delicate spaghetti straps, and alluring side slit.',
    craftDetails: 'Shape: Fit & Flare Midi | Neck: Cowl Neck | Sleeve: Sleeveless with Adjustable Spaghetti Straps | Slit: Thigh Slit | Care: Dry Clean or Gentle Cold Hand Wash | Net Quantity: 1.',
    specs: {
      'Pattern': 'Solid Silk Satin',
      'Neck': 'Cowl Neck',
      'Sleeve': 'Sleeveless / Adjustable Straps',
      'Hemline': 'Flared with Thigh Slit',
      'Length': 'Midi',
      'Closure': 'Side Concealed Zip',
      'Occasion': 'Cocktail, Evening Party & Festive',
      'Wash Care': 'Dry Clean or Gentle Cold Hand Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 167,
    inStock: true,
    koreanTagline: 'Silk Satin Cowl Drape',
    aestheticBadge: '♡ Satin Glam',
    badgeType: 'instant-checkout',
    gender: 'female',
  },

  // 7. Women Animal Print Bell Sleeve Fit & Flare Dress
  {
    id: 'k-animal-print-dress',
    name: 'Women Animal Print Bell Sleeve Fit & Flare Dress',
    hangulName: '여성 애니멀 프린트 벨 슬리브 핏 앤 플레어 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Party & Evening Glam',
    price: 949,
    originalPrice: 2999,
    image: '/Stylecast X Kotty 1.jpg',
    galleryImages: [
      '/Stylecast X Kotty 1.jpg',
      '/Stylecast X Kotty 2.jpg',
      '/Stylecast X Kotty 3.jpg',
      '/Stylecast X Kotty 4.jpg',
      '/Stylecast X Kotty 5.jpg',
    ],
    fabric: 'Georgette & Chiffon with Soft Lining',
    color: 'Green',
    availableColors: ['Green'],
    colorVariants: [
      {
        name: 'Green',
        image: '/Stylecast X Kotty 1.jpg',
        galleryImages: [
          '/Stylecast X Kotty 1.jpg',
          '/Stylecast X Kotty 2.jpg',
          '/Stylecast X Kotty 3.jpg',
          '/Stylecast X Kotty 4.jpg',
          '/Stylecast X Kotty 5.jpg',
        ],
        hex: '#15803d',
      },
    ],
    sizes: ['M', 'L', 'XL'],
    description: 'Eye-catching animal print fit & flare dress tailored with dramatic bell sleeves, a flattering empire waistline, and ruffled tiered hemline in fresh green tones.',
    craftDetails: 'Shape: Fit & Flare Tiered | Neck: V-Neck | Sleeves: 3/4 Bell Sleeves | Lining: Full Soft Lining | Length: Above Knee / Mini | Care: Machine Wash Gentle | Net Quantity: 1.',
    specs: {
      'Pattern': 'Animal Print',
      'Neck': 'V-Neck',
      'Sleeve Length': '3/4 Bell Sleeves',
      'Length': 'Above Knee / Mini',
      'Fit': 'Fit and Flare',
      'Lining': 'Full Body Lining',
      'Occasion': 'Party, Evening Glam & Day Out',
      'Wash Care': 'Machine Wash Gentle',
    },
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 93,
    inStock: true,
    koreanTagline: 'Animal Print Bell Sleeve Trend',
    aestheticBadge: '♡ Statement Glam',
    badgeType: 'trending',
    gender: 'female',
  },

  // -----------------------------------------------------------------------
  // CATEGORY 2: SHEATH & A-LINE DRESSES (2 PRODUCTS)
  // -----------------------------------------------------------------------
  // 3. PATTZALA Tailored Sheath Midi Dress
  {
    id: 'k-pattzala-sheath-midi',
    name: 'PATTZALA Women Tailored Sheath Midi Dress',
    hangulName: '파트잘라 테일러드 시스 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Korean Store',
    price: 699,
    originalPrice: 2499, // 72% OFF
    image: '/PATTZALA Women Sheath Purple - 1.webp',
    galleryImages: [
      '/PATTZALA Women Sheath Purple - 1.webp',
      '/PATTZALA Women Sheath Purple - 2.webp',
      '/PATTZALA Women Sheath Purple - 3.webp',
      '/PATTZALA Women Sheath Purple - 4.webp',
      '/PATTZALA Women Sheath Black - 1.webp',
      '/PATTZALA Women Sheath Black - 2.webp',
      '/PATTZALA Women Sheath Black - 3.webp',
      '/PATTZALA Women Sheath Black - 4.webp',
      '/PATTZALA Women Sheath Black - 5.webp',
      '/PATTZALA Women Sheath Green - 1.webp',
      '/PATTZALA Women Sheath Green - 2.webp',
      '/PATTZALA Women Sheath Green - 3.webp',
      '/PATTZALA Women Sheath Green - 4.webp',
      '/PATTZALA Women Sheath Wine - 1.jpeg',
      '/PATTZALA Women Sheath Wine - 2.jpeg',
      '/PATTZALA Women Sheath Wine - 3.jpeg',
      '/PATTZALA Women Sheath Wine - 4.jpeg',
      '/PATTZALA Women Sheath Wine - 5.jpeg',
      '/PATTZALA Women Sheath Wine - 6.jpeg',
      '/PATTZALA Women Sheath Wine - 7.jpeg',
    ],
    fabric: 'Crepe / Premium Polyester Blend',
    color: 'Purple, Black, Green & Wine',
    description: 'Sophisticated Korean office & campus presentation dress featuring an elegant calf-length hemline, tailored waist contours, and 3/4 sleeves suited for desk-to-dinner transitions.',
    craftDetails: 'Brand: PATTZALA | Type: Sheath Dress | Length: Midi / Calf Length | Neck: Round Neck | Sleeve: Three-Quarter Sleeves | Fit: Tailored Sheath Fit | Pattern: Solid | Occasion: Formal, Office & Evening Party',
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 310,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    koreanTagline: 'Seoul Boardroom & Presentation Fit',
    aestheticBadge: '✧ Office Chic Top Pick',
    badgeType: 'instant-checkout',
    availableColors: ['Purple', 'Black', 'Green', 'Wine'],
    colorVariants: [
      {
        name: 'Purple',
        image: '/PATTZALA Women Sheath Purple - 1.webp',
        galleryImages: [
          '/PATTZALA Women Sheath Purple - 1.webp',
          '/PATTZALA Women Sheath Purple - 2.webp',
          '/PATTZALA Women Sheath Purple - 3.webp',
          '/PATTZALA Women Sheath Purple - 4.webp',
        ],
        hex: '#7c3aed',
      },
      {
        name: 'Black',
        image: '/PATTZALA Women Sheath Black - 1.webp',
        galleryImages: [
          '/PATTZALA Women Sheath Black - 1.webp',
          '/PATTZALA Women Sheath Black - 2.webp',
          '/PATTZALA Women Sheath Black - 3.webp',
        ],
        hex: '#18181b',
      },
      {
        name: 'Green',
        image: '/PATTZALA Women Sheath Green - 1.webp',
        galleryImages: [
          '/PATTZALA Women Sheath Green - 1.webp',
          '/PATTZALA Women Sheath Green - 2.webp',
        ],
        hex: '#059669',
      },
      {
        name: 'Wine',
        image: '/PATTZALA Women Sheath Wine - 1.jpeg',
        galleryImages: [
          '/PATTZALA Women Sheath Wine - 1.jpeg',
          '/PATTZALA Women Sheath Wine - 2.jpeg',
        ],
        hex: '#881337',
      },
    ],
    gender: 'female',
  },

  // 4. TIARA WORLD Denim Blue & White A-line Dress
  {
    id: 'k-tiara-world-a-line',
    name: 'TIARA WORLD Women Denim Blue & White A-line Dress',
    hangulName: '티아라 월드 플로럴 데님 A라인 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Korean Store',
    price: 799,
    originalPrice: 2299, // 65% OFF
    image: '/TIARA WORLD Women A-line White, Blue - 1.webp',
    galleryImages: [
      '/TIARA WORLD Women A-line White, Blue - 1.webp',
      '/TIARA WORLD Women A-line White, Blue - 2.webp',
      '/TIARA WORLD Women A-line White, Blue - 3.webp',
      '/TIARA WORLD Women A-line White, Blue - 4.webp',
    ],
    fabric: 'Cotton Blend & Lightweight Denim',
    color: 'White & Denim Blue',
    description: 'Fresh and charming Korean youth aesthetic dress combining crisp white bodice styling with denim blue A-line flare, romantic waist tie, and effortless movement.',
    craftDetails: 'Brand: TIARA WORLD | Type: A-line Dress | Length: Knee / Midi Length | Neck: Sweetheart / Square Neck | Pattern: Floral Print / Contrast Denim | Occasion: Casual, Campus & Cafe Date',
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 265,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    koreanTagline: 'Trending K-Drama Campus Fit',
    aestheticBadge: '♡ K-Drama Romance',
    badgeType: 'instant-checkout',
    availableColors: ['White & Denim Blue'],
    gender: 'female',
  },

  // 4b. DressBerry Animal Printed Bodycon Mini Dress
  {
    id: 'k-dressberry-animal-bodycon',
    name: 'DressBerry Animal Printed Bodycon Mini Dress',
    hangulName: '드레스베리 애니멀 프린트 바디콘 미니 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Korean Store',
    price: 699,
    originalPrice: 1199,
    image: '/DressBerry 1.jpg',
    galleryImages: [
      '/DressBerry 1.jpg',
      '/DressBerry 2.jpg',
      '/DressBerry 3.jpg',
      '/DressBerry 4.jpg',
    ],
    fabric: '100% Polyester Knit',
    color: 'Cheetah (Black & Beige)',
    availableColors: ['Cheetah (Black & Beige)'],
    description: 'Black and Beige Animal Print Bodycon dress with shoulder straps, sleeveless cut, straight hem with side slit detail, and concealed zip closure.',
    craftDetails: 'Shape: Bodycon | Neck: Shoulder Straps | Length: Mini | Sleeve: Sleeveless | Closure: Concealed Zip | Surface Styling: Slits | Care: Machine Wash',
    specs: {
      'Shape': 'Bodycon',
      'Neck': 'Shoulder Straps',
      'Length': 'Mini',
      'Sleeve Length': 'Sleeveless',
      'Pattern': 'Animal Print',
      'Surface Styling': 'Slits',
      'Closure': 'Concealed Zip',
      'Fabric': '100% Polyester',
      'Occasion': 'Party, Club & Evening Glam',
      'Wash Care': 'Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 138,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    koreanTagline: 'Cheetah Slit Bodycon Silhouette',
    aestheticBadge: '♡ Animal Chic',
    badgeType: 'trending',
    gender: 'female',
  },

  // 4c. StyleCast Beige Solid Bodycon Mini Dress
  {
    id: 'k-stylecast-beige-bodycon',
    name: 'StyleCast Beige Solid Bodycon Mini Dress',
    hangulName: '스타일캐스트 베이지 솔리드 바디콘 미니 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Korean Store',
    price: 1299,
    originalPrice: 2899,
    image: '/StyleCast 1.jpg',
    galleryImages: [
      '/StyleCast 1.jpg',
      '/StyleCast 2.jpg',
      '/StyleCast 3.jpg',
      '/StyleCast 4.jpg',
      '/StyleCast 5.jpg',
      '/StyleCast 6.jpg',
      '/StyleCast 7.jpg',
      '/StyleCast 8.jpg',
    ],
    fabric: 'Knitted Stretch Polyester',
    color: 'Beige',
    availableColors: ['Beige'],
    description: 'Beige solid bodycon mini dress featuring sleek shoulder straps, knitted stretch comfort, sleeveless silhouette, and straight hemline.',
    craftDetails: 'Shape: Bodycon | Neck: Shoulder Straps | Length: Mini | Sleeves: Sleeveless | Knit or Woven: Knitted | Hemline: Straight | Care: Machine Wash',
    specs: {
      'Shape': 'Bodycon',
      'Neck': 'Shoulder Straps',
      'Length': 'Mini',
      'Sleeve Length': 'Sleeveless',
      'Knit or Woven': 'Knitted',
      'Pattern': 'Solid',
      'Fabric': 'Polyester',
      'Occasion': 'Office Casual, Date Night & Party',
      'Wash Care': 'Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 162,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    koreanTagline: 'Minimalist Knitted Bodycon',
    aestheticBadge: '♡ Clean Beige',
    badgeType: 'bestseller',
    gender: 'female',
  },

  // 4d. White Strapless Bodycon Midi Dress
  {
    id: 'k-white-strapless-bodycon',
    name: 'White Strapless Bodycon Midi Dress',
    hangulName: '화이트 스트랩리스 스모킹 바디콘 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Korean Store',
    price: 2499,
    originalPrice: 2499,
    image: '/White Strapless Bodycon 1.jpg',
    galleryImages: [
      '/White Strapless Bodycon 1.jpg',
      '/White Strapless Bodycon 2.jpg',
      '/White Strapless Bodycon 3.jpg',
      '/White Strapless Bodycon 4.jpg',
    ],
    fabric: 'Knitted Polyester with Smocked Elasticity',
    color: 'White',
    availableColors: ['White'],
    description: 'Stunning white strapless bodycon dress crafted from soft textured knitted fabric with flattering smocked surface detailing and sleek figure-hugging fit.',
    craftDetails: 'Shape: Bodycon | Neck: Shoulder Straps / Strapless | Length: Mini / Midi | Sleeves: Sleeveless | Surface Styling: Smocked | Fabric: Knitted Polyester | Care: Machine Wash',
    specs: {
      'Shape': 'Bodycon',
      'Neck': 'Strapless / Shoulder Straps',
      'Length': 'Mini / Midi',
      'Sleeve Length': 'Sleeveless',
      'Surface Styling': 'Smocked',
      'Fabric': 'Knitted Polyester',
      'Occasion': 'Resort, Party & Evening Out',
      'Wash Care': 'Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 79,
    inStock: true,
    sizes: ['S', 'M', 'L'],
    koreanTagline: 'Smocked Strapless Contour',
    aestheticBadge: '♡ Pure White',
    badgeType: 'instant-checkout',
    gender: 'female',
  },

  // 4e. Solid Off-Shoulder Bodycon Mini Dress
  {
    id: 'k-solid-off-shoulder-mini',
    name: 'Solid Off-Shoulder Bodycon Mini Dress',
    hangulName: '솔리드 오프숄더 바디콘 미니 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Korean Store',
    price: 1099,
    originalPrice: 2849,
    image: '/Solid Off Shoulder   1.jpg',
    galleryImages: [
      '/Solid Off Shoulder   1.jpg',
      '/Solid Off Shoulder   2.jpg',
      '/Solid Off Shoulder   3.jpg',
      '/Solid Off Shoulder   4.jpg',
      '/Solid Off Shoulder   5.jpg',
    ],
    fabric: 'Polyamide 83%, Elastane 17%',
    color: 'Beige',
    availableColors: ['Beige'],
    description: 'Sensational off-shoulder bodycon mini dress featuring a flattering fold-over neckline, sculpted premium stretch knit fabric, and flared hemline. Designed for effortless glamour from day events to cocktail parties.',
    craftDetails: 'Shape: Bodycon Mini | Neck: Off-Shoulder | Sleeves: Sleeveless | Length: Mini | Hemline: Flared Hem | Fabric: Polyamide-83% Elastane 17% | Care: Machine Wash',
    specs: {
      'Shape': 'Bodycon Mini',
      'Neck': 'Off-Shoulder',
      'Sleeve Length': 'Sleeveless',
      'Length': 'Mini',
      'Hemline': 'Flared Hem',
      'Fabric': 'Polyamide 83%, Elastane 17%',
      'Occasion': 'Cocktail, Evening Party & Date Night',
      'Wash Care': 'Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 145,
    inStock: true,
    sizes: ['M', 'L'],
    koreanTagline: 'Off-Shoulder Sculpted Mini',
    aestheticBadge: '♡ Off-Shoulder Glam',
    badgeType: 'trending',
    gender: 'female',
  },

  // -----------------------------------------------------------------------
  // CATEGORY 3: RELAXED SHIRTS & TOPS (2 PRODUCTS)
  // -----------------------------------------------------------------------
  // 5. Spense Clothing Women Relaxed Fit Casual Shirt
  {
    id: 'k-spense-relaxed-shirt',
    name: 'Spense Clothing Women Relaxed Fit Light Blue Casual Shirt',
    hangulName: '스펜스 클로딩 릴랙스 핏 블루 셔츠',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'relaxed-shirts',
    categoryLabel: 'Korean Store',
    price: 549,
    originalPrice: 1799, // 70% OFF
    image: '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
    galleryImages: [
      '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
      '/Spense Clothing Women Relaxed Fit - Light Blue -2.webp',
      '/Spense Clothing Women Relaxed Fit - Light Blue - 3.webp',
      '/Spense Clothing Women Relaxed Fit - Light Blue - 4.webp',
      '/Spense Clothing Women Relaxed Fit - 1.webp',
      '/Spense Clothing Women Relaxed Fit - 2.webp',
      '/Spense Clothing Women Relaxed Fit - 3.webp',
      '/Spense Clothing Women Relaxed Fit - 4.webp',
    ],
    fabric: '100% Breathable Fine Cotton',
    color: 'Light Blue & Multicolor',
    description: 'Effortless Seoul streetwear relaxed-fit button-down shirt. Features a dropped shoulder silhouette, curved hemline, and breathable cotton weave perfect for layering over crop tops or styling with pleated skirts.',
    craftDetails: 'Brand: Spense Clothing | Type: Casual Shirt | Fit: Relaxed Fit | Neck / Collar: Spread Collar | Sleeve: Full Sleeve with Button Cuffs | Occasion: Casual, College & Daily Wear',
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 198,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL'],
    koreanTagline: 'Viral Hongdae College Style',
    aestheticBadge: '♡ Campus Essential',
    badgeType: 'instant-checkout',
    availableColors: ['Light Blue', 'Multicolor Floral'],
    colorVariants: [
      {
        name: 'Light Blue',
        image: '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
        galleryImages: [
          '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
          '/Spense Clothing Women Relaxed Fit - Light Blue -2.webp',
          '/Spense Clothing Women Relaxed Fit - Light Blue - 3.webp',
          '/Spense Clothing Women Relaxed Fit - Light Blue - 4.webp',
        ],
        hex: '#93c5fd',
      },
      {
        name: 'Multicolor',
        image: '/Spense Clothing Women Relaxed Fit - 1.webp',
        galleryImages: [
          '/Spense Clothing Women Relaxed Fit - 1.webp',
          '/Spense Clothing Women Relaxed Fit - 2.webp',
          '/Spense Clothing Women Relaxed Fit - 3.webp',
          '/Spense Clothing Women Relaxed Fit - 4.webp',
        ],
        hex: '#f472b6',
      },
    ],
    gender: 'female',
  },

  // 6. maaesa Women Relaxed Fit Printed Aesthetic Casual Shirt
  {
    id: 'k-maaesa-relaxed-shirt',
    name: 'maaesa Women Relaxed Fit Printed Aesthetic Casual Shirt',
    hangulName: '마에사 릴랙스 핏 프린트 셔츠',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'relaxed-shirts',
    categoryLabel: 'Korean Store',
    price: 599,
    originalPrice: 1999, // 70% OFF
    image: '/maaesa Women Relaxed Fit Shirt - 1.webp',
    galleryImages: [
      '/maaesa Women Relaxed Fit Shirt - 1.webp',
      '/maaesa Women Relaxed Fit Shirt - 2.webp',
      '/maaesa Women Relaxed Fit Shirt - 3.webp',
      '/maaesa Women Relaxed Fit Shirt - 4.webp',
      '/maaesa Women Relaxed Fit Shirt - 5.webp',
    ],
    fabric: 'Soft Rayon Crepe',
    color: 'Warm Beige & Multicolor',
    description: 'Chic Korean cafe aesthetic printed shirt featuring an ultra-relaxed drape, notched resort collar, and breezy lightweight fabric ideal for sunlit cafe dates and college wear.',
    craftDetails: 'Brand: maaesa | Type: Casual Printed Shirt | Fit: Relaxed Fit | Collar: Cuban / Notch Collar | Pattern: Abstract Aesthetic Print | Occasion: Casual, Weekend & College',
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 172,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    koreanTagline: 'Romantic Cafe Date Look',
    aestheticBadge: '♡ Cafe Date Pick',
    badgeType: 'instant-checkout',
    availableColors: ['Warm Beige Print'],
    gender: 'female',
  },
];
