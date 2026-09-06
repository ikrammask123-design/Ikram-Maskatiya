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

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type OrderFulfillmentStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethodType = 'razorpay' | 'upi' | 'cod';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  customStitching?: boolean;
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface StoreOrder {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  giftWrapAmount: number;
  total: number;
  currency: Currency;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  transactionId?: string;
  adminNotes?: string;
  trackingNumber?: string;
  courierPartner?: string;
  isDemo?: boolean;
}

export interface UserAddress {
  id: string;
  tag: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: UserAddress[];
  savedMeasurements?: {
    bust?: string;
    waist?: string;
    hip?: string;
    shoulder?: string;
    blouseLength?: string;
  };
  memberTier?: 'Member' | 'Silver' | 'Gold' | 'Privilege Club';
  loyaltyPoints?: number;
  createdAt: string;
  lastLoginAt?: string;
}
