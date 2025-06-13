const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');

// ✅ Get full nested structure (Optimized)
const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.find().lean();

    const subcategories = await Subcategory.find().lean();
    const products = await Product.find().lean();

    const subMap = {};
    for (const sub of subcategories) {
      sub.products = [];
      subMap[sub._id.toString()] = sub;
    }

    for (const product of products) {
      const sid = product.subcategory?.toString();
      if (subMap[sid]) subMap[sid].products.push(product);
    }

    const catMap = {};
    for (const cat of categories) {
      cat.subcategories = [];
      catMap[cat._id.toString()] = cat;
    }

    for (const sub of subcategories) {
      const cid = sub.category?.toString();
      if (catMap[cid]) catMap[cid].subcategories.push(sub);
    }

    reply.send(Object.values(catMap));
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
  createProduct
};
