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

const applicationSchema = new mongoose.Schema(
  {
    point: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
  },
  { _id: false }
);

const bulletPointSchema = new mongoose.Schema(
  {
    point: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
  },
  { _id: false }
);

const baseProductSchema = new mongoose.Schema(
  {
    productCode: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    mainImage: { 
        type: imageSchema, 
        required: true 
    },
    subheading: { 
        type: String, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    applications: { 
        type: [applicationSchema], 
        default: [] 
    },
    bulletPoints: { 
        type: [bulletPointSchema], 
        default: [] 
    },
  },
  { timestamps: true }
);

export interface IBaseProduct extends mongoose.Document {
  _id: string;
  productCode: string;
  name: string;
  mainImage: { url: string; publicId?: string };
  subheading?: string;
  description?: string;
  applications: Array<{ point: string; description?: string }>;
  bulletPoints: Array<{ point: string; description?: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export default mongoose.model<IBaseProduct>("BaseProduct", baseProductSchema);