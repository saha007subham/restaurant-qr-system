/**
 * Mock Menu Categories and Items
 * Rich, mouth-watering café culinary data formatted in INR
 */

export const MENU_CATEGORIES = [
  { id: "all", name: "All Offerings", icon: "Utensils" },
  { id: "coffee", name: "Artisanal Coffee", icon: "Coffee" },
  { id: "bakes", name: "Fresh Bakes", icon: "Croissant" },
  { id: "sourdough", name: "Gourmet Toasts", icon: "Sandwich" },
  { id: "mains", name: "Savory Plates", icon: "Pizza" },
  { id: "beverages", name: "Cold Beverages", icon: "GlassWater" },
  { id: "desserts", name: "Sweet Endings", icon: "Cake" }
];

export const MOCK_MENU_ITEMS = [
  // Artisanal Coffee
  {
    id: "item-c01",
    name: "Classic Spanish Cortado",
    category: "coffee",
    price: 240,
    description: "Equal parts double ristretto of single-origin Chikmagalur Arabica and velvety textured warm milk.",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "5-7 mins",
    dietary: "Vegetarian",
    tags: ["Signature", "Single Origin"]
  },
  {
    id: "item-c02",
    name: "Smoked Vanilla Flat White",
    category: "coffee",
    price: 280,
    description: "Silky micro-foam poured over house-extracted Madagascar smoked vanilla espresso.",
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "6-8 mins",
    dietary: "Vegetarian",
    tags: ["Best Seller"]
  },
  {
    id: "item-c03",
    name: "Pour Over - Coorg Estate Geisha",
    category: "coffee",
    price: 320,
    description: "Hand-poured slow filter extraction featuring bright citrus floral notes, jasmine aroma and honey finish.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: false,
    prepTime: "8-10 mins",
    dietary: "Vegan",
    tags: ["Hand Brew", "Specialty"]
  },

  // Fresh Bakes
  {
    id: "item-b01",
    name: "Almond Frangipane Croissant",
    category: "bakes",
    price: 260,
    description: "Twice-baked French butter croissant stuffed with rich almond cream, dusted with powdered sugar and toasted flakes.",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "3-5 mins",
    dietary: "Vegetarian",
    tags: ["Freshly Baked", "Staff Favorite"]
  },
  {
    id: "item-b02",
    name: "Pain au Chocolat Valrhona",
    category: "bakes",
    price: 240,
    description: "Golden flaky laminated pastry rolled with twin batons of bittersweet 70% dark Valrhona chocolate.",
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "3-5 mins",
    dietary: "Vegetarian",
    tags: ["Classic French"]
  },

  // Gourmet Toasts
  {
    id: "item-s01",
    name: "Truffled Mushroom & Whipped Feta Toast",
    category: "sourdough",
    price: 420,
    description: "Rustic artisan sourdough toast topped with creamy herbed feta, pan-seared wild shiitake mushrooms and white truffle oil.",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "10-12 mins",
    dietary: "Vegetarian",
    tags: ["Chef Special", "Artisan Bread"]
  },
  {
    id: "item-s02",
    name: "Hass Avocado & Heirloom Tomato Tartine",
    category: "sourdough",
    price: 390,
    description: "Chunky seasoned Hass avocado, sun-ripened baby heirloom tomatoes, pickled red shallots and micro basil on sourdough.",
    imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "8-10 mins",
    dietary: "Vegan",
    tags: ["Healthy", "Plant Based"]
  },
  {
    id: "item-s03",
    name: "Smoked Chicken & Emmental Melt",
    category: "sourdough",
    price: 460,
    description: "Hickory-smoked pulled chicken breast, melted Swiss Emmental cheese, Dijon aioli and caramelized onion relish on grilled multigrain.",
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "12-14 mins",
    dietary: "Non-Vegetarian",
    tags: ["Hot Pressed", "Protein Rich"]
  },

  // Savory Plates
  {
    id: "item-m01",
    name: "San Marzano Burrata Margherita",
    category: "mains",
    price: 580,
    description: "48-hour fermented woodfired sourdough crust, Italian San Marzano tomato reduction, whole fresh burrata sphere, and torn Genovese basil.",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "14-16 mins",
    dietary: "Vegetarian",
    tags: ["Woodfired", "Fresh Burrata"]
  },
  {
    id: "item-m02",
    name: "Roasted Garlic Aglio e Olio",
    category: "mains",
    price: 480,
    description: "Hand-rolled bronze-die tagliolini tossed in EVOO, crispy garlic slivers, bird's eye chili, Kalamata olives and aged Grana Padano.",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d628178d?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: false,
    isBestseller: false,
    prepTime: "12-14 mins",
    dietary: "Vegetarian",
    tags: ["Al Dente", "Italian Classic"]
  },
  {
    id: "item-m03",
    name: "Rosemary Butter Chicken Skewers",
    category: "mains",
    price: 520,
    description: "Tender herb-marinated chicken skewers glazed in garlic-rosemary compound butter, served with charred lemon and garlic confit dip.",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "15-18 mins",
    dietary: "Non-Vegetarian",
    tags: ["High Protein", "Chef Special"]
  },

  // Cold Beverages
  {
    id: "item-v01",
    name: "Kaffir Lime & Passionfruit Fizz",
    category: "beverages",
    price: 260,
    description: "Hand-muddled kaffir lime leaves, tangy passionfruit pulp, sparkling tonic and crushed ice.",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "4-6 mins",
    dietary: "Vegan",
    tags: ["Refreshing", "Cold Pressed"]
  },
  {
    id: "item-v02",
    name: "Cascara Tonic Brew",
    category: "beverages",
    price: 280,
    description: "Sparkling botanical iced brew made from sun-dried coffee cherry cascara, hints of hibiscus and fresh mint sprig.",
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: false,
    prepTime: "4-5 mins",
    dietary: "Vegan",
    tags: ["Artisanal", "Zero Added Sugar"]
  },

  // Sweet Endings
  {
    id: "item-d01",
    name: "Belgian Espresso Tiramisu Pot",
    category: "desserts",
    price: 360,
    description: "Savoiardi ladyfingers steeped in our signature dark roast espresso and Marsala, layered with whipped mascarpone cream and raw Dutch cocoa.",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: true,
    isBestseller: true,
    prepTime: "3-5 mins",
    dietary: "Vegetarian",
    tags: ["House Special", "Signature Dessert"]
  },
  {
    id: "item-d02",
    name: "Salted Caramel Basque Cheesecake",
    category: "desserts",
    price: 380,
    description: "Burnt caramelized crust with an ultra-creamy, molten cheese center, served alongside a drizzle of warm Maldon salted caramel.",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isChefSpecial: false,
    isBestseller: true,
    prepTime: "3-5 mins",
    dietary: "Vegetarian",
    tags: ["Decadent", "Crowd Favorite"]
  }
];

