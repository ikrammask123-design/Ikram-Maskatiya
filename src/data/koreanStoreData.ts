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
    subtitle: 'Tailored desk-to-dinner sheath midis, elegant blazer dresses, wrap fits, co-ords & boardroom poise',
    badge: '✧ CATEGORY 03',
    tagline: 'Tailored Sheaths, Blazer Dresses & Chic Co-ords',
    accentColor: '#C026D3',
    bgGradient: 'from-[#FDF4FF] to-[#FAE8FF]',
    border: 'border-[#F5D0FE]',
    filterKey: 'office-brunch',
    image: '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
    images: [
      '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
      '/Miss Chase Women Wrap White Knee Length Dress1.webp',
      '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress 1.webp',
      '/Co-ords Green 1.webp',
      '/Bodycon Brown 1.webp',
      '/SPIVOZ Women Bodycon Multicolor Below Knee Dress1.webp',
      '/SPIVOZ Women Bodycon Black MidiCalf Length Dress1.webp',
      '/PATTZALA Women Sheath Purple - 1.webp',
      '/StyleCast 1.jpg',
    ],
    fitsCount: 9,
    startingPrice: 699,
    highlightPills: ['Blazer Dresses', 'Wrap Fits', 'Co-ords Sets', 'Ribbed Bodycon', 'Fit & Flare'],
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
  if (
    product.id === 'k-pattzala-sheath-midi' ||
    product.id === 'k-stylecast-beige-bodycon' ||
    product.id === 'k-miss-chase-blazer-dress-green' ||
    product.id === 'k-miss-chase-wrap-dress-white' ||
    product.id === 'k-jenkra-fit-flare-ankle-dress' ||
    product.id === 'k-spivoz-bodycon-black-midi' ||
    product.id === 'k-spivoz-bodycon-multicolor' ||
    product.id === 'k-ribbed-contour-bodycon-dress' ||
    product.id === 'k-chic-knit-coords-set'
  ) {
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
    // CARD 2: Campus & Cafe Everyday
    id: 'occ-campus-cafe',
    title: 'Campus & Cafe Everyday',
    hangul: '캠퍼스 & 카페 데이',
    subtitle: 'Breezy relaxed button-downs & artistic printed rayon shirts',
    tagline: 'Spense & maaesa Cotton Shirts',
    stampPrice: '3 Fits • From ₹549',
    image: '/Spense Clothing Women Relaxed Fit - Light Blue -1.webp',
    filterTarget: 'campus-cafe',
    stampColor: 'from-[#F3EEFF] to-[#EDE9FE]',
    borderColor: 'border-[#DDD6FE]',
    accentBadge: '♡ CAMPUS & CAFE',
  },
  {
    // CARD 3: Office & Weekend Brunch
    id: 'occ-office-brunch',
    title: 'Office & Weekend Brunch',
    hangul: '오피스 & 브런치 데이트',
    subtitle: 'Tailored desk-to-dinner sheaths, blazer dresses, wrap fits, co-ords & midi fits',
    tagline: 'Miss Chase, JENKRA, SPIVOZ & Chic Co-ords',
    stampPrice: '9 Fits • From ₹699',
    image: '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
    filterTarget: 'office-brunch',
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

  // -----------------------------------------------------------------------
  // CATEGORY: OFFICE & WEEKEND BRUNCH (4 NEW CURATED DRESSES)
  // -----------------------------------------------------------------------

  // 16. Miss Chase Women Blazer Dress Green Knee Length Dress
  {
    id: 'k-miss-chase-blazer-dress-green',
    name: 'Miss Chase Women Blazer Dress Green Knee Length Dress',
    hangulName: '미스 체이스 그린 블레이저 랩 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 999,
    originalPrice: 2999,
    image: '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
    galleryImages: [
      '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
      '/Miss Chase Women Blazer Dress Green Knee Length Dress2.webp',
      '/Miss Chase Women Blazer Dress Green Knee Length Dress3.webp',
      '/Miss Chase Women Blazer Dress Green Knee Length Dress4.webp',
      '/Miss Chase Women Blazer Dress Green Knee Length Dress5.webp',
    ],
    fabric: 'Poly Crepe & Suiting Blend',
    color: 'Emerald Green',
    availableColors: ['Emerald Green'],
    colorVariants: [
      {
        name: 'Emerald Green',
        image: '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
        galleryImages: [
          '/Miss Chase Women Blazer Dress Green Knee Length Dress1.webp',
          '/Miss Chase Women Blazer Dress Green Knee Length Dress2.webp',
          '/Miss Chase Women Blazer Dress Green Knee Length Dress3.webp',
          '/Miss Chase Women Blazer Dress Green Knee Length Dress4.webp',
          '/Miss Chase Women Blazer Dress Green Knee Length Dress5.webp',
        ],
        hex: '#15803d',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Tailored Miss Chase green blazer dress designed for effortless boardroom poise and chic weekend brunches. Features a sleek notched collar, double-breasted button aesthetic, structured shoulder line, and flattering knee-length silhouette.',
    craftDetails: 'Brand: Miss Chase | Type: Blazer Dress | Shape: Tailored Sheath Blazer | Neck / Collar: Lapel / Notched Collar | Length: Knee Length | Sleeves: Full Sleeves | Pattern: Solid | Occasion: Formal, Office, Meeting & Weekend Brunch | Wash Care: Gentle Machine Wash / Dry Clean',
    specs: {
      'Brand': 'Miss Chase',
      'Shape': 'Blazer Dress / Tailored Sheath',
      'Neck': 'Notched Lapel Collar',
      'Length': 'Knee Length',
      'Sleeve Length': 'Full Sleeves',
      'Pattern': 'Solid',
      'Occasion': 'Office, Corporate & Weekend Brunch',
      'Wash Care': 'Gentle Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 184,
    inStock: true,
    koreanTagline: 'Seoul Power Dressing & Boardroom Chic',
    aestheticBadge: '✧ Boardroom Blazer',
    badgeType: 'instant-checkout',
    gender: 'female',
  },

  // 17. Miss Chase Women Wrap White Knee Length Dress
  {
    id: 'k-miss-chase-wrap-dress-white',
    name: 'Miss Chase Women Wrap White Knee Length Dress',
    hangulName: '미스 체이스 화이트 랩 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 849,
    originalPrice: 2499,
    image: '/Miss Chase Women Wrap White Knee Length Dress1.webp',
    galleryImages: [
      '/Miss Chase Women Wrap White Knee Length Dress1.webp',
      '/Miss Chase Women Wrap White Knee Length Dress2.webp',
      '/Miss Chase Women Wrap White Knee Length Dress3.webp',
      '/Miss Chase Women Wrap White Knee Length Dress4.webp',
      '/Miss Chase Women Wrap White Knee Length Dress5.webp',
    ],
    fabric: 'Viscose Rayon & Polyester Knit',
    color: 'Ivory White',
    availableColors: ['Ivory White'],
    colorVariants: [
      {
        name: 'Ivory White',
        image: '/Miss Chase Women Wrap White Knee Length Dress1.webp',
        galleryImages: [
          '/Miss Chase Women Wrap White Knee Length Dress1.webp',
          '/Miss Chase Women Wrap White Knee Length Dress2.webp',
          '/Miss Chase Women Wrap White Knee Length Dress3.webp',
          '/Miss Chase Women Wrap White Knee Length Dress4.webp',
          '/Miss Chase Women Wrap White Knee Length Dress5.webp',
        ],
        hex: '#f8fafc',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Elegant Miss Chase white wrap dress tailored with a flattering surplice V-neckline, self-tie waist accent, and graceful knee-length hemline. Perfect for sunlit brunch dates, high-tea afternoons, and smart office presentations.',
    craftDetails: 'Brand: Miss Chase | Type: Wrap Dress | Shape: Fit & Flare Wrap | Neck: Surplice V-Neck | Length: Knee Length | Sleeves: Half / Cap Sleeves | Closure: Wrap Tie-Up | Pattern: Solid | Occasion: Office Casual, Brunch Date & Day Out',
    specs: {
      'Brand': 'Miss Chase',
      'Shape': 'Wrap Fit & Flare',
      'Neck': 'V-Neck / Wrap Collar',
      'Length': 'Knee Length',
      'Closure': 'Tie-Up Wrap',
      'Occasion': 'Brunch Date, Office & High Tea',
      'Wash Care': 'Hand Wash / Gentle Cold Cycle',
    },
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 142,
    inStock: true,
    koreanTagline: 'Minimalist Wrap Elegance',
    aestheticBadge: '♡ Chic White Wrap',
    badgeType: 'trending',
    gender: 'female',
  },

  // 18. JENKRA Women Fit and Flare Black, Beige Ankle Length Dress
  {
    id: 'k-jenkra-fit-flare-ankle-dress',
    name: 'JENKRA Women Fit and Flare Black, Beige Ankle Length Dress',
    hangulName: '젠크라 블랙 & 베이지 핏 앤 플레어 롱 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 1099,
    originalPrice: 3299,
    image: '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress 1.webp',
    galleryImages: [
      '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress 1.webp',
      '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress2.webp',
      '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress3.webp',
      '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress4.webp',
      '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress5.webp',
    ],
    fabric: 'Poly Georgette & Crepe Blend with Smooth Inner Lining',
    color: 'Black & Beige',
    availableColors: ['Black & Beige'],
    colorVariants: [
      {
        name: 'Black & Beige',
        image: '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress 1.webp',
        galleryImages: [
          '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress 1.webp',
          '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress2.webp',
          '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress3.webp',
          '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress4.webp',
          '/JENKRA Women Fit and Flare Black, Beige Ankle Length Dress5.webp',
        ],
        hex: '#1c1917',
      },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Flowing and sophisticated JENKRA ankle-length fit & flare dress featuring dynamic contrast black and beige paneling, cinched waistline, and an ethereal tiered flare. Designed for all-day comfort whether at the workplace or a leisurely Sunday brunch.',
    craftDetails: 'Brand: JENKRA | Type: Fit & Flare Dress | Shape: Flared Maxi / Ankle Length | Neck: Round Neck | Length: Ankle Length | Sleeves: 3/4 Sleeves | Lining: Full Soft Lining | Pattern: Colorblocked / Contrast Panel | Occasion: Office Casual, Weekend Brunch & Travel',
    specs: {
      'Brand': 'JENKRA',
      'Shape': 'Fit and Flare Maxi',
      'Neck': 'Round Neck',
      'Length': 'Ankle Length',
      'Sleeve Length': 'Three-Quarter Sleeves',
      'Pattern': 'Contrast Colorblock (Black & Beige)',
      'Occasion': 'Office & Weekend Brunch',
      'Wash Care': 'Machine Wash Gentle / Hand Wash',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 215,
    inStock: true,
    koreanTagline: 'Graceful Ankle-Length Flare',
    aestheticBadge: '✧ Modern Ankle Flare',
    badgeType: 'bestseller',
    gender: 'female',
  },

  // 19. SPIVOZ Women Bodycon Black MidiCalf Length Dress
  {
    id: 'k-spivoz-bodycon-black-midi',
    name: 'SPIVOZ Women Bodycon Black MidiCalf Length Dress',
    hangulName: '스피보즈 블랙 바디콘 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 799,
    originalPrice: 2499,
    image: '/SPIVOZ Women Bodycon Black MidiCalf Length Dress1.webp',
    galleryImages: [
      '/SPIVOZ Women Bodycon Black MidiCalf Length Dress1.webp',
      '/SPIVOZ Women Bodycon Black MidiCalf Length Dress2.webp',
    ],
    fabric: 'Stretch Ribbed Cotton Knit & Spandex',
    color: 'Noir Black',
    availableColors: ['Noir Black'],
    colorVariants: [
      {
        name: 'Noir Black',
        image: '/SPIVOZ Women Bodycon Black MidiCalf Length Dress1.webp',
        galleryImages: [
          '/SPIVOZ Women Bodycon Black MidiCalf Length Dress1.webp',
          '/SPIVOZ Women Bodycon Black MidiCalf Length Dress2.webp',
        ],
        hex: '#18181b',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Form-sculpting SPIVOZ solid black midi-calf dress tailored in high-stretch ribbed cotton knit with a flattering scoop neckline and sleek bodycon silhouette. Ideal for layering under blazers for corporate meetings or styling with boots for weekend brunch.',
    craftDetails: 'Brand: SPIVOZ | Type: Bodycon Dress | Length: Midi / Calf Length | Neck: Scoop Neck | Sleeves: Sleeveless Tank Cut | Pattern: Solid Noir Black | Occasion: Office Casual & Weekend Brunch | Wash Care: Gentle Machine Wash Cold',
    specs: {
      'Brand': 'SPIVOZ',
      'Shape': 'Bodycon Midi',
      'Neck': 'Scoop Neck',
      'Length': 'Midi-Calf Length',
      'Fabric': 'Stretch Ribbed Cotton Knit',
      'Pattern': 'Solid Noir Black',
      'Occasion': 'Office Casual & Weekend Brunch',
      'Wash Care': 'Machine Wash Cold',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    koreanTagline: 'Seoul Silhouette Solid Black Contour',
    aestheticBadge: '♡ Noir Bodycon',
    badgeType: 'instant-checkout',
    gender: 'female',
  },

  // 20. SPIVOZ Women Bodycon Multicolor Below Knee Dress
  {
    id: 'k-spivoz-bodycon-multicolor',
    name: 'SPIVOZ Women Bodycon Multicolor Below Knee Dress',
    hangulName: '스피보즈 멀티컬러 바디콘 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 849,
    originalPrice: 2599,
    image: '/SPIVOZ Women Bodycon Multicolor Below Knee Dress1.webp',
    galleryImages: [
      '/SPIVOZ Women Bodycon Multicolor Below Knee Dress1.webp',
      '/SPIVOZ Women Bodycon Multicolor Below Knee Dress2.webp',
      '/SPIVOZ Women Bodycon Multicolor Below Knee Dress3.webp',
    ],
    fabric: 'Ultra-Stretch Lycra Crepe & Ribbed Knit',
    color: 'Abstract Multicolor',
    availableColors: ['Abstract Multicolor'],
    colorVariants: [
      {
        name: 'Abstract Multicolor',
        image: '/SPIVOZ Women Bodycon Multicolor Below Knee Dress1.webp',
        galleryImages: [
          '/SPIVOZ Women Bodycon Multicolor Below Knee Dress1.webp',
          '/SPIVOZ Women Bodycon Multicolor Below Knee Dress2.webp',
          '/SPIVOZ Women Bodycon Multicolor Below Knee Dress3.webp',
        ],
        hex: '#ec4899',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Vibrant and artistic SPIVOZ below-knee bodycon dress featuring an expressive abstract watercolor print. Tailored with a contouring stretch silhouette, jewel neckline, and smooth hemline perfect for sunlit patio brunches and stylish creative office workspaces.',
    craftDetails: 'Brand: SPIVOZ | Type: Bodycon Dress | Shape: Contour Sheath | Length: Below Knee | Neck: Round Neck | Sleeves: Short Sleeves | Pattern: Multicolor Abstract Print | Occasion: Weekend Brunch, Day Out & Creative Office',
    specs: {
      'Brand': 'SPIVOZ',
      'Shape': 'Contour Sheath Below Knee',
      'Neck': 'Round Neck',
      'Length': 'Below Knee',
      'Fabric': 'Stretch Crepe Ribbed Knit',
      'Pattern': 'Multicolor Abstract Print',
      'Occasion': 'Weekend Brunch & Creative Office',
      'Wash Care': 'Gentle Machine Wash',
    },
    isNewArrival: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 138,
    inStock: true,
    koreanTagline: 'Creative Seoul Print & Contour',
    aestheticBadge: '✧ Abstract Statement',
    badgeType: 'trending',
    gender: 'female',
  },

  // 21. Women Ribbed Scoop Neck Bodycon Midi Dress
  {
    id: 'k-ribbed-contour-bodycon-dress',
    name: 'Women Ribbed Scoop Neck Bodycon Midi Dress',
    hangulName: '여성 골지 스쿱넥 바디콘 미디 드레스',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 899,
    originalPrice: 2699,
    image: '/Bodycon Black 1.webp',
    galleryImages: [
      '/Bodycon Black 1.webp',
      '/Bodycon Black 2.webp',
      '/Bodycon Black 3.webp',
      '/Bodycon Black 4.webp',
      '/Bodycon Black 5.webp',
      '/Bodycon Black 6.webp',
    ],
    fabric: 'Premium Breathable Ribbed Cotton Elastane Blend',
    color: 'Classic Black',
    availableColors: ['Classic Black', 'Mocha Brown', 'Wine Maroon'],
    colorVariants: [
      {
        name: 'Classic Black',
        image: '/Bodycon Black 1.webp',
        galleryImages: [
          '/Bodycon Black 1.webp',
          '/Bodycon Black 2.webp',
          '/Bodycon Black 3.webp',
          '/Bodycon Black 4.webp',
          '/Bodycon Black 5.webp',
          '/Bodycon Black 6.webp',
        ],
        hex: '#18181b',
      },
      {
        name: 'Mocha Brown',
        image: '/Bodycon Brown 1.webp',
        galleryImages: [
          '/Bodycon Brown 1.webp',
          '/Bodycon Brown 2.webp',
          '/Bodycon Brown 3.webp',
          '/Bodycon Brown 4.webp',
          '/Bodycon Brown 5.webp',
        ],
        hex: '#78350f',
      },
      {
        name: 'Wine Maroon',
        image: '/Bodycon Maroon 1.webp',
        galleryImages: [
          '/Bodycon Maroon 1.webp',
          '/Bodycon Maroon 2.webp',
          '/Bodycon Maroon 3.webp',
          '/Bodycon Maroon 4.webp',
          '/Bodycon Maroon 5.webp',
        ],
        hex: '#831843',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Essential Korean minimalist wardrobe staple: high-density ribbed knit bodycon midi dress sculpted with an elegant scooped neckline and full-length contouring fit. Breathable four-way stretch hugs natural curves comfortably. Available in Classic Black, Mocha Brown, and Wine Maroon for effortless desk-to-brunch style.',
    craftDetails: 'Type: Bodycon Midi Dress | Silhouette: Form-Fitting Ribbed Contour | Neck: Deep Scoop Neck | Length: Midi Length | Sleeves: Sleeveless Tank Cut | Fabric: 95% Ribbed Cotton, 5% Spandex | Occasion: Desk-to-Dinner, Office Layers & Weekend Brunch',
    specs: {
      'Type': 'Bodycon Midi Dress',
      'Fabric': 'Ribbed Cotton Spandex Knit',
      'Neck': 'Scoop Neck',
      'Length': 'Midi Length',
      'Colors': 'Classic Black, Mocha Brown, Wine Maroon',
      'Occasion': 'Office Casual & Weekend Brunch',
      'Wash Care': 'Machine Wash Cold / Air Dry',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 288,
    inStock: true,
    koreanTagline: 'Effortless Seoul Ribbed Silhouette',
    aestheticBadge: '✧ Ribbed Bodycon',
    badgeType: 'bestseller',
    gender: 'female',
  },

  // 22. Women Chic Knit Top & Flared Skirt Co-ords Set
  {
    id: 'k-chic-knit-coords-set',
    name: 'Women Chic Knit Top & Flared Skirt Co-ords Set',
    hangulName: '여성 니트 크롭탑 & 플레어 스커트 투피스 세트',
    category: 'k-store' as const,
    isKoreanStore: true,
    koreanCategory: 'office-brunch',
    categoryLabel: 'Office & Weekend Brunch',
    price: 1199,
    originalPrice: 3499,
    image: '/Co-ords Green 1.webp',
    galleryImages: [
      '/Co-ords Green 1.webp',
      '/Co-ords Green 2.webp',
      '/Co-ords Green 3.webp',
      '/Co-ords Green 4.webp',
    ],
    fabric: 'Ultra-Soft Fine Gauge Ribbed Knit Blend',
    color: 'Sage Green',
    availableColors: ['Sage Green', 'Noir Black', 'Cocoa Brown', 'Lavender Purple', 'Deep Maroon', 'Blush Pink'],
    colorVariants: [
      {
        name: 'Sage Green',
        image: '/Co-ords Green 1.webp',
        galleryImages: [
          '/Co-ords Green 1.webp',
          '/Co-ords Green 2.webp',
          '/Co-ords Green 3.webp',
          '/Co-ords Green 4.webp',
        ],
        hex: '#15803d',
      },
      {
        name: 'Noir Black',
        image: '/Co-ords Black 1.webp',
        galleryImages: [
          '/Co-ords Black 1.webp',
          '/Co-ords Black 2.webp',
          '/Co-ords Black 3.webp',
          '/Co-ords Black 4.webp',
        ],
        hex: '#18181b',
      },
      {
        name: 'Cocoa Brown',
        image: '/Co-ords Brown 1.webp',
        galleryImages: [
          '/Co-ords Brown 1.webp',
          '/Co-ords Brown 2.webp',
          '/Co-ords Brown 3.webp',
          '/Co-ords Brown 4.webp',
        ],
        hex: '#7c2d12',
      },
      {
        name: 'Lavender Purple',
        image: '/Co-ords Lavender Purple 1.webp',
        galleryImages: [
          '/Co-ords Lavender Purple 1.webp',
          '/Co-ords Lavender Purple 2.webp',
          '/Co-ords Lavender Purple 3.webp',
          '/Co-ords Lavender Purple 4.webp',
        ],
        hex: '#a855f7',
      },
      {
        name: 'Deep Maroon',
        image: '/Co-ords Marron 1.webp',
        galleryImages: [
          '/Co-ords Marron 1.webp',
          '/Co-ords Marron 2.webp',
          '/Co-ords Marron 3.webp',
          '/Co-ords Marron 4.webp',
          '/Co-ords Marron 5.webp',
        ],
        hex: '#881337',
      },
      {
        name: 'Blush Pink',
        image: '/Co-ords Pink 1.webp',
        galleryImages: [
          '/Co-ords Pink 1.webp',
          '/Co-ords Pink 2.webp',
          '/Co-ords Pink 3.webp',
        ],
        hex: '#ec4899',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Matching two-piece Korean designer co-ords set featuring a tailored long-sleeve ribbed knit top and an accordion flared A-line high-waist skirt. Crafted from silky ultra-stretch knit yarn with flattering drape. Available in 6 trendsetting shades: Sage Green, Noir Black, Cocoa Brown, Lavender, Deep Maroon, and Blush Pink.',
    craftDetails: 'Type: Two-Piece Co-ords Set | Includes: Knit Top & Flared Skirt | Knit Gauge: Fine Gauge Elastic Ribbed Knit | Neck: Crew / Jewel Neck | Skirt Length: Flared Knee Length | Occasion: Brunch Date, Upscale Office Casual & Travel | Wash Care: Gentle Hand Wash Cold or Dry Clean',
    specs: {
      'Type': '2-Piece Knit Co-ords Set',
      'Components': 'Long Sleeve Top + Flared Skirt',
      'Fabric': 'Ultra-Stretch Fine Knit Blend',
      'Fit': 'Fitted Top with Flowing Flared Skirt',
      'Available Colors': 'Sage Green, Noir Black, Cocoa Brown, Lavender Purple, Deep Maroon, Blush Pink',
      'Occasion': 'Office Brunch & Elegant Daywear',
      'Wash Care': 'Cold Gentle Cycle / Dry Flat',
    },
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    koreanTagline: 'Signature Seoul 2-Piece Knit Styling',
    aestheticBadge: '♡ 2-Piece Co-ords',
    badgeType: 'bestseller',
    gender: 'female',
  },
];
