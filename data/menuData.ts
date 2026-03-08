import { MenuItem } from '../types';

export const FULL_MENU: MenuItem[] = [
  // Coffee
  { id: 1, name: "Americano", description: "Classic espresso with hot water.", price: "₱110", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Purificacion (Sweetened Americano)", description: "Our signature sweetened black coffee.", price: "₱120", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Vietnamese Coffee", description: "Strong coffee with condensed milk.", price: "₱140", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Café Latte", description: "Espresso with steamed milk.", price: "₱130", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Spanish Latte", description: "Espresso with condensed milk and steamed milk.", price: "₱145", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "French Vanilla", description: "Creamy vanilla flavored latte.", price: "₱150", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1595434066389-01303474030a?auto=format&fit=crop&q=80&w=400" },
  { id: 7, name: "Hazelnut", description: "Nutty hazelnut flavored latte.", price: "₱150", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400" },
  { id: 8, name: "Mocha", description: "Espresso with chocolate and steamed milk.", price: "₱155", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1534706636972-c0114718c18d?auto=format&fit=crop&q=80&w=400" },
  { id: 9, name: "White Chocolate Mocha", description: "Sweet white chocolate and espresso.", price: "₱160", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400" },
  { id: 10, name: "Salted Caramel", description: "Perfect balance of sweet and salty.", price: "₱160", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=400" },
  { id: 11, name: "Caramel Mocha", description: "Chocolate and caramel fusion.", price: "₱165", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400" },
  { id: 12, name: "Dark Mocha", description: "Rich dark chocolate with espresso.", price: "₱165", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400" },
  { id: 13, name: "Caramel Macchiato", description: "Layered espresso and milk with caramel drizzle.", price: "₱160", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=400" },
  { id: 14, name: "Dirty Matcha", description: "Matcha latte with a shot of espresso.", price: "₱170", category: "Coffee", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },

  // Non-Coffee
  { id: 15, name: "Tiger Sugar Milk", description: "Brown sugar boba style milk.", price: "₱140", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400" },
  { id: 16, name: "Blueberry Latte", description: "Creamy milk with blueberry syrup.", price: "₱150", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2ad299dd4?auto=format&fit=crop&q=80&w=400" },
  { id: 17, name: "Strawberry Latte", description: "Fresh strawberry milk latte.", price: "₱150", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&q=80&w=400" },
  { id: 18, name: "Classic Chocolate", description: "Rich and creamy hot chocolate.", price: "₱130", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400" },
  { id: 19, name: "Red Velvet", description: "Velvety smooth red velvet milk.", price: "₱150", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=400" },
  { id: 20, name: "Caramel Milk", description: "Sweet caramel infused milk.", price: "₱130", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400" },
  { id: 21, name: "Triple Chocolate", description: "The ultimate chocolate experience.", price: "₱160", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400" },
  { id: 22, name: "Mixed Berries Latte", description: "A blend of berries and milk.", price: "₱160", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1553173154-5622b1af05ff?auto=format&fit=crop&q=80&w=400" },
  { id: 23, name: "Oreo Latte", description: "Cookies and cream delight.", price: "₱160", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400" },
  { id: 24, name: "Taro Latte", description: "Sweet and earthy taro milk.", price: "₱150", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=400" },
  { id: 25, name: "Strawberry Oreo Latte", description: "Strawberry and Oreo fusion.", price: "₱170", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=400" },
  { id: 26, name: "Dark Berry", description: "Rich dark berry flavored milk.", price: "₱160", category: "Non-Coffee", imageUrl: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&q=80&w=400" },

  // Refreshers
  { id: 27, name: "Blueberry Soda", description: "Sparkling blueberry refresher.", price: "₱120", category: "Refreshers", imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400" },
  { id: 28, name: "Strawberry Soda", description: "Fizzy strawberry delight.", price: "₱120", category: "Refreshers", imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400" },
  { id: 29, name: "Mixed Berries Soda", description: "Refreshing berry mix with soda.", price: "₱130", category: "Refreshers", imageUrl: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=400" },

  // Sea Salt Series
  { id: 30, name: "Sea Salt Latte", description: "Classic latte with a salty cream top.", price: "₱160", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400" },
  { id: 31, name: "Sea Salt Chocolate", description: "Rich chocolate with sea salt cream.", price: "₱160", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400" },
  { id: 32, name: "Sea Salt Spanish Latte", description: "Sweet Spanish latte with salty cream.", price: "₱170", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400" },
  { id: 33, name: "Sea Salt Spanish Oat", description: "Spanish latte with oat milk and salty cream.", price: "₱190", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400" },
  { id: 34, name: "Sea Salt Red Velvet", description: "Red velvet milk with sea salt cream.", price: "₱170", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=400" },
  { id: 35, name: "Sea Salt Mocha", description: "Chocolatey mocha with salty cream.", price: "₱175", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1534706636972-c0114718c18d?auto=format&fit=crop&q=80&w=400" },
  { id: 36, name: "Sea Salt Matcha Latte", description: "Matcha latte topped with sea salt cream.", price: "₱180", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 37, name: "Sea Salt Matcha Oat", description: "Oat milk matcha with sea salt cream.", price: "₱200", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 38, name: "Sea Salt Caramel Latte", description: "Caramel latte with salty cream.", price: "₱180", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=400" },
  { id: 39, name: "Sea Salt Caramel Mocha", description: "Caramel mocha with salty cream.", price: "₱185", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400" },
  { id: 40, name: "Sea Salt Triple Chocolate", description: "Triple chocolate with salty cream.", price: "₱180", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400" },
  { id: 41, name: "Sea Salt Taro Latte", description: "Taro milk with sea salt cream.", price: "₱170", category: "Sea Salt Series", imageUrl: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=400" },

  // Matcha Series
  { id: 42, name: "Matcha Latte", description: "Pure Japanese matcha with milk.", price: "₱150", category: "Matcha Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 43, name: "Blueberry Matcha Latte", description: "Matcha with a hint of blueberry.", price: "₱170", category: "Matcha Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 44, name: "Strawberry Matcha Latte", description: "Matcha with fresh strawberry puree.", price: "₱170", category: "Matcha Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 45, name: "Salted Caramel Matcha", description: "Matcha with salted caramel syrup.", price: "₱170", category: "Matcha Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 46, name: "White Chocolate Matcha", description: "Matcha with sweet white chocolate.", price: "₱170", category: "Matcha Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },
  { id: 47, name: "Matcha Oreo Latte", description: "Matcha with crushed Oreo cookies.", price: "₱175", category: "Matcha Series", imageUrl: "https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400" },

  // Barista Drink
  { id: 48, name: "Iced Brown", description: "Special barista blend with brown sugar.", price: "₱150", category: "Barista Drink", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400" },
  { id: 49, name: "Espresso Cookie", description: "Espresso shot with cookie flavors.", price: "₱160", category: "Barista Drink", imageUrl: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400" },
  { id: 50, name: "Oro Blanco", description: "White chocolate and espresso blend.", price: "₱165", category: "Barista Drink", imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400" },
  { id: 51, name: "Quad Espresso", description: "Four shots of pure energy.", price: "₱180", category: "Barista Drink", imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400" },

  // Add-ons
  { id: 52, name: "Sub-Oat", description: "Upgrade to Oat Milk.", price: "₱40", category: "Add-ons", imageUrl: "https://images.unsplash.com/photo-1550583724-125581cc255b?auto=format&fit=crop&q=80&w=400" },
  { id: 53, name: "Espresso Shot", description: "Extra shot of espresso.", price: "₱30", category: "Add-ons", imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400" },
  { id: 54, name: "Sea Salt Cream", description: "Extra salty cream topping.", price: "₱35", category: "Add-ons", imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400" },
  { id: 55, name: "Sauce pump", description: "Chocolate, Caramel, Salted Caramel, or White Chocolate.", price: "₱20", category: "Add-ons", imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400" },
  { id: 56, name: "Syrup pump", description: "Strawberry, Blueberry, Vanilla, French Vanilla, or Hazelnut.", price: "₱20", category: "Add-ons", imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400" },
  { id: 57, name: "Jam Scoop", description: "Blueberry or Strawberry jam.", price: "₱25", category: "Add-ons", imageUrl: "https://images.unsplash.com/photo-1589135398302-388cd65e12c1?auto=format&fit=crop&q=80&w=400" },
];

export const FAVORITE_ITEMS = FULL_MENU.filter(item => 
  [5, 14, 15, 30, 42, 48].includes(item.id)
);
