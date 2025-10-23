import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { 
        type: String, 
        required: true 
    },
    publicId: { 
        type: String, 
        required: false 
    },
  },
  { _id: false }
);

const industrySchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    image: { 
        type: imageSchema, 
        required: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
  },
  { timestamps: true }
);

export interface IIndustry extends mongoose.Document {
  _id: string;
  name: string;
  image: { url: string; publicId?: string };
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default mongoose.model<IIndustry>("Industry", industrySchema);