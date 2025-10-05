import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { TestimonialRepository } from "../repository/testimonial.repository";
import { uploadToCloudinary } from "../utils/cloudinary.util";


interface CreateTestimonialParams  {
    name: string;
    title: string;
    description: string;
    file: Express.Multer.File;
}

interface EditTestimonialParams {
    testimonialId: string;
    name?: string;
    title?: string;
    description?: string;
    file?: Express.Multer.File;
}


class TestimonialService {
    constructor(private readonly _testimonialRepository: TestimonialRepository) {}

    private async handleImageUpload(file: Express.Multer.File): Promise <{url: string; publicId: string}> {
        const uploadResult = await uploadToCloudinary(file);

        const urlParts = uploadResult.split('/');
        const fileWithExtension = urlParts[urlParts.length - 1];
        const publicId = `testimonials/${fileWithExtension.split('.')[0]}`;

        return {
            url: uploadResult,
            publicId: publicId
        };
    }

    async getAllTestimonials() {
        const allTestimonials = await this._testimonialRepository.getAllTestimonials();

        if(!allTestimonials || allTestimonials.length === 0) throw new NotFoundError('No testimonials found');

        return allTestimonials;
    }

    async getATestimonial(testimonialId: string) {
        const testimonial = await this._testimonialRepository.getTestimonialById(testimonialId);
        if(!testimonial) throw new NotFoundError('Testimonial not found');

        return testimonial;
    }

    async createTestimonial(params: CreateTestimonialParams) {
        const { name, title, description, file } = params;

        const profileImgUrl = await this.handleImageUpload(file);

        const testimonialData = {
        name,
        title,
        description,
        profileImgUrl
        };

        const creationResponse = await this._testimonialRepository.createTestimonial(testimonialData);

        if(!creationResponse) throw new InternalServerError('Testimonial creation failed');

        return creationResponse;
    }

    async editTestimonial(params: EditTestimonialParams) {
        const { testimonialId, name, title, description, file } = params;

        const existingTestimonial = await this._testimonialRepository.getTestimonialById(testimonialId);
        if(!existingTestimonial) throw new NotFoundError('Testimonial not found');

        let profileImgUrl = existingTestimonial.profileImgUrl;
        if(file) {
        profileImgUrl = await this.handleImageUpload(file);
        }

        const updateData: any = { profileImgUrl };
        if(name) updateData.name = name;
        if(title) updateData.title = title;
        if(description) updateData.description = description;

        const updatedTestimonial = await this._testimonialRepository.updateTestimonial(testimonialId, updateData);

        if(!updatedTestimonial) throw new InternalServerError('Testimonial update failed!');

        return updatedTestimonial;
    }

    async deleteATestimonial(params: { testimonialId: string; }) {
        const { testimonialId } = params;
        if (!testimonialId) throw new BadRequestError('Testimonial ID not received!');
        const deleteResponse = await this._testimonialRepository.deleteTestimonial(testimonialId);
        if (!deleteResponse) throw new InternalServerError('Unable to delete the testimonial!');
        return deleteResponse;
    }
}

export default new TestimonialService(new TestimonialRepository());