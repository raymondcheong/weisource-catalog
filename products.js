/**
 * Product catalog — edit in this file.
 *
 * Required fields per product:
 *   name      — product name
 *   category  — "clothing" | "mixed-bags" | "school-bags" | "shoes"
 *   sizes     — array of sizes, e.g. ["S", "M", "L"]
 *   moq       — minimum order quantity (number)
 *   price     — display text, e.g. "$4.80/pc" or "USD 12/box"
 *   cbm       — cubic metres (number), e.g. 0.12
 *   colors    — color / style options
 *   image     — "images/products/photo.jpg" or full URL
 *
 * Optional: moqUnit ("pcs" default), cbmNote, remarks, featured, isNew, id
 */
const PRODUCTS = [
  {
    id: "cl-tshirt-300g",
    name: "Cotton T-Shirt (~300g)",
    category: "clothing",
    sizes: ["One size fits all"],
    moq: 300,
    moqUnit: "pcs",
    price: "¥18/pc",
    cbm: 0.3,
    colors: ["Assorted"],
    image: "images/products/cl-tshirt-300g.jpg",
    featured: true,
    isNew: true,
  },
  {
    id: "mb-tote-quality",
    name: "Quality Tote Bags",
    category: "mixed-bags",
    sizes: ["One size"],
    moq: 100,
    moqUnit: "pcs",
    price: "¥19/pc",
    cbmNote: "100 pcs per carton",
    colors: ["10 patterns (assorted)"],
    image: "images/products/mb-tote-quality.jpg",
    featured: true,
    isNew: true,
  },
  {
    id: "sh-mixed-heels",
    name: "Mixed Heels",
    category: "shoes",
    sizes: ["34", "35", "36", "37", "38", "39", "40", "41"],
    moq: 300,
    moqUnit: "prs",
    price: "¥22/pr",
    colors: ["Mixed (random styles)"],
    remarks: "Mixed styles, randomly combined",
    image: "images/products/sh-mixed-heels.jpg",
    featured: true,
    isNew: true,
  },
  {
    id: "cl-001",
    name: "Ankara Print Maxi Dress",
    category: "clothing",
    sizes: ["S", "M", "L", "XL"],
    moq: 30,
    moqUnit: "pcs",
    price: "$4.80/pc",
    cbm: 0.12,
    cbmNote: "per carton (50 pcs)",
    colors: ["Blue/Gold", "Red/Green", "Brown/Orange"],
    image: "images/products/cl-ank-001.jpg",
    featured: true,
    isNew: true,
  },
  {
    id: "cl-002",
    name: "Men's Cotton Polo Shirt",
    category: "clothing",
    sizes: ["M", "L", "XL", "XXL"],
    moq: 50,
    price: "$3.20/pc",
    cbm: 0.08,
    cbmNote: "per carton (60 pcs)",
    colors: ["Navy", "White", "Black"],
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    featured: true,
    isNew: false,
  },
  {
    id: "cl-003",
    name: "Kids School Uniform Set",
    category: "clothing",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    moq: 40,
    price: "$5.50/set",
    cbm: 0.15,
    colors: ["White/Navy", "White/Green"],
    image: "https://images.unsplash.com/photo-1503454537849-ff79e43b70b8?w=600&q=80",
    featured: false,
    isNew: true,
  },
  {
    id: "mb-001",
    name: "Ladies Mixed Handbag Lot",
    category: "mixed-bags",
    sizes: ["One size"],
    moq: 20,
    moqUnit: "lots",
    price: "$85/lot",
    cbm: 0.35,
    cbmNote: "12 bags per lot",
    colors: ["Assorted styles"],
    image: "images/products/mb-mix-100.jpg",
    featured: true,
    isNew: false,
  },
  {
    id: "mb-002",
    name: "Travel Duffel Bag — Mixed Colors",
    category: "mixed-bags",
    sizes: ["Large"],
    moq: 100,
    price: "$6.50/pc",
    cbm: 0.22,
    colors: ["Black", "Grey", "Army Green"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    featured: true,
    isNew: true,
  },
  {
    id: "sb-001",
    name: "Primary School Backpack",
    category: "school-bags",
    sizes: ["Small", "Medium", "Large"],
    moq: 60,
    price: "$4.20/pc",
    cbm: 0.18,
    cbmNote: "per carton (40 pcs)",
    colors: ["Blue", "Pink", "Black", "Red"],
    image: "images/products/sb-pr-201.jpg",
    featured: true,
    isNew: false,
  },
  {
    id: "sb-002",
    name: "Double Compartment School Bag",
    category: "school-bags",
    sizes: ["Medium", "Large"],
    moq: 48,
    price: "$5.80/pc",
    cbm: 0.2,
    colors: ["Navy/Orange", "Black/Green"],
    image: "https://images.unsplash.com/photo-1622560480605-d83c853ff99e?w=600&q=80",
    featured: false,
    isNew: true,
  },
  {
    id: "sh-001",
    name: "Men's Casual Sneakers",
    category: "shoes",
    sizes: ["40", "41", "42", "43", "44"],
    moq: 24,
    moqUnit: "prs",
    price: "$7.50/pr",
    cbm: 0.14,
    cbmNote: "12 prs per carton",
    colors: ["White/Black", "All Black"],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    featured: true,
    isNew: true,
  },
  {
    id: "sh-002",
    name: "Kids Black School Shoes",
    category: "shoes",
    sizes: ["28", "30", "32", "34", "36"],
    moq: 36,
    moqUnit: "prs",
    price: "$5.20/pr",
    cbm: 0.11,
    colors: ["Black"],
    image: "https://images.unsplash.com/photo-1606107557195-0a3957a3f4d0?w=600&q=80",
    featured: false,
    isNew: false,
  },
];

const CATEGORY_LABELS = {
  all: "All",
  clothing: "Clothing",
  "mixed-bags": "Mixed Bags",
  "school-bags": "School Bags",
  shoes: "Shoes",
};

function getUniqueSizes(products) {
  const sizes = new Set();
  products.forEach((p) => p.sizes.forEach((s) => sizes.add(s)));
  return [...sizes];
}

function formatMoq(product) {
  const unit = product.moqUnit || "pcs";
  return `${product.moq} ${unit}`;
}

function formatCbm(product) {
  if (product.cbm == null || product.cbm === "") {
    return product.cbmNote || "—";
  }
  const base = `${product.cbm} CBM`;
  return product.cbmNote ? `${base} (${product.cbmNote})` : base;
}
