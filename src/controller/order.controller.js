const Order = require("../models/order.modal");
const Product = require("../models/product.model");
const imagekit = require("../plugins/Imagekit");

// Create new order
const createOrder = async (req, reply) => {
  try {
    const parts = req.parts(); // async iterable

    let fields = {};
    let files = [];

    for await (const part of parts) {
      if (part.file) {
        const chunks = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        files.push({
          buffer,
          filename: part.filename,
        });
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    // Destructure form fields
    const { user, products, meal } = fields;

    if (!products || !JSON.parse(products).length) {
      return reply.code(400).send({ error: "Products are required" });
    }

    const productIds = JSON.parse(products);

    const productDocs = await Product.find({ _id: { $in: productIds } });
    if (productDocs.length !== productIds.length) {
      return reply.code(400).send({ error: "One or more products not found" });
    }

    const totalPrice = productDocs.reduce((sum, p) => sum + p.price, 0);

    // Upload images to ImageKit
    let imageUrls = [];
    if (files.length > 0) {
      const uploaded = await Promise.all(
        files.map((file) =>
          imagekit.upload({
            file: file.buffer.toString("base64"),
            fileName: file.filename,
          })
        )
      );
      imageUrls = uploaded.map((img) => img.url);
    }

    const order = new Order({
      user,
      products: productIds,
      meal,
      totalPrice,
      images: imageUrls,
      status: "pending",
    });

    await order.save();
    reply.code(201).send(order);
  } catch (err) {
    console.error("Order creation error:", err);
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};

// Get all orders
const getAllOrders = async (req, reply) => {
  try {
    const orders = await Order.find()
      .populate("products")
      .populate("user", "fullname username email");

    reply.send(orders);
  } catch (err) {
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};

// Get orders for a specific user
const getUserOrders = async (req, reply) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("products")
      .populate("user", "fullname username email");

    reply.send(orders);
  } catch (err) {
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};
const searchOrder = async (req, reply) => {
  try {
    const { userId } = req.params;
    const {q}=req.query

    const orders = await Order.find({ user: userId })
      .populate("products")
      .populate("user", "fullname username email");
         const allProducts = orders.flatMap(order => order.products);

    const regex = new RegExp(q, 'i');
    const filteredProducts = allProducts.filter(product =>
      regex.test(product.name) || regex.test(product.description)
    );
    reply.send(filteredProducts);
  } catch (err) {
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};
const deleteUserOrders = async (req, reply) => {
  try {
    const { orderId } = req.params;

    // Validate orderId presence
    if (!orderId) {
      return reply.code(400).send({ error: "Order ID is required" });
    }

    // Attempt to delete order
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return reply.code(404).send({ error: "Order not found" });
    }

    reply
      .code(200)
      .send({ message: "Order deleted successfully", order: deletedOrder });
  } catch (err) {
    console.error("Delete order error:", err);
    reply.code(500).send({ error: "Server error", details: err.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  deleteUserOrders,
  searchOrder
};
