import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { IndustryRepository } from "../repository/industry.repository";
import { uploadToCloudinary } from "../utils/cloudinary.util";

interface CreateIndustryParamsFromController {
  name: string;
  image?: Express.Multer.File;
  description?: string;
}

interface CreateIndustryParamsForRepo {
  name: string;
  image: { url: string; publicId?: string };
  description?: string;
}

interface EditIndustryParams {
  industryId: string;
  name?: string;
  image?: Express.Multer.File;
  description?: string;
}

class IndustryService {
  constructor(private readonly _industryRepository: IndustryRepository) {}

  async getAllIndustries() {
    const industries = await this._industryRepository.getAllIndustries();
    if (!industries || industries.length === 0) throw new NotFoundError("No industries found");
    return industries;
  }

  async getIndustryById(industryId: string) {
    const industry = await this._industryRepository.getIndustryById(industryId);
    if (!industry) throw new NotFoundError("Industry not found");
    return industry;
  }

  async createIndustry(params: CreateIndustryParamsFromController) {
    const { name, image, description } = params;

    if (!image) {
      throw new BadRequestError("Image file is required");
    }

    const uploadResult = await uploadToCloudinary(image);
    const imageData = { url: uploadResult, publicId: undefined };

    const creationParams: CreateIndustryParamsForRepo = {
      name,
      image: imageData,
      description,
    };

    const creation = await this._industryRepository.createIndustry(creationParams);
    if (!creation) throw new InternalServerError("Failed to create industry");

    return creation;
  }

  async editIndustry(params: EditIndustryParams & { image?: Express.Multer.File }) {
    const { industryId, image, ...updateData } = params;

    const existing = await this._industryRepository.getIndustryById(industryId);
    if (!existing) throw new NotFoundError("Industry not found");

    let imageData = existing.image;

    if (image) {
      const uploadResult = await uploadToCloudinary(image);
      imageData = { url: uploadResult, publicId: undefined };
    }

    const updatedData = {
      ...updateData,
      image: imageData,
    };

    const updated = await this._industryRepository.updateIndustry(industryId, updatedData);
    if (!updated) throw new InternalServerError("Failed to update industry");

    return updated;
  }

  async deleteIndustry(industryId: string) {
    if (!industryId) throw new BadRequestError("Industry ID not provided");

    const deleted = await this._industryRepository.deleteIndustry(industryId);
    if (!deleted) throw new InternalServerError("Failed to delete industry");
    return deleted;
  }

  async searchIndustries(query: string) {
    const results = await this._industryRepository.getIndustriesByName(query);
    if (!results || results.length === 0) throw new NotFoundError("No matching industries found");
    return results;
  }
}

export default new IndustryService(new IndustryRepository());