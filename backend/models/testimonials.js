const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testimonialSchema = new Schema(
    {
        title: { type: String, required: true },
        rating: { type: Number, default: 5, max: 5 },
        description: { type: String, required: true },
        userName: { type: String, required: true }
    },
    { timestamps: true }
);

const Testimonial = mongoose.model('testimonials', testimonialSchema);
module.exports = Testimonial;
