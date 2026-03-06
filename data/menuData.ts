import { MenuItem } from '../types';

export const FULL_MENU: MenuItem[] = [
  // Coffee
  { id: 1, name: "Americano", description: "Classic espresso with hot water.", price: "₱110", category: "Coffee", imageUrl: "/media/americano.jpeg" },
  { id: 2, name: "Purificacion (Sweetened Americano)", description: "Our signature sweetened black coffee.", price: "₱120", category: "Coffee", imageUrl: "/media/sweetenedblackcoffee.jpeg" },
  { id: 3, name: "Vietnamese Coffee", description: "Strong coffee with condensed milk.", price: "₱140", category: "Coffee", imageUrl: "/media/vietnamesecoffee.jpg" },
  { id: 4, name: "Café Latte", description: "Espresso with steamed milk.", price: "₱130", category: "Coffee", imageUrl: "/media/cafelatte.jpg" },
  { id: 5, name: "Spanish Latte", description: "Espresso with condensed milk and steamed milk.", price: "₱145", category: "Coffee", imageUrl: "/media/spanishlatte.jpg" },
  { id: 6, name: "French Vanilla", description: "Creamy vanilla flavored latte.", price: "₱150", category: "Coffee", imageUrl: "/media/frenchvanilla.jpg" },
  { id: 7, name: "Hazelnut", description: "Nutty hazelnut flavored latte.", price: "₱150", category: "Coffee", imageUrl: "/media/hazelnut.jpg" },
  { id: 8, name: "Mocha", description: "Espresso with chocolate and steamed milk.", price: "₱155", category: "Coffee", imageUrl: "/media/mochacoffee.jpg" },
  { id: 9, name: "White Chocolate Mocha", description: "Sweet white chocolate and espresso.", price: "₱160", category: "Coffee", imageUrl: "/media/whitechocolatemocha.jpg" },
  { id: 10, name: "Salted Caramel", description: "Perfect balance of sweet and salty.", price: "₱160", category: "Coffee", imageUrl: "/media/saltedcaramelcoffee.jpg" },
  { id: 11, name: "Caramel Mocha", description: "Chocolate and caramel fusion.", price: "₱165", category: "Coffee", imageUrl: "/media/caramelmocha.jpg" },
  { id: 12, name: "Dark Mocha", description: "Rich dark chocolate with espresso.", price: "₱165", category: "Coffee", imageUrl: "/media/darkmochacoffee.jpg" },
  { id: 13, name: "Caramel Macchiato", description: "Layered espresso and milk with caramel drizzle.", price: "₱160", category: "Coffee", imageUrl: "/media/caramelmacchiato.jpg" },
  { id: 14, name: "Dirty Matcha", description: "Matcha latte with a shot of espresso.", price: "₱170", category: "Coffee", imageUrl: "/media/dirtymatchacoffee.jpg" },

  // Non-Coffee
  { id: 15, name: "Tiger Sugar Milk", description: "Brown sugar boba style milk.", price: "₱140", category: "Non-Coffee", imageUrl: "/media/tigersugarmilkboba.jpg" },
  { id: 16, name: "Blueberry Latte", description: "Creamy milk with blueberry syrup.", price: "₱150", category: "Non-Coffee", imageUrl: "/media/blueberrylatte.jpg" },
  { id: 17, name: "Strawberry Latte", description: "Fresh strawberry milk latte.", price: "₱150", category: "Non-Coffee", imageUrl: "/media/strawberrylatte.jpg" },
  { id: 18, name: "Classic Chocolate", description: "Rich and creamy hot chocolate.", price: "₱130", category: "Non-Coffee", imageUrl: "/media/classicchocolate.jpg" },
  { id: 19, name: "Red Velvet", description: "Velvety smooth red velvet milk.", price: "₱150", category: "Non-Coffee", imageUrl: "/media/redvelvet.jpg" },
  { id: 20, name: "Caramel Milk", description: "Sweet caramel infused milk.", price: "₱130", category: "Non-Coffee", imageUrl: "/media/caramelmilk.jpg" },
  { id: 21, name: "Triple Chocolate", description: "The ultimate chocolate experience.", price: "₱160", category: "Non-Coffee", imageUrl: "/media/triplechocolate.jpg" },
  { id: 22, name: "Mixed Berries Latte", description: "A blend of berries and milk.", price: "₱160", category: "Non-Coffee", imageUrl: "/media/mixedberrieslatte.jpg" },
  { id: 23, name: "Oreo Latte", description: "Cookies and cream delight.", price: "₱160", category: "Non-Coffee", imageUrl: "/media/oreolatte.jpg" },
  { id: 24, name: "Taro Latte", description: "Sweet and earthy taro milk.", price: "₱150", category: "Non-Coffee", imageUrl: "/media/tarolatte.jpg" },
  { id: 25, name: "Strawberry Oreo Latte", description: "Strawberry and Oreo fusion.", price: "₱170", category: "Non-Coffee", imageUrl: "/media/strawberryoreolatte.jpg" },
  { id: 26, name: "Dark Berry", description: "Rich dark berry flavored milk.", price: "₱160", category: "Non-Coffee", imageUrl: "/media/darkberry.jpg" },

  // Refreshers
  { id: 27, name: "Blueberry Soda", description: "Sparkling blueberry refresher.", price: "₱120", category: "Refreshers", imageUrl: "/media/blueberrysodadrink.jpg" },
  { id: 28, name: "Strawberry Soda", description: "Fizzy strawberry delight.", price: "₱120", category: "Refreshers", imageUrl: "/media/strawberrysoda.jpg" },
  { id: 29, name: "Mixed Berries Soda", description: "Refreshing berry mix with soda.", price: "₱130", category: "Refreshers", imageUrl: "/media/mixedberries.jpg" },

  // Sea Salt Series
  { id: 30, name: "Sea Salt Latte", description: "Classic latte with a salty cream top.", price: "₱160", category: "Sea Salt Series", imageUrl: "/media/seasaltlatte.jpg" },
  { id: 31, name: "Sea Salt Chocolate", description: "Rich chocolate with sea salt cream.", price: "₱160", category: "Sea Salt Series", imageUrl: "/media/seasaltchocolate.jpg" },
  { id: 32, name: "Sea Salt Spanish Latte", description: "Sweet Spanish latte with salty cream.", price: "₱170", category: "Sea Salt Series", imageUrl: "/media/seasaltspanishlatte.jpg" },
  { id: 33, name: "Sea Salt Spanish Oat", description: "Spanish latte with oat milk and salty cream.", price: "₱190", category: "Sea Salt Series", imageUrl: "/media/seasaltspanishoat.jpg" },
  { id: 34, name: "Sea Salt Red Velvet", description: "Red velvet milk with sea salt cream.", price: "₱170", category: "Sea Salt Series", imageUrl: "/media/seasaltredvelvet.jpg" },
  { id: 35, name: "Sea Salt Mocha", description: "Chocolatey mocha with salty cream.", price: "₱175", category: "Sea Salt Series", imageUrl: "/media/seasaltmocha.jpg" },
  { id: 36, name: "Sea Salt Matcha Latte", description: "Matcha latte topped with sea salt cream.", price: "₱180", category: "Sea Salt Series", imageUrl: "/media/seasaltmatchalatte.jpg" },
  { id: 37, name: "Sea Salt Matcha Oat", description: "Oat milk matcha with sea salt cream.", price: "₱200", category: "Sea Salt Series", imageUrl: "/media/seasaltmatchaoat.jpg" },
  { id: 38, name: "Sea Salt Caramel Latte", description: "Caramel latte with salty cream.", price: "₱180", category: "Sea Salt Series", imageUrl: "/media/seasaltcaramellatte.jpg" },
  { id: 39, name: "Sea Salt Caramel Mocha", description: "Caramel mocha with salty cream.", price: "₱185", category: "Sea Salt Series", imageUrl: "/media/seasaltcaramelmocha.jpg" },
  { id: 40, name: "Sea Salt Triple Chocolate", description: "Triple chocolate with salty cream.", price: "₱180", category: "Sea Salt Series", imageUrl: "/media/seasalttriplechocolate.jpg" },
  { id: 41, name: "Sea Salt Taro Latte", description: "Taro milk with sea salt cream.", price: "₱170", category: "Sea Salt Series", imageUrl: "/media/seasalttarolatte.jpg" },

  // Matcha Series
  { id: 42, name: "Matcha Latte", description: "Pure Japanese matcha with milk.", price: "₱150", category: "Matcha Series", imageUrl: "/media/matchalatte.jpg" },
  { id: 43, name: "Blueberry Matcha Latte", description: "Matcha with a hint of blueberry.", price: "₱170", category: "Matcha Series", imageUrl: "/media/blueberrymatchalatte.jpg" },
  { id: 44, name: "Strawberry Matcha Latte", description: "Matcha with fresh strawberry puree.", price: "₱170", category: "Matcha Series", imageUrl: "/media/strawberrymatchalatte.jpg" },
  { id: 45, name: "Salted Caramel Matcha", description: "Matcha with salted caramel syrup.", price: "₱170", category: "Matcha Series", imageUrl: "/media/saltedcaramelmatcha.jpg" },
  { id: 46, name: "White Chocolate Matcha", description: "Matcha with sweet white chocolate.", price: "₱170", category: "Matcha Series", imageUrl: "/media/whitechocolatematcha.jpg" },
  { id: 47, name: "Matcha Oreo Latte", description: "Matcha with crushed Oreo cookies.", price: "₱175", category: "Matcha Series", imageUrl: "/media/matchaoreolatte.jpg" },

  // Barista Drink
  { id: 48, name: "Iced Brown", description: "Special barista blend with brown sugar.", price: "₱150", category: "Barista Drink", imageUrl: "/media/icedbrown.jpg" },
  { id: 49, name: "Espresso Cookie", description: "Espresso shot with cookie flavors.", price: "₱160", category: "Barista Drink", imageUrl: "/media/espressocookie.jpg" },
  { id: 50, name: "Oro Blanco", description: "White chocolate and espresso blend.", price: "₱165", category: "Barista Drink", imageUrl: "/media/oroblanco.jpg" },
  { id: 51, name: "Quad Espresso", description: "Four shots of pure energy.", price: "₱180", category: "Barista Drink", imageUrl: "/media/quadespresso.jpg" },

  // Add-ons
  { id: 52, name: "Sub-Oat", description: "Upgrade to Oat Milk.", price: "₱40", category: "Add-ons", imageUrl: "/media/suboat.jpg" },
  { id: 53, name: "Espresso Shot", description: "Extra shot of espresso.", price: "₱30", category: "Add-ons", imageUrl: "/media/espressoshot.jpg" },
  { id: 54, name: "Sea Salt Cream", description: "Extra salty cream topping.", price: "₱35", category: "Add-ons", imageUrl: "/media/seasaltcream.jpg" },
  { id: 55, name: "Sauce pump", description: "Chocolate, Caramel, Salted Caramel, or White Chocolate.", price: "₱20", category: "Add-ons", imageUrl: "/media/saucepump.jpg" },
  { id: 56, name: "Syrup pump", description: "Strawberry, Blueberry, Vanilla, French Vanilla, or Hazelnut.", price: "₱20", category: "Add-ons", imageUrl: "/media/syruppump.jpg" },
  { id: 57, name: "Jam Scoop", description: "Blueberry or Strawberry jam.", price: "₱25", category: "Add-ons", imageUrl: "/media/jamscoop.jpg" },
];

export const FAVORITE_ITEMS = FULL_MENU.filter(item => 
  [5, 14, 15, 30, 42, 48].includes(item.id)
);
