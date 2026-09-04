export type PestCategory = 
  | 'Bedbugs'
  | 'Cockroaches'
  | 'Termites & Woodborers'
  | 'Rodents & Mice'
  | 'Mosquitoes & Flies'
  | 'Snakes & Reptiles'
  | 'Traps & Adhesives'
  | 'Multi-Pest & Industrial Fumigation'
  | 'Safety Equipment & Sprayers'
  | 'Pet-Safe & Organic';

export type ApplicationForm = 
  | 'Concentrated Liquid / Emulsion'
  | 'Micro-Encapsulated Spray'
  | 'Syringe Gel Bait'
  | 'Wax Block Poison'
  | 'Thermal Fogging Chemical'
  | 'Powder / Dusting Formula'
  | 'Heavy Duty Glue Board'
  | 'Viscous Adhesive Glue / Sticky Trap'
  | 'Tamper-Proof Bait Station / Lockable Box'
  | 'PPE & Application Gear';

export type ToxicityRating = 
  | 'Industrial / High Potency (PPE Required)'
  | 'Standard Household Caution'
  | 'Low Toxicity / Food-Area Safe'
  | 'Non-Poisonous / 100% Non-Toxic & Odourless'
  | 'Organic / Pet & Plant Safe';

export interface Review {
  id: string;
  userName: string;
  userLocation: string;
  rating: number;
  date: string;
  pestEliminated: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  category: PestCategory;
  price: number; // in NGN
  originalPrice: number; // in NGN
  stock: number;
  sku: string;
  rating: number;
  reviewCount: number;
  knockdownSpeed: string; // e.g. "Instant (15 mins)" or "Within 2 Hours"
  residualDuration: string; // e.g. "Protects for 6 Months"
  targetPests: string[];
  formType: ApplicationForm;
  toxicityRating: ToxicityRating;
  activeIngredients: string;
  packagingSize: string; // e.g. "1 Litre Bottle", "30g Syringe Pack"
  images: string[];
  description: string;
  howToUse: string[];
  safetyPrecautions: string[];
  companyName?: string;
  workExperience?: string;
  serviceArea?: string;
  frequency?: string;
  packageContents?: string[];
  nightExterminationNotice?: string;
  jijiUrl?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleDiscountPercent?: number;
  badge?: string;
  reviews: Review[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export type PaymentMethod = 
  | 'bank_transfer'
  | 'debit_card'
  | 'pay_on_delivery'
  | 'whatsapp_order';

export type PaymentStatus = 
  | 'Paid'
  | 'Pending Verification'
  | 'Unpaid'
  | 'Failed';

export type OrderStatus = 
  | 'Processing'
  | 'Confirmed'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  altPhone?: string;
  state: string;
  cityOrLga: string;
  deliveryAddress: string;
  landmark?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  proofOfPaymentNote?: string;
}

export interface PestDiagnosisResult {
  pestType: string;
  symptoms: string[];
  severity: 'Mild' | 'Moderate' | 'Severe / Infestation';
  recommendedTreatment: string;
  recommendedProductIds: string[];
}

export interface PestService {
  id: string;
  serviceNumber: number;
  name: string;
  headline: string;
  badge: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  experienceYears: string;
  phone: string;
  companyName: string;
  requirementNotice: string;
  whyNotice: string;
  whyExplanation: string;
  yearsEmbarrassingNotice: string;
  facilitiesTreated: string[];
  additionalPestsEliminated: string[];
  scheduleExample: {
    startDay: string;
    stayAwayPeriod: string;
    reEntryTime: string;
    note: string;
  };
  features: string[];
  images: string[];
  guaranteeText: string;
  serviceAreas: string[];
  pricingGuide?: string;
  reviews?: Review[];
}
