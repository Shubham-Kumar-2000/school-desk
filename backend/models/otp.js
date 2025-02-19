const mongoose = require('mongoose');
const md5 = require('md5');
const otpGenerator = require('otp-generator');
const Schema = mongoose.Schema;

const otpSchema = new Schema(
    {
        identifier: { type: String },
        otp: { type: String },
        validTill: { type: Date }
    },
    { timestamps: true }
);
otpSchema.index({ identifier: 1, timeDelta: 1 });
otpSchema.statics.validateOtp = async (identifier, otp) => {
    const otpDoc = await Otp.findOne({
        identifier: md5(identifier + '-otp'),
        validTill: {
            $gt: new Date()
        },
        otp
    });
    if (otpDoc) {
        await Otp.deleteOne({ _id: otpDoc._id });
    }
    return otpDoc;
};

otpSchema.statics.getResendOtp = (identifier) => {
    return Otp.findOne({
        identifier: md5(identifier + '-otp'),
        validTill: {
            $gt: new Date()
        }
    });
};
otpSchema.statics.createOtp = async (identifier) => {
    const hashedIdentifier = md5(identifier + '-otp');
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    await Otp.deleteMany({ identifier: hashedIdentifier });
    await Otp.create({
        identifier: hashedIdentifier,
        otp,
        validTill: Date.now() + 1000 * 60 * 5
    });
    return otp;
};
const Otp = mongoose.model('otp', otpSchema);
module.exports = Otp;
