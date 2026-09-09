import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'spk-rat-001',
    name: 'STUBBORN RAT KILLER',
    subtitle: 'Strong Rat Poison Powder (100g Bottle + Free Measuring Spoon Inside)',
    slug: 'stubborn-rat-killer-premix-bait',
    category: 'Rodents & Mice',
    price: 5800,
    originalPrice: 7500,
    stock: 250,
    sku: 'SPK-RAT-001',
    rating: 5.0,
    reviewCount: 38,
    knockdownSpeed: 'Kills Within 45 Mins – 2 Hours',
    residualDuration: 'Very Strong – Kills Even Stubborn Rats',
    targetPests: ['Big Gutter Rats', 'Ceiling Rats', 'Kitchen Mice', 'Store & Farm Rats'],
    formType: 'Powder Formula',
    toxicityRating: 'Strong Poison (Keep Away From Children)',
    activeIngredients: 'Fast-Acting Rat Killer Bait (Rats Love Eating It)',
    packagingSize: '100g Sealed Bottle + Free Spoon',
    images: [
      '/images/rat-killer-1.jpg',
      '/images/rat-killer-2.jpg',
      '/images/rat-killer-3.jpg'
    ],
    description: 'Stubborn Rat Killer is a very strong rat poison powder. It kills any kind of rat or mouse within 45 minutes to 2 hours after they eat it. Even big gutter rats and ceiling mice that refused to die with other market poisons will die once they eat this.\n\nFor over 8 years, we have helped homeowners, shops, poultry farmers, and warehouse owners across Nigeria get rid of rats completely.\n\nCall or Chat with us on WhatsApp now (+234 808 985 4753) to order.',
    howToUse: [
      'Use the free spoon inside the bottle to scoop one full spoon of the powder.',
      'Pour the powder on a small piece of paper or carton on the floor near the wall.',
      'Put it in dark corners where rats like to pass (like behind the fridge, under kitchen cupboards, or in the ceiling).',
      'Put it down between 5:00 PM and 7:00 PM in the evening for best results. By morning, you will see dead rats.'
    ],
    packageContents: [
      '1x Stubborn Rat Killer (100g Bottle)',
      '1x Free Measuring Spoon'
    ],
    safetyPrecautions: [
      'Keep far away from children and pets (dogs, cats, chickens).',
      'Always use the free spoon to put the powder; do not touch with bare hands.',
      'Wash your hands with soap and clean water after using it.',
      'Keep the bottle tightly closed in a cool, safe place.'
    ],
    companyName: 'KILLAPEST RESOURCES',
    workExperience: 'Over 8 years helping people kill stubborn rats in Nigeria',
    serviceArea: 'Homes, Offices, Shops, Poultry Farms & Stores',
    frequency: 'As Needed',
    nightExterminationNotice: 'Note: Rats move around and look for food at night. For best results, put the powder down between 5:00 PM and 7:00 PM in the evening. You will see dead rats by morning.',
    jijiUrl: 'https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscountPercent: 23,
    badge: 'Kills in 45 Mins – 2 Hours',
    createdAt: '2026-08-19',
    reviews: [
      {
        id: 'rev-rat-04',
        userName: 'Engr. Felix Oladipo',
        userLocation: 'Verified Buyer (Abuja, FCT - 10 Jars)',
        rating: 5,
        date: 'Verified WhatsApp Customer',
        pestEliminated: '10 Jars Order (₦57,000)',
        title: '"Send to Abuja: Engr Felix" — Kuda Bank Payment & Waybill Dispatched',
        comment: 'Paid ₦57,000 via Kuda Bank (TransferReceipt-43.pdf) for 10 jars dispatched to Abuja via interstate parcel with direct receipt confirmation: "Good morning Sir, Your payment is received".',
        verifiedPurchase: true
      },
      {
        id: 'rev-rat-03',
        userName: 'Barakat Ganiyu',
        userLocation: 'Verified Repeat Buyer (Ibadan - 10 Jars)',
        rating: 5,
        date: 'Verified WhatsApp Customer',
        pestEliminated: '10 Jars Re-order (₦57,000)',
        title: '"Send to ibadan:" — Repeat 10 Jars Order',
        comment: 'Returning customer ordered 10 jars for ₦57,000 dispatched to Ibadan via bus park with payment sent to Doliva Resources Ltd (Moniepoint MFB). Confirmed: "Give us discount like you did the last time... and we shall buy 10 jars".',
        verifiedPurchase: true
      },
      {
        id: 'rev-rat-02',
        userName: 'John Ebuka',
        userLocation: 'Verified Repeat Buyer (6 Jars Order)',
        rating: 5,
        date: 'Verified WhatsApp Customer',
        pestEliminated: '6 Jars Re-order (₦34,800)',
        title: '"We have bought from you before" — Repeat Re-order',
        comment: 'Customer verified: "We have bought from you before". Re-ordered 6 jars of Stubborn Rat Killer at standard ₦5,800/jar price with waybill dispatch to bus park.',
        verifiedPurchase: true
      },
      {
        id: 'rev-rat-01',
        userName: 'Alhaji Adeshina',
        userLocation: 'Waybill Delivery (Driver: 07017266331)',
        rating: 5,
        date: 'Verified WhatsApp Customer',
        pestEliminated: '21 Jars (Repeat Patronage & Referrals)',
        title: 'Thanks greatly — 21 jars received!',
        comment: 'Driver Number: 07017266331 (Waybill cost: 4k). 21 jars delivered with 5g bonus extra per jar for continued patronage and referrals. Customer reply: "Thanks greatly".',
        verifiedPurchase: true
      }
    ]
  }
];

