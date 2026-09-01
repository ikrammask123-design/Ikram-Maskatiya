export type CategoryId = 'all' | 'sarees' | 'kurtis' | 'dresses' | 'accessories' | 'bridal';

export interface ColorVariant {
  name: string;
  image: string;
  galleryImages?: string[];
  hex?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'sarees' | 'kurtis' | 'dresses' | 'accessories' | 'bridal';
  categoryLabel: string;
  price: number; // in INR
  originalPrice?: number;
  image: string;
  galleryImages?: string[];
  fabric: string;
  weave?: string;
  color: string;
  description: string;
  craftDetails: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  sizes?: string[];
  includesBlousePiece?: boolean;
  availableColors?: string[];
  colorVariants?: ColorVariant[];
  reviews?: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    verified?: boolean;
    date?: string;
  }[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedImage?: string;
  customStitching?: boolean;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'drop' | 'invitation' | 'offer';
  read: boolean;
}

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyRate {
  symbol: string;
  rate: number; // relative to INR
}
