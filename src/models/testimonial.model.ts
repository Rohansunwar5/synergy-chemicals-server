import mongoose from 'mongoose';

export interface IProfileImgUrl {
    url: string;
    publicId: string;
}

export interface ITestimonial {
    _id: string;
    name: string;
    title: string;
    description: string;
    profileImgUrl: IProfileImgUrl;
    createdAt?: Date;
    updatedAt?: Date;
}

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        profileImgUrl: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
