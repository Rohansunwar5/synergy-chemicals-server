import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    otpVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }
)

export interface ILead extends mongoose.Document {
    _id: string;
    name: string;
    phone: string;
    otpVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export default mongoose.model<ILead>("Lead", leadSchema);