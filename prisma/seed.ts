/**
 * FULL DATABASE SEED — single file
 * Run with: npx tsx prisma/seed.ts   (or `npx prisma db seed` if configured)
 *
 * Order of operations (matches FK dependency chain in schema.prisma):
 * Users -> Sellers -> Brands -> Categories -> Products -> ProductCategory
 * -> Addresses -> Cart/CartItem -> Wishlist/WishlistItem -> Orders/OrderItem -> Reviews
 */

import { PrismaClient, Role, SellerStatus, OrderStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  n = Math.min(n, copy.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Unsplash direct CDN images — stable hotlink URLs, real photography,
// hand-picked per product type so "shoes" really show shoes, etc.
const IMG = {
  // Electronics
  smartphone: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    "https://images.unsplash.com/photo-1592286927505-1def25115558?w=800",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    "https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=800",
  ],
  laptop: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800",
    "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800",
  ],
  headphones: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
  ],
  camera: [
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
    "https://images.unsplash.com/photo-1606986628253-05620e9a2f0f?w=800",
  ],
  smartwatch: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
    "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800",
  ],
  // Fashion
  tshirt: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
  ],
  shirt: [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
    "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800",
  ],
  jeans: [
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
  ],
  dress: [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
  ],
  saree: [
    "https://images.unsplash.com/photo-1610030181087-540c1a1c3e1b?w=800",
    "https://images.unsplash.com/photo-1610189844466-9a35b5f68e4b?w=800",
  ],
  jacket: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800",
  ],
  // Footwear
  sneakers: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
  ],
  formalShoes: [
    "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800",
    "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800",
  ],
  sandals: [
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800",
    "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800",
  ],
  // Home & Kitchen
  cookware: [
    "https://images.unsplash.com/photo-1584990347449-a2d4c2a3f88e?w=800",
    "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800",
  ],
  storage: [
    "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800",
    "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800",
  ],
  decor: [
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
  ],
  appliance: [
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800",
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800",
    "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800",
  ],
  // Beauty
  skincare: [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
  ],
  haircare: [
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800",
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800",
  ],
  makeup: [
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
  ],
  // Sports
  gym: [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
  ],
  cycling: [
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800",
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800",
  ],
  yoga: [
    "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
  ],
  // Books
  fiction: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
  ],
  nonfiction: [
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
  ],
  // Furniture
  sofa: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
  ],
  bed: [
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
  ],
  officeChair: [
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800",
  ],
  // Grocery
  staples: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
  ],
  snacks: [
    "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800",
    "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800",
  ],
  beverages: [
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800",
    "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800",
  ],
  // Toys & Baby
  toys: [
    "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800",
    "https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=800",
  ],
  babyGear: [
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800",
  ],
};

type ImgKey = keyof typeof IMG;

// ---------------------------------------------------------------------------
// Category tree
// ---------------------------------------------------------------------------

const CATEGORY_TREE: Record<string, string[]> = {
  Electronics: ["Mobiles", "Laptops", "Audio", "Cameras", "Wearables"],
  "Fashion Men": ["T-Shirts", "Shirts", "Jeans", "Jackets"],
  "Fashion Women": ["Dresses", "Sarees", "Tops", "Jeans"],
  Footwear: ["Sneakers", "Formal Shoes", "Sandals & Flip-Flops"],
  "Home & Kitchen": [
    "Cookware",
    "Storage & Organization",
    "Home Decor",
    "Kitchen Appliances",
  ],
  "Beauty & Personal Care": ["Skincare", "Haircare", "Makeup"],
  "Sports & Fitness": ["Gym Equipment", "Cycling", "Yoga & Wellness"],
  Books: ["Fiction", "Non-Fiction"],
  Furniture: ["Living Room", "Bedroom", "Office Furniture"],
  Grocery: ["Staples", "Snacks", "Beverages"],
  "Toys & Baby": ["Toys & Games", "Baby Gear"],
};

