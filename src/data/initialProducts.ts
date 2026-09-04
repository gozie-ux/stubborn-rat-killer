import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'spk-rat-001',
    name: 'STUBBORN RAT KILLER',
    subtitle: 'Fast-Acting Premix Rodenticide Bait (100g Jar + Free Dosing Scoop Spoon)',
    slug: 'stubborn-rat-killer-premix-bait',
    category: 'Rodents & Mice',
    price: 5800,
    originalPrice: 7500,
    stock: 250,
    sku: 'SPK-RAT-001',
    rating: 5.0,
    reviewCount: 38,
    knockdownSpeed: 'Kills Within 45 Mins – 2 Hours',
    residualDuration: 'High Potency – Zero Known Resistance',
    targetPests: ['Rats', 'Mice', 'Sewer Rats (Giant Pouched)', 'Roof Rats', 'House Mice', 'Field Rodents'],
    formType: 'Powder / Dusting Formula',
    toxicityRating: 'Industrial / High Potency (PPE Required)',
    activeIngredients: 'Fast-acting Premix Rodenticide Attractant Matrix (Zero Resistance)',
    packagingSize: '100g Sealed Jar + Scoop Spoon',
    images: [
      '/images/rat-killer-1.jpg',
      '/images/rat-killer-2.jpg',
      '/images/rat-killer-3.jpg'
    ],
    description: 'The stubborn rat killer bait is a fast acting premix rodenticide. It kills any kind of rat or mice within 45 minutes to 2 hours after the rat feeds on the bait. The stubborn rat killer bait is a highly potent bait with no known resistance in rats and mice.\n\nJust one visit from us to you, your rodent nightmare is gone! For over 8+ years, we have helped owners and managers (just like you) of residential, commercial and industrial facilities get rid of rats, mice and other rodents. We are enthusiastic about making your property rodents free.\n\nCall or Chat us on WhatsApp now (+234 8089854753).',
    howToUse: [
      'Simply scoop a spoon full of the stubborn rat killer bait.',
      'Put the scooped stubborn rat killer bait on the edge of your wall.',
      'Place it preferably at the corners of the walls where you have previously seen the rats, mice, etc run through.',
      'Place it preferably at the darkest corners where no lighting gets to.'
    ],
    packageContents: [
      '1x One Stubborn Rat Killer (100g Jar)',
      '1x One Precision Dosing Scoop Spoon'
    ],
    safetyPrecautions: [
      'Keep away from direct contact with children and domestic pets.',
      'Always use the provided scoop spoon for dispensing; avoid touching directly with bare hands.',
      'Wash hands thoroughly with soap and clean water after application.',
      'Store in a cool, dry place tightly sealed in its original container.'
    ],
    companyName: 'KILLAPEST RESOURCES',
    workExperience: 'More than 5 years (8+ years specialized commercial & residential facility eradication)',
    serviceArea: 'Residential, Industrial, Commercial',
    frequency: 'Biweekly',
    nightExterminationNotice: 'P.S: Rats and mice are best exterminated at night. This is because they are most active at night. Our solution to your rats problem will be effected mostly from 5pm - 7pm for best results. You will wake up to a rat free area in the morning after.',
    jijiUrl: 'https://jiji.ng/lekki/household-chemicals/fastest-stubborn-rat-killer-bait-ciSv9nnA3SA4DqoFGySRvkDg.html',
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscountPercent: 23,
    badge: '100% Death in 45m - 2h',
    createdAt: '2026-08-19',
    reviews: [
      {
        id: 'rev-rat-01',
        userName: 'Alhaji Musa K.',
        userLocation: 'Wuse 2, Abuja',
        rating: 5,
        date: 'Yesterday',
        pestEliminated: 'Roof Rats & Kitchen Mice',
        title: 'Dead within 1 hour as promised!',
        comment: 'I scooped 2 spoonfuls in my kitchen corner by 6pm. By 8pm I already found two big rats dead beside the wall. No smell, fast knockdown!',
        verifiedPurchase: true
      },
      {
        id: 'rev-rat-02',
        userName: 'Mrs. Folashade A.',
        userLocation: 'Gbagada, Lagos',
        rating: 5,
        date: '3 days ago',
        pestEliminated: 'Giant Sewer Rats in Warehouse',
        title: 'Finally something that works without resistance',
        comment: 'All the market poison was useless because the rats were resistant. This Stubborn Rat Killer wiped out the entire warehouse population in 2 nights.',
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
  STUBBORN10: { percent: 10, minSpend: 5000, description: '10% Off First Eradication Order' },
  KILLAPEST20: { percent: 20, minSpend: 15000, description: '20% Killapest Resources Bulk Eradication Rebate' },
  FIRSTKILL20: { percent: 20, minSpend: 10000, description: '20% Off Commercial Rodent Protocol' }
};
