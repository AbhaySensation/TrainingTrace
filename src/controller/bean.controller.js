const Beans = require("../models/beans.model");

const getAllBeans = async (req, reply) => {
  try {
    const beans = await Beans.find();
    return reply.status(200).send(beans);
  } catch (err) {
    return reply.status(500).send({ error: `Server Error: ${err.message}` });
  }
};

const addBean = async (req, reply) => {
  const {
    name,
    description,
    roasted,
    ingredients,
    special_ingredient,
    prices,
    average_rating,
    ratings_count,
    favourite,
    type,
  } = req.body;

  if (
    !name ||
    !description ||
    !roasted ||
    !ingredients ||
    !special_ingredient ||
    !prices ||
    !average_rating ||
    !ratings_count ||
    !type
  ) {
    return reply.send("All data fields are required");
  }

  try {
    const added = await Beans.create({
      name,
      description,
      roasted,
      ingredients,
      special_ingredient,
      prices,
      average_rating,
      ratings_count,
      favourite,
      type,
    });

    if (!added) {
      return reply.send("Something went wrong");
    }

    return reply.status(200).send("Bean added successfully");
  } catch (err) {
    return reply.status(500).send({ error: `Server Error: ${err.message}` });
  }
};

const deleteBean = async (req, reply) => {
  const { id } = req.body;

  if (!id) {
    return reply.send("ID not provided");
  }

  try {
    const deleted = await Beans.findByIdAndDelete(id);
    if (!deleted) {
      return reply.send("Bean not found or already deleted");
    }

    return reply.status(200).send("Bean deleted successfully");
  } catch (err) {
    return reply.status(500).send({ error: `Server Error: ${err.message}` });
  }
};

module.exports = {
  getAllBeans,
  addBean,
  deleteBean,
};
