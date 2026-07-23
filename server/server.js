const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Map isVeg integer (0/1) back to boolean (false/true)
    const products = rows.map(product => ({
      ...product,
      isVeg: product.isVeg === 1,
      originalPrice: product.originalPrice === null ? undefined : product.originalPrice
    }));
    res.json(products);
  });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { items, subtotal, deliveryFee, discount, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items.' });
  }

  const trackingNum = Math.floor(100000 + Math.random() * 900000);
  const trackingCode = `FM-${trackingNum}`;
  const itemsJSON = JSON.stringify(items);

  const query = `
    INSERT INTO orders (trackingCode, items, subtotal, deliveryFee, discount, total)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [trackingCode, itemsJSON, subtotal, deliveryFee, discount, total],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Order created successfully.',
        orderId: this.lastID,
        trackingCode,
        total
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`FreshMart server is running on http://localhost:${PORT}`);
});