// ---------------------------------------------------------------------------
// Brands (mapped roughly to categories, but stored globally)
// ---------------------------------------------------------------------------

const BRANDS = [
  "Samsung",
  "Apple",
  "OnePlus",
  "Sony",
  "Boat",
  "HP",
  "Dell",
  "Lenovo",
  "Canon",
  "Nikon",
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Levis",
  "H&M",
  "Zara",
  "Allen Solly",
  "Van Heusen",
  "Fabindia",
  "W for Woman",
  "Biba",
  "Woodland",
  "Bata",
  "Clarks",
  "Prestige",
  "Milton",
  "Borosil",
  "Philips",
  "Bajaj",
  "Havells",
  "Lakme",
  "Mamaearth",
  "Nivea",
  "LOreal",
  "WOW Skin Science",
  "Decathlon",
  "Cosco",
  "Yonex",
  "Penguin Books",
  "HarperCollins",
  "Wiley",
  "Nilkamal",
  "Godrej Interio",
  "Urban Ladder",
  "Tata",
  "Britannia",
  "Amul",
  "Nescafe",
  "Haldirams",
  "Fisher-Price",
  "Chicco",
  "LEGO",
];

// ---------------------------------------------------------------------------
// Product templates: [namePrefix, priceRangeInRupees, imgKey]
// Each subcategory gets a realistic spread of common product names/variants.
// ---------------------------------------------------------------------------

const PRODUCT_TEMPLATES: Record<
  string,
  { names: string[]; price: [number, number]; img: ImgKey }
