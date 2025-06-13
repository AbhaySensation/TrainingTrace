const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  imageUrl: String,
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
