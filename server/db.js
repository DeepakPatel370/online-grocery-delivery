const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const PRODUCTS_DATA = require('../js/products.js');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      categoryName TEXT NOT NULL,
      price REAL NOT NULL,
      originalPrice REAL,
      isVeg INTEGER NOT NULL,
      brand TEXT,
      rating REAL,
      unit TEXT,
      image TEXT,
      description TEXT
    )
  `);

  // Create orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trackingCode TEXT UNIQUE NOT NULL,
      items TEXT NOT NULL, -- JSON string of items [{ id, quantity }]
      subtotal REAL NOT NULL,
      deliveryFee REAL NOT NULL,
      discount REAL NOT NULL,
      total REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if products table is empty and seed it
  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
      console.error('Failed to query products count:', err.message);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding products database table...');
      const stmt = db.prepare(`
        INSERT INTO products (id, name, category, categoryName, price, originalPrice, isVeg, brand, rating, unit, image, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      PRODUCTS_DATA.forEach(product => {
        stmt.run(
          product.id,
          product.name,
          product.category,
          product.categoryName,
          product.price,
          product.originalPrice || null,
          product.isVeg ? 1 : 0,
          product.brand || null,
          product.rating || null,
          product.unit || null,
          product.image || null,
          product.description || null
        );
      });
      stmt.finalize();
      console.log('Seeding completed successfully.');
    } else {
      console.log('Database already has product data. Skipping seed.');
    }
  });
});

module.exports = db;
