const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');

const seed = async () => {
  await mongoose.connect("mongodb+srv://TrainingTrace:2r8bIl867n0J6lOU@trainingtrace.w3mkfb0.mongodb.net/");

  const categoryStructure = {
    Beverages: {
      description: "Drinks",
      subcategories: ["Hot Drinks", "Cold Drinks"]
    },
    Snacks: {
      description: "Crunchy and tasty",
      subcategories: ["Chips", "Nuts"]
    },
    Bakery: {
      description: "Fresh baked goods",
      subcategories: ["Bread", "Pastries"]
    },
    Dairy: {
      description: "Milk and cheese",
      subcategories: ["Milk", "Cheese"]
    },
    Frozen: {
      description: "Frozen treats and meals",
      subcategories: ["Ice Cream", "Frozen Meals"]
    }
  };

  // Create categories and subcategories
  const subcategoryMap = {};

  for (const [categoryName, { description, subcategories }] of Object.entries(categoryStructure)) {
    const category = await Category.findOneAndUpdate(
      { name: categoryName },
      { $setOnInsert: { description } },
      { upsert: true, new: true }
    );

    for (const subName of subcategories) {
      const sub = await Subcategory.findOneAndUpdate(
        { name: subName, category: category._id },
        { $setOnInsert: { name: subName, category: category._id } },
        { upsert: true, new: true }
      );
      subcategoryMap[subName] = sub._id;
    }
  }

  // Generate random products
  const priceRanges = {
    "Hot Drinks": [2.0, 5.0],
    "Cold Drinks": [1.5, 4.5],
    "Chips": [1.0, 3.0],
    "Nuts": [2.0, 5.0],
    "Bread": [2.5, 6.0],
    "Pastries": [2.0, 4.5],
    "Milk": [1.0, 3.0],
    "Cheese": [2.5, 6.0],
    "Ice Cream": [2.0, 5.0],
    "Frozen Meals": [3.0, 7.0]
  };

  const productNames = {
    "Hot Drinks": ["Espresso", "Cappuccino", "Hot Chocolate", "Matcha Latte", "Turmeric Latte"],
    "Cold Drinks": ["Iced Coffee", "Smoothie", "Cola", "Sparkling Water", "Fruit Punch"],
    "Chips": ["Salted Chips", "Spicy Nachos", "Cheese Balls", "Tortilla Chips"],
    "Nuts": ["Pistachios", "Mixed Nuts", "Peanuts", "Honey Roasted Cashews"],
    "Bread": ["Whole Wheat Bread", "Rye Bread", "Multigrain Loaf", "Focaccia"],
    "Pastries": ["Pain au Chocolat", "Strudel", "Cinnamon Roll", "Eclair"],
    "Milk": ["Whole Milk", "Skim Milk", "Almond Milk", "Soy Milk"],
    "Cheese": ["Cheddar Cheese", "Mozzarella", "Feta Cheese", "Gouda"],
    "Ice Cream": ["Vanilla Ice Cream", "Chocolate Ice Cream", "Strawberry Ice Cream", "Mango Sorbet"],
    "Frozen Meals": ["Veg Lasagna", "Chicken Biryani", "Paneer Tikka", "Beef Stew"]
  };

  const getRandomPrice = (range) =>
    Math.round((Math.random() * (range[1] - range[0]) + range[0]) * 100) / 100;

  let productCount = 0;
  const totalProducts = 500;

  while (productCount < totalProducts) {
    for (const [subcat, names] of Object.entries(productNames)) {
      for (const baseName of names) {
        if (productCount >= totalProducts) break;
        const name = `${baseName} ${Math.floor(Math.random() * 200)}`;
        const price = getRandomPrice(priceRanges[subcat]);
        const description = `${baseName} - fresh and delicious`;

        const exists = await Product.findOne({ name, subcategory: subcategoryMap[subcat] });
        if (!exists) {
          await new Product({
            name,
            price,
            description,
            subcategory: subcategoryMap[subcat],
          }).save();
          productCount++;
        }
      }
    }
  }

  console.log(`✅ Seeded ${productCount} products with categories and subcategories.`);
  process.exit();
};

seed();
