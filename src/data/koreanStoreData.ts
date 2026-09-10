import { Product } from '../types';

export type KoreanCategoryKey = 'bodycon-maxi' | 'sheath-aline' | 'relaxed-shirts';

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

// =========================================================================
// 1. "SHOP BY KOREAN AESTHETIC" - EXACTLY 3 KOREAN CATEGORIES (2 PRODUCTS EACH)
// 100% Female-Focused Models & Verified Catalog Products
// =========================================================================
export const K_AESTHETIC_CATEGORIES: KAestheticCategory[] = [
  {
    id: 'bodycon-maxi',
    name: 'Bodycon & Maxi Dresses',
    hangul: '미니멀 바디콘 & 맥시',
    tagline: 'Figure-sculpting floor maxis & square neck bodycon fits',
    priceBadge: '2 Curated Fits',
    image: '/METRONAUT Women Bodycon Black - 1.webp',
    filterKey: 'bodycon-maxi',
    bgGradient: 'from-[#FFF0F5] via-[#FFE4E1] to-[#FFD1DC]',
    accentColor: '#FF4D6D',
    heartIcon: '♡',
  },
  {
    id: 'sheath-aline',
    name: 'Sheath & A-Line Dresses',
    hangul: '테일러드 시스 & A라인',
    tagline: 'Tailored office sheath dresses & denim blue flare fits',
    priceBadge: '2 Curated Fits',
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
    title: 'MINIMALIST BODYCON MAXIS',
    hangul: '미니멀 바디콘 & 맥시',
    subtitle: 'METRONAUT & Traquila Sculpted Fits',
    priceTag: '2 Fits • From ₹599',
    image: '/METRONAUT Women Bodycon Wine - 1.webp',
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
    title: 'OFFICE SHEATH & A-LINE',
    hangul: '시스 & 데님 플레어',
    subtitle: 'PATTZALA & TIARA WORLD Dresses',
    priceTag: '2 Fits • From ₹699',
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
    subtitle: 'Figure-sculpting bodycons & floor-length night silhouettes',
    tagline: 'METRONAUT & Traquila Bodycon Fits',
    stampPrice: '2 Fits • From ₹599',
    image: '/Traquila Women Bodycon Black - 1.webp',
    filterTarget: 'bodycon-maxi',
    stampColor: 'from-[#FFF1F2] to-[#FFE4E6]',
    borderColor: 'border-[#FECDD3]',
    accentBadge: '♡ PARTY GLAM',
  },
  {
    id: 'occ-office-brunch',
    title: 'Office & Weekend Brunch',
    hangul: '오피스 & 브런치 데이트',
    subtitle: 'Tailored desk-to-dinner sheaths & charming denim A-line flare',
    tagline: 'PATTZALA & TIARA WORLD Dresses',
    stampPrice: '2 Fits • From ₹699',
    image: '/TIARA WORLD Women A-line White, Blue - 1.webp',
    filterTarget: 'sheath-aline',
    stampColor: 'from-[#FDF4FF] to-[#FAE8FF]',
    borderColor: 'border-[#F5D0FE]',
    accentBadge: '✧ OFFICE & BRUNCH',
  },
  {
    id: 'occ-campus-cafe',
    title: 'Campus & Cafe Everyday',
    hangul: '캠퍼스 & 카페 데이',
    subtitle: 'Breezy relaxed button-downs & artistic printed rayon shirts',
    tagline: 'Spense & maaesa Cotton Shirts',
    stampPrice: '2 Fits • From ₹549',
    image: '/maaesa Women Relaxed Fit Shirt - 1.webp',
    filterTarget: 'relaxed-shirts',
    stampColor: 'from-[#F3EEFF] to-[#EDE9FE]',
    borderColor: 'border-[#DDD6FE]',
    accentBadge: '☕ CAMPUS & CAFE',
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
    category: 'dresses',
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Bodycon & Maxi Dresses',
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
    category: 'dresses',
    koreanCategory: 'bodycon-maxi',
    categoryLabel: 'Bodycon & Maxi Dresses',
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

  // -----------------------------------------------------------------------
  // CATEGORY 2: SHEATH & A-LINE DRESSES (2 PRODUCTS)
  // -----------------------------------------------------------------------
  // 3. PATTZALA Tailored Sheath Midi Dress
  {
    id: 'k-pattzala-sheath-midi',
    name: 'PATTZALA Women Tailored Sheath Midi Dress',
    hangulName: '파트잘라 테일러드 시스 미디 드레스',
    category: 'dresses',
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Sheath & A-Line Dresses',
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
    category: 'dresses',
    koreanCategory: 'sheath-aline',
    categoryLabel: 'Sheath & A-Line Dresses',
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

  // -----------------------------------------------------------------------
  // CATEGORY 3: RELAXED SHIRTS & TOPS (2 PRODUCTS)
  // -----------------------------------------------------------------------
  // 5. Spense Clothing Women Relaxed Fit Casual Shirt
  {
    id: 'k-spense-relaxed-shirt',
    name: 'Spense Clothing Women Relaxed Fit Light Blue Casual Shirt',
    hangulName: '스펜스 클로딩 릴랙스 핏 블루 셔츠',
    category: 'dresses',
    koreanCategory: 'relaxed-shirts',
    categoryLabel: 'Relaxed Shirts & Tops',
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
    category: 'dresses',
    koreanCategory: 'relaxed-shirts',
    categoryLabel: 'Relaxed Shirts & Tops',
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
