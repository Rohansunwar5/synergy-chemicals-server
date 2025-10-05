import testimonialModel from "../models/testimonial.model";

export interface ICreateTestimonialParams { 
    name: string;
    title: string;
    description: string;
    profileImgUrl: {
        url: string;
        publicId: string;
    };
}

export class TestimonialRepository {
    private _model = testimonialModel;

    async getAllTestimonials() {
        return this._model.find();
    }

    async getTestimonialById(testimonialId: string) {
        return this._model.findById(testimonialId);
    }

    async createTestimonial(testimonialData: ICreateTestimonialParams) {
        return this._model.create(testimonialData);
    }

    async updateTestimonial(testimonialId: string, updateData: Partial<ICreateTestimonialParams>) {
        return this._model.findByIdAndUpdate(
            testimonialId,
            updateData,
            { new: true }
        );
    }

    async deleteTestimonial(testimonialId: string) {
        return this._model.deleteOne({ _id: testimonialId });
    }

    async getTestimonialsByTitle(title: string) {
        return this._model.find({ title: { $regex: title, $options: 'i' } });
    }
}