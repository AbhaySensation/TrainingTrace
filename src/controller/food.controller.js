const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');

// ✅ Get full nested structure (Optimized)
const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find().lean();
    reply.send(categories);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};
const getSubcategory = async (req, reply) => {
  try {
    const categoryId = req.query.categoryId;

    if (!categoryId) {
      return reply.code(400).send({ error: "Missing categoryId query parameter" });
    }

    const subcategories = await Subcategory.find({ category: categoryId }).lean();

    reply.send(subcategories);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};
const getProduct = async (req, reply) => {
  try {
    const subcategoryId = req.query.Subcategory;

    if (!subcategoryId) {
      return reply.code(400).send({ error: "Missing subcategory query parameter" });
    }
    const products = await Product.find({ subcategory: subcategoryId },{ name: 1, description: 1, price: 1 }).lean();

    reply.send(products);
  } catch (err) {
    reply.code(500).send({ error: err.message });
  }
};

// ✅ Create category
const createCategory = async (req, reply) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    reply.code(201).send(cat);
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
};

// ✅ Create subcategory
const createSubcategory = async (req, reply) => {
  try {
    const sub = new Subcategory(req.body);
    await sub.save();
    reply.code(201).send(sub);
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
};

// ✅ Create product
const createProduct = async (req, reply) => {
  try {
    const prod = new Product(req.body);
    await prod.save();
    reply.code(201).send(prod);
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  createSubcategory,
  createProduct,
  getSubcategory,
  getProduct
};
