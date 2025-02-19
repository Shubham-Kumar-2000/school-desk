const Testimonial = require('../models/testimonials');

exports.list = async (req, res, next) => {
    try {
        let testimonials = await Testimonial.find({}).sort({
            rating: -1,
            updatedAt: -1
        });
        if (testimonials.length > 3) {
            testimonials = testimonials.slice(
                0,
                testimonials.length - (testimonials.length % 3)
            );
        }
        res.status(200).json({ testimonials });
    } catch (e) {
        next(e);
    }
};
