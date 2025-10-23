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
    sessionId: {
        type: String,
        default: null,
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
    sessionId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export default mongoose.model<ILead>("Lead", leadSchema);