> = {
  Mobiles: {
    names: [
      "Galaxy S23 Smartphone",
      "iPhone 14",
      "OnePlus Nord CE 3",
      "Redmi Note 12 Pro",
      "Galaxy A54 5G",
      "iPhone 13 Mini",
      "Pixel 7a",
      "Moto G Power",
    ],
    price: [12999, 89999],
    img: "smartphone",
  },
  Laptops: {
    names: [
      "Pavilion 15 Laptop",
      "MacBook Air M2",
      "ThinkPad E14",
      "Inspiron 15 3000",
      "IdeaPad Slim 3",
      "VivoBook 15",
      "ROG Strix G15 Gaming Laptop",
    ],
    price: [34999, 149999],
    img: "laptop",
  },
  Audio: {
    names: [
      "Wireless Bluetooth Headphones",
      "Noise Cancelling Earbuds",
      "Rockerz 450 Headphone",
      "WH-1000XM4 Headphones",
      "True Wireless Earbuds",
      "Portable Bluetooth Speaker",
    ],
    price: [999, 24999],
    img: "headphones",
  },
  Cameras: {
    names: [
      "EOS 1500D DSLR Camera",
      "Alpha a6400 Mirrorless Camera",
      "PowerShot Point & Shoot",
      "Action Camera 4K",
      "D3500 DSLR Camera",
    ],
    price: [14999, 89999],
    img: "camera",
  },
  Wearables: {
    names: [
      "Smart Watch Series 8",
      "Fitness Tracker Band",
      "Storm Smartwatch",
      "GTS Smartwatch",
      "Wear OS Smartwatch",
    ],
    price: [1499, 34999],
    img: "smartwatch",
  },
  "T-Shirts": {
    names: [
      "Men's Cotton Crew Neck T-Shirt",
      "Slim Fit Graphic T-Shirt",
      "Polo T-Shirt",
      "Henley T-Shirt",
      "Oversized Streetwear T-Shirt",
    ],
    price: [399, 1999],
    img: "tshirt",
  },
  Shirts: {
    names: [
      "Men's Formal Cotton Shirt",
      "Checked Casual Shirt",
      "Linen Shirt",
      "Slim Fit Office Shirt",
      "Denim Shirt",
    ],
    price: [699, 2999],
    img: "shirt",
  },
  Jeans: {
    names: [
      "Men's Slim Fit Jeans",
      "Straight Fit Denim Jeans",
      "Women's High-Waist Jeans",
      "Skinny Fit Jeans",
      "Relaxed Fit Denim",
    ],
    price: [999, 3499],
    img: "jeans",
  },
  Jackets: {
    names: [
      "Men's Bomber Jacket",
      "Denim Jacket",
      "Puffer Winter Jacket",
      "Windcheater Jacket",
    ],
    price: [1299, 4999],
    img: "jacket",
  },
  Dresses: {
    names: [
      "Women's Floral Maxi Dress",
      "A-Line Casual Dress",
      "Bodycon Party Dress",
      "Wrap Dress",
      "Summer Sundress",
    ],
    price: [899, 3999],
    img: "dress",
  },
  Sarees: {
    names: [
      "Banarasi Silk Saree",
      "Cotton Handloom Saree",
      "Chiffon Printed Saree",
      "Georgette Party Saree",
    ],
    price: [1299, 8999],
    img: "saree",
  },
  Tops: {
    names: ["Women's Casual Top", "Crop Top", "Peplum Top", "Off-Shoulder Top"],
    price: [399, 1799],
    img: "tshirt",
  },
  Sneakers: {
    names: [
      "Air Max Running Shoes",
      "Ultraboost Sneakers",
      "Classic Canvas Sneakers",
      "Court Vision Sneakers",
      "Suede Casual Sneakers",
      "Running Shoes Pro",
    ],
    price: [1499, 12999],
    img: "sneakers",
  },
  "Formal Shoes": {
    names: [
      "Men's Leather Oxford Shoes",
      "Formal Derby Shoes",
      "Slip-On Loafers",
      "Brogue Shoes",
    ],
    price: [1999, 6999],
    img: "formalShoes",
  },
  "Sandals & Flip-Flops": {
    names: [
      "Men's Sports Sandals",
      "Women's Flat Sandals",
      "Flip-Flops",
      "Comfort Slides",
    ],
    price: [399, 1999],
    img: "sandals",
  },
  Cookware: {
    names: [
      "Non-Stick Frying Pan",
      "Stainless Steel Cookware Set",
      "Pressure Cooker 5L",
      "Cast Iron Tawa",
      "Induction Base Kadai",
    ],
    price: [499, 4999],
    img: "cookware",
  },
  "Storage & Organization": {
    names: [
      "Airtight Storage Container Set",
      "Plastic Storage Boxes",
      "Wardrobe Organizer",
      "Modular Kitchen Rack",
    ],
    price: [299, 2499],
    img: "storage",
  },
  "Home Decor": {
    names: [
      "Wall Art Canvas Painting",
      "Decorative Table Lamp",
      "Ceramic Flower Vase",
      "Wall Clock",
    ],
    price: [399, 3499],
    img: "decor",
  },
  "Kitchen Appliances": {
    names: [
      "Mixer Grinder 750W",
      "Electric Kettle 1.5L",
      "Air Fryer",
      "Toaster 2-Slice",
      "Induction Cooktop",
      "Microwave Oven 20L",
    ],
    price: [999, 8999],
    img: "appliance",
  },
  Skincare: {
    names: [
      "Vitamin C Face Serum",
      "Aloe Vera Gel",
      "Sunscreen SPF 50",
      "Face Moisturizer",
      "Charcoal Face Wash",
      "Under Eye Cream",
    ],
    price: [199, 1499],
    img: "skincare",
  },
  Haircare: {
    names: [
      "Anti-Dandruff Shampoo",
      "Argan Oil Hair Serum",
      "Onion Hair Oil",
      "Hair Conditioner",
    ],
    price: [149, 999],
    img: "haircare",
  },
  Makeup: {
    names: [
      "Matte Lipstick",
      "Compact Powder",
      "Kajal & Eyeliner Combo",
      "Foundation",
    ],
    price: [199, 1299],
    img: "makeup",
  },
  "Gym Equipment": {
    names: [
      "Adjustable Dumbbells Set",
      "Yoga Mat",
      "Resistance Bands Set",
      "Skipping Rope",
      "Gym Gloves",
    ],
    price: [299, 4999],
    img: "gym",
  },
  Cycling: {
    names: [
      "Mountain Bike 21-Speed",
      "Cycling Helmet",
      "Road Bike",
      "Kids Bicycle",
    ],
    price: [3999, 24999],
    img: "cycling",
  },
  "Yoga & Wellness": {
    names: [
      "Premium Yoga Mat",
      "Yoga Block Set",
      "Meditation Cushion",
      "Foam Roller",
    ],
    price: [399, 1999],
    img: "yoga",
  },
  Fiction: {
    names: [
      "The Silent Patient",
      "Atomic Habits",
      "A Court of Thorns and Roses",
      "The Alchemist",
      "Where the Crawdads Sing",
      "Ikigai",
    ],
    price: [199, 599],
    img: "fiction",
  },
  "Non-Fiction": {
    names: [
      "Sapiens: A Brief History of Humankind",
      "Rich Dad Poor Dad",
      "The Power of Habit",
      "Thinking, Fast and Slow",
    ],
    price: [249, 699],
    img: "nonfiction",
  },
  "Living Room": {
    names: [
      "3-Seater Fabric Sofa",
      "Coffee Table",
      "TV Entertainment Unit",
      "Recliner Chair",
    ],
    price: [4999, 39999],
    img: "sofa",
  },
  Bedroom: {
    names: [
      "Queen Size Bed",
      "Wardrobe 3-Door",
      "Bedside Table",
      "King Size Mattress",
    ],
    price: [5999, 44999],
    img: "bed",
  },
  "Office Furniture": {
    names: [
      "Ergonomic Office Chair",
      "Study Table",
      "Bookshelf",
      "Executive Office Desk",
    ],
    price: [2499, 15999],
    img: "officeChair",
  },
  Staples: {
    names: [
      "Basmati Rice 5kg",
      "Toor Dal 1kg",
      "Whole Wheat Atta 5kg",
      "Cooking Oil 1L",
      "Sugar 1kg",
    ],
    price: [49, 599],
    img: "staples",
  },
  Snacks: {
    names: [
      "Potato Chips",
      "Namkeen Mixture 400g",
      "Chocolate Cookies",
      "Roasted Almonds 200g",
    ],
    price: [29, 349],
    img: "snacks",
  },
  Beverages: {
    names: [
      "Instant Coffee 200g",
      "Green Tea Bags",
      "Fruit Juice 1L",
      "Soft Drink 2L",
    ],
    price: [39, 449],
    img: "beverages",
  },
  "Toys & Games": {
    names: [
      "Building Blocks Set",
      "Remote Control Car",
      "Puzzle Game 500pc",
      "Action Figure",
    ],
    price: [199, 2999],
    img: "toys",
  },
  "Baby Gear": {
    names: [
      "Baby Stroller",
      "Baby Feeding Bottle Set",
      "Diaper Pack (Pack of 50)",
      "Baby Carrier",
    ],
    price: [299, 8999],
    img: "babyGear",
  },
};

