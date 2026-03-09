-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- Creates the menu table and seeds it with all menu items

CREATE TABLE IF NOT EXISTS menu (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  "imageUrl" TEXT,
  "imagePath" TEXT
);

-- Allow public read access to menu
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu is publicly readable" ON menu FOR SELECT USING (true);
CREATE POLICY "Only service role can modify menu" ON menu FOR ALL USING (auth.role() = 'service_role');

-- Seed menu data
INSERT INTO menu (name, description, price, category, "imageUrl") VALUES
-- Coffee
('Americano', 'Classic espresso with hot water.', '₱110', 'Coffee', 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=400'),
('Purificacion (Sweetened Americano)', 'Our signature sweetened black coffee.', '₱120', 'Coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400'),
('Vietnamese Coffee', 'Strong coffee with condensed milk.', '₱140', 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400'),
('Café Latte', 'Espresso with steamed milk.', '₱130', 'Coffee', 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400'),
('Spanish Latte', 'Espresso with condensed milk and steamed milk.', '₱145', 'Coffee', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400'),
('French Vanilla', 'Creamy vanilla flavored latte.', '₱150', 'Coffee', 'https://images.unsplash.com/photo-1595434066389-01303474030a?auto=format&fit=crop&q=80&w=400'),
('Hazelnut', 'Nutty hazelnut flavored latte.', '₱150', 'Coffee', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400'),
('Mocha', 'Espresso with chocolate and steamed milk.', '₱155', 'Coffee', 'https://images.unsplash.com/photo-1534706636972-c0114718c18d?auto=format&fit=crop&q=80&w=400'),
('White Chocolate Mocha', 'Sweet white chocolate and espresso.', '₱160', 'Coffee', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400'),
('Salted Caramel', 'Perfect balance of sweet and salty.', '₱160', 'Coffee', 'https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=400'),
('Caramel Mocha', 'Chocolate and caramel fusion.', '₱165', 'Coffee', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400'),
('Dark Mocha', 'Rich dark chocolate with espresso.', '₱165', 'Coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400'),
('Caramel Macchiato', 'Layered espresso and milk with caramel drizzle.', '₱160', 'Coffee', 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=400'),
('Dirty Matcha', 'Matcha latte with a shot of espresso.', '₱170', 'Coffee', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
-- Non-Coffee
('Tiger Sugar Milk', 'Brown sugar boba style milk.', '₱140', 'Non-Coffee', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=400'),
('Blueberry Latte', 'Creamy milk with blueberry syrup.', '₱150', 'Non-Coffee', 'https://images.unsplash.com/photo-1623065422902-30a2ad299dd4?auto=format&fit=crop&q=80&w=400'),
('Strawberry Latte', 'Fresh strawberry milk latte.', '₱150', 'Non-Coffee', 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&q=80&w=400'),
('Classic Chocolate', 'Rich and creamy hot chocolate.', '₱130', 'Non-Coffee', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400'),
('Red Velvet', 'Velvety smooth red velvet milk.', '₱150', 'Non-Coffee', 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=400'),
('Caramel Milk', 'Sweet caramel infused milk.', '₱130', 'Non-Coffee', 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400'),
('Triple Chocolate', 'The ultimate chocolate experience.', '₱160', 'Non-Coffee', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400'),
('Mixed Berries Latte', 'A blend of berries and milk.', '₱160', 'Non-Coffee', 'https://images.unsplash.com/photo-1553173154-5622b1af05ff?auto=format&fit=crop&q=80&w=400'),
('Oreo Latte', 'Cookies and cream delight.', '₱160', 'Non-Coffee', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400'),
('Taro Latte', 'Sweet and earthy taro milk.', '₱150', 'Non-Coffee', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=400'),
('Strawberry Oreo Latte', 'Strawberry and Oreo fusion.', '₱170', 'Non-Coffee', 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=400'),
('Dark Berry', 'Rich dark berry flavored milk.', '₱160', 'Non-Coffee', 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&q=80&w=400'),
-- Refreshers
('Blueberry Soda', 'Sparkling blueberry refresher.', '₱120', 'Refreshers', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400'),
('Strawberry Soda', 'Fizzy strawberry delight.', '₱120', 'Refreshers', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400'),
('Mixed Berries Soda', 'Refreshing berry mix with soda.', '₱130', 'Refreshers', 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&q=80&w=400'),
-- Sea Salt Series
('Sea Salt Latte', 'Classic latte with a salty cream top.', '₱160', 'Sea Salt Series', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Chocolate', 'Rich chocolate with sea salt cream.', '₱160', 'Sea Salt Series', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Spanish Latte', 'Sweet Spanish latte with salty cream.', '₱170', 'Sea Salt Series', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Spanish Oat', 'Spanish latte with oat milk and salty cream.', '₱190', 'Sea Salt Series', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Red Velvet', 'Red velvet milk with sea salt cream.', '₱170', 'Sea Salt Series', 'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Mocha', 'Chocolatey mocha with salty cream.', '₱175', 'Sea Salt Series', 'https://images.unsplash.com/photo-1534706636972-c0114718c18d?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Matcha Latte', 'Matcha latte topped with sea salt cream.', '₱180', 'Sea Salt Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Matcha Oat', 'Oat milk matcha with sea salt cream.', '₱200', 'Sea Salt Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Caramel Latte', 'Caramel latte with salty cream.', '₱180', 'Sea Salt Series', 'https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Caramel Mocha', 'Caramel mocha with salty cream.', '₱185', 'Sea Salt Series', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Triple Chocolate', 'Triple chocolate with salty cream.', '₱180', 'Sea Salt Series', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Taro Latte', 'Taro milk with sea salt cream.', '₱170', 'Sea Salt Series', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80&w=400'),
-- Matcha Series
('Matcha Latte', 'Pure Japanese matcha with milk.', '₱150', 'Matcha Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('Blueberry Matcha Latte', 'Matcha with a hint of blueberry.', '₱170', 'Matcha Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('Strawberry Matcha Latte', 'Matcha with fresh strawberry puree.', '₱170', 'Matcha Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('Salted Caramel Matcha', 'Matcha with salted caramel syrup.', '₱170', 'Matcha Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('White Chocolate Matcha', 'Matcha with sweet white chocolate.', '₱170', 'Matcha Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
('Matcha Oreo Latte', 'Matcha with crushed Oreo cookies.', '₱175', 'Matcha Series', 'https://images.unsplash.com/photo-1515823662273-ad95251cb884?auto=format&fit=crop&q=80&w=400'),
-- Barista Drink
('Iced Brown', 'Special barista blend with brown sugar.', '₱150', 'Barista Drink', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=400'),
('Espresso Cookie', 'Espresso shot with cookie flavors.', '₱160', 'Barista Drink', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400'),
('Oro Blanco', 'White chocolate and espresso blend.', '₱165', 'Barista Drink', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400'),
('Quad Espresso', 'Four shots of pure energy.', '₱180', 'Barista Drink', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'),
-- Add-ons
('Sub-Oat', 'Upgrade to Oat Milk.', '₱40', 'Add-ons', 'https://images.unsplash.com/photo-1550583724-125581cc255b?auto=format&fit=crop&q=80&w=400'),
('Espresso Shot', 'Extra shot of espresso.', '₱30', 'Add-ons', 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=400'),
('Sea Salt Cream', 'Extra salty cream topping.', '₱35', 'Add-ons', 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400'),
('Sauce pump', 'Chocolate, Caramel, Salted Caramel, or White Chocolate.', '₱20', 'Add-ons', 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400'),
('Syrup pump', 'Strawberry, Blueberry, Vanilla, French Vanilla, or Hazelnut.', '₱20', 'Add-ons', 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=400'),
('Jam Scoop', 'Blueberry or Strawberry jam.', '₱25', 'Add-ons', 'https://images.unsplash.com/photo-1589135398302-388cd65e12c1?auto=format&fit=crop&q=80&w=400');
