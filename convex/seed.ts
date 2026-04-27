import { mutation } from "./_generated/server";

const PLACEHOLDER = "https://placehold.co/600x600/0d1117/f5a623?text=";

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  category: string;
  condition: "brand-new" | "ex-uk";
  price: number;
  compareAtPrice?: number;
  images: string[];
  specs: Record<string, string>;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isHotDeal: boolean;
  isNewArrival: boolean;
};

const products: SeedProduct[] = [
  {
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description:
      "Apple iPhone 15 Pro Max with titanium design, A17 Pro chip, 48MP camera system, and USB-C.",
    category: "iphones",
    condition: "brand-new",
    price: 185000,
    images: [`${PLACEHOLDER}iPhone+15+Pro+Max`],
    specs: {
      Storage: "256GB",
      Color: "Natural Titanium",
      Display: "6.7-inch Super Retina XDR",
      Chip: "A17 Pro",
    },
    stock: 5,
    isActive: true,
    isFeatured: true,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: "iPhone 13",
    slug: "iphone-13-exuk",
    description:
      "Apple iPhone 13 Ex UK — excellent condition, fully tested and graded. 90-day warranty.",
    category: "iphones",
    condition: "ex-uk",
    price: 52000,
    compareAtPrice: 65000,
    images: [`${PLACEHOLDER}iPhone+13+Ex+UK`],
    specs: { Storage: "128GB", Color: "Midnight", Chip: "A15 Bionic", Grade: "Grade A" },
    stock: 12,
    isActive: true,
    isFeatured: false,
    isHotDeal: true,
    isNewArrival: false,
  },
  {
    name: "iPhone 11",
    slug: "iphone-11-exuk",
    description: "Apple iPhone 11 Ex UK — great value, fully functional, excellent battery health.",
    category: "iphones",
    condition: "ex-uk",
    price: 28000,
    compareAtPrice: 35000,
    images: [`${PLACEHOLDER}iPhone+11+Ex+UK`],
    specs: { Storage: "64GB", Color: "Black", Chip: "A13 Bionic", Grade: "Grade A" },
    stock: 20,
    isActive: true,
    isFeatured: false,
    isHotDeal: true,
    isNewArrival: false,
  },
  {
    name: "Apple Mac Mini M2",
    slug: "apple-mac-mini-m2",
    description:
      "Apple Mac Mini with M2 chip — powerful, compact desktop computer for home and office.",
    category: "mac",
    condition: "brand-new",
    price: 95000,
    images: [`${PLACEHOLDER}Mac+Mini+M2`],
    specs: {
      Chip: "Apple M2",
      RAM: "8GB",
      Storage: "256GB SSD",
      Ports: "2x Thunderbolt 4, 2x USB-A, HDMI",
    },
    stock: 3,
    isActive: true,
    isFeatured: true,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: 'Samsung 55" 4K Smart TV',
    slug: "samsung-55-4k-smart-tv",
    description: "Samsung 55-inch 4K UHD Smart TV with HDR10+ and built-in streaming apps.",
    category: "televisions",
    condition: "brand-new",
    price: 62000,
    images: [`${PLACEHOLDER}Samsung+55+4K+TV`],
    specs: { Size: "55 inches", Resolution: "4K UHD 3840x2160", Smart: "Tizen OS", HDR: "HDR10+" },
    stock: 8,
    isActive: true,
    isFeatured: true,
    isHotDeal: false,
    isNewArrival: false,
  },
  {
    name: 'LG 43" Smart TV Ex UK',
    slug: "lg-43-smart-tv-exuk",
    description:
      "LG 43-inch Full HD Smart TV Ex UK — excellent condition, WebOS, all apps working.",
    category: "televisions",
    condition: "ex-uk",
    price: 22000,
    compareAtPrice: 30000,
    images: [`${PLACEHOLDER}LG+43+TV+Ex+UK`],
    specs: { Size: "43 inches", Resolution: "Full HD 1080p", Smart: "WebOS", Grade: "Grade A" },
    stock: 6,
    isActive: true,
    isFeatured: false,
    isHotDeal: true,
    isNewArrival: false,
  },
  {
    name: "Sony HT-S400 Soundbar",
    slug: "sony-ht-s400-soundbar",
    description:
      "Sony HT-S400 2.1ch soundbar with wireless subwoofer. Powerful bass for your home cinema.",
    category: "audio",
    condition: "brand-new",
    price: 28000,
    images: [`${PLACEHOLDER}Sony+Soundbar`],
    specs: { Channels: "2.1", Power: "330W", Connectivity: "Bluetooth, HDMI ARC, Optical" },
    stock: 7,
    isActive: true,
    isFeatured: false,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: "Starlink Standard Kit",
    slug: "starlink-standard-kit",
    description:
      "SpaceX Starlink Standard residential kit. High-speed satellite internet anywhere in Kenya.",
    category: "connectivity",
    condition: "brand-new",
    price: 45000,
    images: [`${PLACEHOLDER}Starlink+Kit`],
    specs: {
      Speed: "25-220 Mbps",
      Latency: "25-60ms",
      Coverage: "Kenya nationwide",
      Power: "75W typical",
    },
    stock: 10,
    isActive: true,
    isFeatured: true,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: "PlayStation 5 Console",
    slug: "playstation-5",
    description:
      "Sony PlayStation 5 disc edition. Next-gen gaming with 4K, 120fps, and ultra-fast SSD.",
    category: "gaming",
    condition: "brand-new",
    price: 75000,
    images: [`${PLACEHOLDER}PlayStation+5`],
    specs: { Storage: "825GB SSD", Resolution: "Up to 8K", Framerates: "Up to 120fps" },
    stock: 4,
    isActive: true,
    isFeatured: true,
    isHotDeal: false,
    isNewArrival: false,
  },
  {
    name: "AirPods Max",
    slug: "airpods-max",
    description:
      "Apple AirPods Max — premium over-ear headphones with Active Noise Cancellation and spatial audio.",
    category: "audio",
    condition: "brand-new",
    price: 55000,
    images: [`${PLACEHOLDER}AirPods+Max`],
    specs: { ANC: "Active Noise Cancellation", Battery: "20 hours", Chip: "Apple H1" },
    stock: 6,
    isActive: true,
    isFeatured: true,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: "Secretlab TITAN Evo Gaming Chair",
    slug: "secretlab-titan-gaming-chair",
    description:
      "Secretlab TITAN Evo gaming chair with 4-way lumbar support and magnetic neck pillow.",
    category: "gaming",
    condition: "brand-new",
    price: 38000,
    images: [`${PLACEHOLDER}Gaming+Chair`],
    specs: {
      Material: "SoftWeave Fabric",
      Recline: "165 degrees",
      Armrests: "4D",
      Capacity: "Up to 130kg",
    },
    stock: 5,
    isActive: true,
    isFeatured: false,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: "Anker 26800mAh Power Bank",
    slug: "anker-26800-power-bank",
    description: "Anker 26800mAh high-capacity power bank. Charge your phone 6+ times on the go.",
    category: "power",
    condition: "brand-new",
    price: 6500,
    images: [`${PLACEHOLDER}Anker+Power+Bank`],
    specs: { Capacity: "26800mAh", Ports: "2x USB-A, 1x USB-C", Output: "Up to 30W" },
    stock: 25,
    isActive: true,
    isFeatured: false,
    isHotDeal: false,
    isNewArrival: false,
  },
  {
    name: "Apple USB-C 20W Charger",
    slug: "apple-usbc-20w-charger",
    description:
      "Apple 20W USB-C Power Adapter — fast charging for iPhone 8 and later, iPad, and AirPods.",
    category: "accessories",
    condition: "brand-new",
    price: 3500,
    images: [`${PLACEHOLDER}Apple+Charger`],
    specs: { Power: "20W", Port: "USB-C", Compatible: "iPhone 8+, iPad, AirPods" },
    stock: 30,
    isActive: true,
    isFeatured: false,
    isHotDeal: false,
    isNewArrival: false,
  },
  {
    name: "Apple Pencil 2nd Generation",
    slug: "apple-pencil-2nd-gen",
    description:
      "Apple Pencil 2nd Generation — magnetic wireless charging, pixel-perfect precision for iPad Pro.",
    category: "accessories",
    condition: "brand-new",
    price: 16000,
    images: [`${PLACEHOLDER}Apple+Pencil+2`],
    specs: {
      Compatible: "iPad Pro 11 inch, iPad Pro 12.9 inch, iPad Air 4+",
      Charging: "Magnetic wireless",
    },
    stock: 8,
    isActive: true,
    isFeatured: false,
    isHotDeal: false,
    isNewArrival: true,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    slug: "sony-wh1000xm5",
    description: "Sony WH-1000XM5 industry-leading noise cancelling headphones with 30hr battery.",
    category: "audio",
    condition: "brand-new",
    price: 42000,
    compareAtPrice: 48000,
    images: [`${PLACEHOLDER}Sony+WH1000XM5`],
    specs: {
      ANC: "Dual Noise Sensor",
      Battery: "30 hours",
      Codec: "LDAC, AAC, SBC",
      Weight: "250g",
    },
    stock: 9,
    isActive: true,
    isFeatured: false,
    isHotDeal: true,
    isNewArrival: false,
  },
];

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").collect();
    if (existing.length > 0) {
      return { message: "Database already seeded", count: existing.length };
    }
    const ids = await Promise.all(products.map((p) => ctx.db.insert("products", p)));
    return { message: "Seeded successfully", count: ids.length };
  },
});
