const mongoose = require("mongoose");

const BeansDataSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    roasted: {
        type: String,
        required: true,
    },

    
    imagelink_square: {
        data: Buffer,
        contentType: String,
    },
    imagelink_portrait: {
        data: Buffer,
        contentType: String,
    },
imageUrl:String,


    ingredients: {
        type: String,
        required: true,
    },
    special_ingredient: {
        type: String,
        required: true,
    },
    prices: [
        {
            size: {
                type: String,

                required: true,
            },
            price: {
                type: String,
                required: true,
            },
            currency: {
                type: String,
                minlength: 1,
                maxlength: 1,
                required: true,
            },
        },
    ],
    average_rating: String,
    ratings_count: String,
    favourite: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Beans", BeansDataSchema);
