// src/routes/productRoutes.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('../utils/asyncHandler');
const NotFoundError = require('../errors/NotFoundError');
const validateProduct = require('../middleware/validateProduct');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// In-memory product store (replace with database in production)
let products = [];



// GET /api/products - List all products with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10, search } = req.query;
  let filteredProducts = [...products];
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  res.json({
    data: paginatedProducts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalItems: filteredProducts.length,
      itemsPerPage: parseInt(limit)
    }
  });
}));

// GET /api/products/:id - Get a specific product
router.get('/:id', asyncHandler(async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found');
  }
  res.json(product);
}));

// POST /api/products - Create a new product
router.post('/', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const product = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  products.push(product);
  res.status(201).json(product);
}));

// PUT /api/products/:id - Update a product
router.put('/:id', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    throw new NotFoundError('Product not found');
  }
  products[productIndex] = {
    ...products[productIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  res.json(products[productIndex]);
}));

// DELETE /api/products/:id - Delete a product
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    throw new NotFoundError('Product not found');
  }
  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json(deletedProduct);
}));

// GET /api/products/stats - Get product statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});
  res.json({
    totalProducts: products.length,
    categories: stats
  });
}));

module.exports = router;