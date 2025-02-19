const mongoose = require('mongoose');
const md5 = require('md5');
const Schema = mongoose.Schema;

const otpUsageSchema = new Schema(
    {
        identifier: { type: String },
        used: { type: Number, default: 0 },
        timeDelta: { type: Number }
    },
    { timestamps: true }
);
otpUsageSchema.index({ identifier: 1, timeDelta: 1 });

otpUsageSchema.statics.getUsage = (identifier) => {
    const now = Date.now();
    return OtpUsage.findOneAndUpdate(
        {
            identifier: md5(identifier + '-salt'),
            timeDelta: now - (now % (1000 * 60 * 5))
        },
        {
            $inc: {
                used: 1
            }
        },
        {
            new: true,
            upsert: true
        }
    );
};

const OtpUsage = mongoose.model('otp-usage', otpUsageSchema);
module.exports = OtpUsage;