export interface NigerianStateDelivery {
  name: string;
  fee: number;
  days: string;
  lgas: string[];
}

export const NIGERIAN_STATES: NigerianStateDelivery[] = [
  {
    name: 'Lagos',
    fee: 2000,
    days: 'Same Day / Next Day (24 hrs)',
    lgas: ['Ikeja', 'Lagos Island', 'Surulere', 'Lekki / Victoria Island', 'Alimosho', 'Yaba', 'Oshodi', 'Ikorodu', 'Epe', 'Badagry', 'Gbagada', 'Festac']
  },
  {
    name: 'Abuja (FCT)',
    fee: 3000,
    days: '24 - 48 Hours',
    lgas: ['Maitama', 'Wuse 2', 'Garki', 'Asokoro', 'Gwarinpa', 'Jabi', 'Kubwa', 'Lugbe', 'Apo', 'Bwari']
  },
  {
    name: 'Rivers (Port Harcourt)',
    fee: 3500,
    days: '2 - 3 Days',
    lgas: ['Port Harcourt City', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Oyigbo', 'Okrika']
  },
  {
    name: 'Oyo (Ibadan)',
    fee: 2500,
    days: '24 - 48 Hours',
    lgas: ['Ibadan North', 'Ibadan South-West', 'Bodija', 'Oluyole', 'Egbeda', 'Iwo Road']
  },
  {
    name: 'Ogun',
    fee: 2500,
    days: '24 - 48 Hours',
    lgas: ['Abeokuta South', 'Abeokuta North', 'Ota / Ado-Odo', 'Sagamu', 'Ijebu Ode', 'Mowe / Ibafo']
  },
  {
    name: 'Kano',
    fee: 4000,
    days: '2 - 4 Days',
    lgas: ['Kano Municipal', 'Fagge', 'Dala', 'Nassarawa', 'Gwale', 'Tarauni']
  },
  {
    name: 'Enugu',
    fee: 3500,
    days: '2 - 3 Days',
    lgas: ['Enugu North', 'Enugu South', 'Enugu East', 'Nsukka', 'Udi']
  },
  {
    name: 'Delta (Warri / Asaba)',
    fee: 3500,
    days: '2 - 3 Days',
    lgas: ['Warri South', 'Oshimili South (Asaba)', 'Uvwie (Effurun)', 'Sapele', 'Ughelli']
  },
  {
    name: 'Edo (Benin City)',
    fee: 3500,
    days: '2 - 3 Days',
    lgas: ['Oredo (Benin City)', 'Ikpoba-Okha', 'Egor', 'Uselu']
  },
  {
    name: 'Kaduna',
    fee: 4000,
    days: '2 - 4 Days',
    lgas: ['Kaduna North', 'Kaduna South', 'Chikun', 'Zaria', 'Igabi']
  },
  {
    name: 'Anambra (Onitsha / Awka)',
    fee: 3500,
    days: '2 - 3 Days',
    lgas: ['Onitsha North', 'Onitsha South', 'Awka South', 'Nnewi North', 'Idemili']
  },
  {
    name: 'Other States Nationwide',
    fee: 4500,
    days: '3 - 5 Days',
    lgas: ['State Capital Central', 'Major Commercial Hub', 'Interstate Park Pickup']
  }
];

export const DISCOUNT_COUPONS: Record<string, { percent: number; minSpend: number; description: string }> = {
  STUBBORN10: { percent: 10, minSpend: 5000, description: '10% Off Your First Order' },
  KILLAPEST20: { percent: 20, minSpend: 15000, description: '20% Off Bulk Order' },
  FIRSTKILL20: { percent: 20, minSpend: 10000, description: '20% Off When You Buy Up to ₦10,000' }
};
