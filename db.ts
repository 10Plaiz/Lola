import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { FULL_MENU } from './data/menuData';

let db: any;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price TEXT NOT NULL,
        category TEXT NOT NULL,
        imageUrl TEXT,
        imagePath TEXT
      )
    `);

    const count = await db.get('SELECT COUNT(*) as count FROM menu');
    if (count.count === 0) {
      for (const item of FULL_MENU) {
        await db.run(
          'INSERT INTO menu (name, description, price, category, imageUrl) VALUES (?, ?, ?, ?, ?)',
          [item.name, item.description, item.price, item.category, item.imageUrl]
        );
      }
    }
  }
  return db;
}