// ---------------------------------------------------------------------------
// Buyer / seller name pools
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Reyansh",
  "Ayaan",
  "Ananya",
  "Diya",
  "Ishita",
  "Saanvi",
  "Myra",
  "Aadhya",
  "Kiara",
  "Anika",
  "Rohan",
  "Karan",
  "Pooja",
  "Neha",
  "Priya",
  "Rahul",
  "Simran",
  "Aman",
];
const LAST_NAMES = [
  "Sharma",
  "Verma",
  "Gupta",
  "Singh",
  "Kumar",
  "Patel",
  "Reddy",
  "Nair",
  "Iyer",
  "Chopra",
  "Malhotra",
  "Kapoor",
  "Mehta",
  "Joshi",
  "Rao",
  "Das",
];

const CITIES = [
  { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
  { city: "Delhi", state: "Delhi", pincode: "110001" },
  { city: "Bengaluru", state: "Karnataka", pincode: "560001" },
  { city: "Hyderabad", state: "Telangana", pincode: "500001" },
  { city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
  { city: "Pune", state: "Maharashtra", pincode: "411001" },
  { city: "Kolkata", state: "West Bengal", pincode: "700001" },
  { city: "Ahmedabad", state: "Gujarat", pincode: "380001" },
  { city: "Jaipur", state: "Rajasthan", pincode: "302001" },
  { city: "Chandigarh", state: "Chandigarh", pincode: "160001" },
];

function fullName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

function phone() {
  return `9${randInt(100000000, 999999999)}`;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding started...");
  const passwordHash = await bcrypt.hash("Password@123", 10);

  // -------------------------------------------------------------------
  // 1. USERS (buyers) + 1 admin
  // -------------------------------------------------------------------
  console.log("Creating users...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@shopreal.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@shopreal.com",
      password: passwordHash,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const buyerUsers = [];
  for (let i = 1; i <= 25; i++) {
    const name = fullName();
    const email = `buyer${i}@shopreal.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        password: passwordHash,
        role: Role.USER,
        isVerified: true,
      },
    });
    buyerUsers.push(user);
  }

  // -------------------------------------------------------------------
  // 2. SELLERS (each backed by a User with role USER, per schema 1:1)
  // -------------------------------------------------------------------
  console.log("Creating sellers...");
  const sellerStoreNames = [
    "TechBazaar India",
    "UrbanStyle Fashion",
    "StepUp Footwear",
    "HomeEssentials Store",
    "GlowBeauty Mart",
    "FitLife Sports",
    "PageTurner Books",
    "ComfortHome Furniture",
    "DailyNeeds Grocery",
    "KidsWonderland",
    "GadgetHub",
    "TrendzWear",
    "ShoeCircle",
    "KitchenKing",
    "PureGlow Cosmetics",
  ];

  const sellers = [];
  for (let i = 0; i < sellerStoreNames.length; i++) {
    const storeName = sellerStoreNames[i];
    const email = `seller${i + 1}@shopreal.com`;
    const sellerUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `${storeName} Owner`,
        email,
        password: passwordHash,
        role: Role.USER,
        isVerified: true,
      },
    });

    const loc = pick(CITIES);
    const seller = await prisma.seller.upsert({
      where: { userId: sellerUser.id },
      update: {},
      create: {
        userId: sellerUser.id,
        storeName,
        slug: slugify(storeName),
        description: `${storeName} — trusted seller offering quality products with fast delivery across India.`,
        phone: phone(),
        addressLine: `${randInt(1, 200)}, Industrial Area`,
        city: loc.city,
        state: loc.state,
        pincode: loc.pincode,
        country: "India",
        gstin: `29ABCDE${1000 + i}F1Z${i % 10}`,
        pan: `ABCDE${1000 + i}F`,
        status: SellerStatus.APPROVED,
      },
    });
    sellers.push(seller);
  }

  // -------------------------------------------------------------------
  // 3. BRANDS
  // -------------------------------------------------------------------
  console.log("Creating brands...");
  const brandRecords: Record<string, { id: string }> = {};
  for (const b of BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { slug: slugify(b) },
      update: {},
      create: { name: b, slug: slugify(b) },
    });
    brandRecords[b] = brand;
  }

  // -------------------------------------------------------------------
  // 4. CATEGORIES (parent + children)
  // -------------------------------------------------------------------
  console.log("Creating categories...");
  const subCategoryRecords: Record<string, { id: string; name: string }> = {};

  for (const [parentName, children] of Object.entries(CATEGORY_TREE)) {
    const parent = await prisma.category.upsert({
      where: { slug: slugify(parentName) },
      update: {},
      create: {
        name: parentName,
        slug: slugify(parentName),
        description: `Shop the best ${parentName} products online.`,
        isActive: true,
      },
    });

    for (const childName of children) {
      const child = await prisma.category.upsert({
        where: { slug: slugify(`${parentName}-${childName}`) },
        update: {},
        create: {
          name: childName,
          slug: slugify(`${parentName}-${childName}`),
          description: `${childName} — part of ${parentName}.`,
          isActive: true,
          parentId: parent.id,
        },
      });
      subCategoryRecords[childName] = child;
    }
  }

  // -------------------------------------------------------------------
  // 5. PRODUCTS + ProductCategory links
  // -------------------------------------------------------------------
  console.log("Creating products...");
  let skuCounter = 1000;
  const allProducts: { id: string; name: string; priceInPaise: number }[] = [];

  for (const [subCatName, template] of Object.entries(PRODUCT_TEMPLATES)) {
    const category = subCategoryRecords[subCatName];
    if (!category) continue;

    const images = IMG[template.img];

    for (const baseName of template.names) {
      // 2-3 brand/color variants per base product name to build up realistic count
      const variantCount = randInt(2, 3);
      const chosenBrands = pickMany(BRANDS, variantCount);

      for (const brandName of chosenBrands) {
        skuCounter++;
        const seller = pick(sellers);
        const price = randInt(template.price[0], template.price[1]);
        const productName = `${brandName} ${baseName}`;
        const slug = slugify(`${productName}-${skuCounter}`);
        const image = pick(images);
        const stock = randInt(5, 200);
        const rating = Number((3.5 + Math.random() * 1.5).toFixed(1));
        const reviewsCount = randInt(3, 250);

        const product = await prisma.product.upsert({
          where: { slug },
          update: {},
          create: {
            name: productName,
            slug,
            description: `${productName} — premium quality, great value. Perfect for everyday use with reliable performance and durability.`,
            imageUrl: image,
            priceInPaise: price * 100,
            stock,
            isActive: true,
            isPublished: true,
            isDeleted: false,
            sku: `SKU-${skuCounter}`,
            averageRating: rating,
            totalReviews: reviewsCount,
            sellerId: seller.id,
            brandId: brandRecords[brandName]?.id,
          },
        });

        await prisma.productCategory.upsert({
          where: {
            productId_categoryId: {
              productId: product.id,
              categoryId: category.id,
            },
          },
          update: {},
          create: { productId: product.id, categoryId: category.id },
        });

        allProducts.push({
          id: product.id,
          name: product.name,
          priceInPaise: product.priceInPaise,
        });
      }
    }
  }
  console.log(`Created ${allProducts.length} products.`);

  // -------------------------------------------------------------------
  // 6. ADDRESSES for buyers
  // -------------------------------------------------------------------
  console.log("Creating addresses...");
  const userAddresses: Record<
    string,
    {
      id: string;
      fullName: string;
      phone: string;
      addressLine: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    }[]
  > = {};

  for (const user of buyerUsers) {
    const numAddresses = randInt(1, 2);
    userAddresses[user.id] = [];
    for (let i = 0; i < numAddresses; i++) {
      const loc = pick(CITIES);
      const addr = await prisma.address.create({
        data: {
          userId: user.id,
          fullName: user.name,
          phone: phone(),
          addressLine: `${randInt(1, 999)}, ${pick(["MG Road", "Park Street", "Ring Road", "Station Road", "Sector 21", "Civil Lines"])}`,
          city: loc.city,
          state: loc.state,
          pincode: loc.pincode,
          country: "India",
          isDefault: i === 0,
        },
      });
      userAddresses[user.id].push(addr);
    }
  }

  // -------------------------------------------------------------------
  // 7. CART + CartItem for some buyers
  // -------------------------------------------------------------------
  console.log("Creating carts...");
  for (const user of buyerUsers.slice(0, 15)) {
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
    const items = pickMany(allProducts, randInt(1, 4));
    for (const p of items) {
      await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: p.id } },
        update: {},
        create: { cartId: cart.id, productId: p.id, quantity: randInt(1, 3) },
      });
    }
  }

  // -------------------------------------------------------------------
  // 8. WISHLIST + WishlistItem for some buyers
  // -------------------------------------------------------------------
  console.log("Creating wishlists...");
  for (const user of buyerUsers.slice(0, 18)) {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
    const items = pickMany(allProducts, randInt(1, 5));
    for (const p of items) {
      await prisma.wishlistItem.upsert({
        where: {
          wishlistId_productId: { wishlistId: wishlist.id, productId: p.id },
        },
        update: {},
        create: { wishlistId: wishlist.id, productId: p.id },
      });
    }
  }

  // -------------------------------------------------------------------
  // 9. ORDERS + OrderItem
  // -------------------------------------------------------------------
  console.log("Creating orders...");
  const statuses = [
    OrderStatus.DELIVERED,
    OrderStatus.SHIPPED,
    OrderStatus.PROCESSING,
    OrderStatus.PENDING,
    OrderStatus.CANCELLED,
  ];

  for (const user of buyerUsers) {
    const numOrders = randInt(0, 3);
    const addresses = userAddresses[user.id];
    if (!addresses || addresses.length === 0) continue;

    for (let o = 0; o < numOrders; o++) {
      const addr = pick(addresses);
      const orderItemsSrc = pickMany(allProducts, randInt(1, 4));
      const status = pick(statuses);

      let subtotal = 0;
      const itemsData = orderItemsSrc.map((p) => {
        const qty = randInt(1, 2);
        subtotal += p.priceInPaise * qty;
        return { product: p, qty };
      });
      const shipping = subtotal > 50000 ? 0 : 4900;
      const discount = Math.random() < 0.3 ? Math.round(subtotal * 0.1) : 0;
      const total = subtotal + shipping - discount;

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          status,
          subtotalInPaise: subtotal,
          shippingInPaise: shipping,
          discountInPaise: discount,
          totalInPaise: total,
          shippingFullName: addr.fullName,
          shippingPhone: addr.phone,
          shippingAddressLine: addr.addressLine,
          shippingCity: addr.city,
          shippingState: addr.state,
          shippingPincode: addr.pincode,
          shippingCountry: addr.country,
        },
      });

      for (const item of itemsData) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            quantity: item.qty,
            priceInPaise: item.product.priceInPaise,
            productName: item.product.name,
            sku: `SKU-${item.product.id.slice(0, 6)}`,
            status,
          },
        });
      }
    }
  }

  // -------------------------------------------------------------------
  // 10. REVIEWS
  // -------------------------------------------------------------------
  console.log("Creating reviews...");
  const reviewComments = [
    "Great product, exactly as described. Highly recommend!",
    "Good value for money, fast delivery too.",
    "Quality could be better but overall satisfied.",
    "Excellent! Will definitely buy again.",
    "Product matches the images shown. Very happy with purchase.",
    "Decent quality, works as expected.",
    "Superb quality and quick delivery, loved it!",
    "Average product, expected a bit more for the price.",
  ];

  for (const user of buyerUsers) {
    const reviewedProducts = pickMany(allProducts, randInt(1, 4));
    for (const p of reviewedProducts) {
      try {
        await prisma.review.upsert({
          where: { userId_productId: { userId: user.id, productId: p.id } },
          update: {},
          create: {
            userId: user.id,
            productId: p.id,
            rating: randInt(3, 5),
            comment: pick(reviewComments),
          },
        });
      } catch {
        // skip duplicate edge cases silently
      }
    }
  }

  console.log("✅ Seeding complete!");
  console.log(`Users: ${buyerUsers.length + 1} (incl. 1 admin)`);
  console.log(`Sellers: ${sellers.length}`);
  console.log(`Brands: ${BRANDS.length}`);
  console.log(
    `Categories: ${Object.keys(CATEGORY_TREE).length} parent + ${Object.keys(subCategoryRecords).length} sub`,
  );
  console.log(`Products: ${allProducts.length}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
