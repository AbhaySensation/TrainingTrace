const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  meal: { 
    type: String, 
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'], 
    required: true 
  },
  totalPrice: { type: Number, required: true },
  images: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
