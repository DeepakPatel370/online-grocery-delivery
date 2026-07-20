/**
 * FreshMart Online Grocery Delivery System - Product Dataset
 */
const PRODUCTS_DATA = [
  // Fruits & Vegetables
  {
    id: 101,
    name: "Fresh Organic Bananas",
    category: "fruits-veg",
    categoryName: "Fruits & Vegetables",
    price: 1.99,
    originalPrice: 2.99,
    isVeg: true,
    brand: "FreshFarm",
    rating: 4.8,
    unit: "1 Dozen",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80",
    description: "Farm-fresh organic bananas rich in potassium and essential vitamins. Hand-picked for sweetness and quality."
  },
  {
    id: 102,
    name: "Crisp Red Apples",
    category: "fruits-veg",
    categoryName: "Fruits & Vegetables",
    price: 3.49,
    originalPrice: 4.29,
    isVeg: true,
    brand: "NaturePick",
    rating: 4.7,
    unit: "1 kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
    description: "Crunchy and sweet red apples sourced directly from orchards. Perfect for snacking or healthy salads."
  },
  {
    id: 103,
    name: "Fresh Spinach Bunch",
    category: "fruits-veg",
    categoryName: "Fruits & Vegetables",
    price: 1.49,
    originalPrice: 1.99,
    isVeg: true,
    brand: "GreenLeaf",
    rating: 4.5,
    unit: "250g",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80",
    description: "Nutrient-rich, pesticide-free fresh spinach leaves packed with iron and calcium."
  },

  // Dairy Products
  {
    id: 201,
    name: "Organic Whole Milk",
    category: "dairy",
    categoryName: "Dairy Products",
    price: 3.99,
    originalPrice: 4.59,
    isVeg: true,
    brand: "DairyPure",
    rating: 4.9,
    unit: "1 Liter",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80",
    description: "Pure, pasteurized whole milk with full cream goodness. No artificial hormones or preservatives."
  },
  {
    id: 202,
    name: "Artisanal Greek Yogurt",
    category: "dairy",
    categoryName: "Dairy Products",
    price: 2.79,
    originalPrice: 3.29,
    isVeg: true,
    brand: "DairyPure",
    rating: 4.6,
    unit: "400g",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80",
    description: "Thick, creamy Greek yogurt rich in protein and probiotics. Great with honey and berries."
  },
  {
    id: 203,
    name: "Cheddar Cheese Block",
    category: "dairy",
    categoryName: "Dairy Products",
    price: 4.99,
    originalPrice: 5.99,
    isVeg: true,
    brand: "FarmHouse",
    rating: 4.8,
    unit: "200g",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80",
    description: "Aged natural cheddar cheese with a sharp, savory flavor profile."
  },

  // Snacks
  {
    id: 301,
    name: "Roasted Salted Almonds",
    category: "snacks",
    categoryName: "Snacks",
    price: 6.99,
    originalPrice: 8.49,
    isVeg: true,
    brand: "NutriCrunch",
    rating: 4.9,
    unit: "250g",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d96?w=500&auto=format&fit=crop&q=80",
    description: "Slow-roasted California almonds lightly seasoned with sea salt."
  },
  {
    id: 302,
    name: "Crispy Potato Chips",
    category: "snacks",
    categoryName: "Snacks",
    price: 1.99,
    originalPrice: 2.49,
    isVeg: true,
    brand: "CrunchyCo",
    rating: 4.4,
    unit: "150g",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    description: "Golden sliced potato chips seasoned with sea salt and black pepper."
  },
  {
    id: 303,
    name: "Smoked Chicken Jerky Strips",
    category: "snacks",
    categoryName: "Snacks",
    price: 5.49,
    originalPrice: 6.49,
    isVeg: false,
    brand: "NutriCrunch",
    rating: 4.5,
    unit: "100g",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
    description: "Protein-packed smoked chicken jerky strips seasoned with hickory spices."
  },

  // Beverages
  {
    id: 401,
    name: "Fresh Orange Juice",
    category: "beverages",
    categoryName: "Beverages",
    price: 3.29,
    originalPrice: 3.99,
    isVeg: true,
    brand: "SqueezeJoy",
    rating: 4.7,
    unit: "1 Liter",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80",
    description: "100% cold-pressed orange juice with real pulp. No added sugars."
  },
  {
    id: 402,
    name: "Sparkling Mineral Water",
    category: "beverages",
    categoryName: "Beverages",
    price: 1.89,
    originalPrice: 2.29,
    isVeg: true,
    brand: "AquaPure",
    rating: 4.6,
    unit: "750ml",
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80",
    description: "Refreshing sparkling mineral water sourced from mountain springs."
  },

  // Household Items
  {
    id: 501,
    name: "Eco Dishwashing Liquid",
    category: "household",
    categoryName: "Household Items",
    price: 4.29,
    originalPrice: 4.99,
    isVeg: true,
    brand: "CleanHome",
    rating: 4.8,
    unit: "500ml",
    image: "https://images.unsplash.com/photo-1585670149967-b4f4da88cc9f?w=500&auto=format&fit=crop&q=80",
    description: "Tough on grease, gentle on hands. Made with plant-based biodegradable ingredients."
  },
  {
    id: 502,
    name: "Microfiber Cleaning Cloths",
    category: "household",
    categoryName: "Household Items",
    price: 5.99,
    originalPrice: 7.49,
    isVeg: true,
    brand: "CleanHome",
    rating: 4.9,
    unit: "Pack of 5",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
    description: "Ultra-absorbent lint-free microfiber towels suitable for kitchen and glass surfaces."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS_DATA;
}
