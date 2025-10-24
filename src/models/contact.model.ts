import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, { timestamps: true }
)

contactSchema.index({ email: 1});

export interface IContact extends mongoose.Schema {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

export default mongoose.model<IContact>("Contact", contactSchema);