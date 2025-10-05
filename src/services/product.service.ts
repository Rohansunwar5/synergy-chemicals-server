import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { ProductRepository } from "../repository/product.repository";
import { uploadToCloudinary } from "../utils/cloudinary.util";

interface CreateBaseProductParamsFromController {
  productCode: string;
  name: string;
  mainImage?: Express.Multer.File; // raw file from multer
  subheading?: string;
  description?: string;
  applications: Array<{ point: string; description?: string }>;
  bulletPoints: Array<{ point: string; description?: string }>;
}

interface CreateBaseProductParamsForRepo {
  productCode: string;
  name: string;
  mainImage: { url: string; publicId?: string };
  subheading?: string;
  description?: string;
  applications: Array<{ point: string; description?: string }>;
  bulletPoints: Array<{ point: string; description?: string }>;
}

interface EditBaseProductParams {
  productId: string;
  productCode?: string;
  name?: string;
  mainImage?: Express.Multer.File; // raw file from multer
  subheading?: string;
  description?: string;
  applications?: Array<{ point: string; description?: string }>;
  bulletPoints?: Array<{ point: string; description?: string }>;
}

class BaseProductService {
  constructor(private readonly _baseProductRepository: ProductRepository) {}

  async getAllBaseProducts() {
    const products = await this._baseProductRepository.getAllBaseProducts();
    if (!products || products.length === 0) throw new NotFoundError("No base products found");
    return products;
  }

  async getBaseProductById(productId: string) {
    const product = await this._baseProductRepository.getBaseProductById(productId);
    if (!product) throw new NotFoundError("Base product not found");
    return product;
  }

  async createBaseProduct(params: CreateBaseProductParamsFromController) {
    const {
      productCode,
      name,
      mainImage,
      subheading,
      description,
      applications,
      bulletPoints,
    } = params;

    if (!mainImage) {
      throw new BadRequestError("Main image file is required");
    }

    // Upload main image and get url/publicId
    const uploadResult = await uploadToCloudinary(mainImage);
    const mainImageData = { url: uploadResult, publicId: undefined }; // adapt if publicId available

    const creationParams: CreateBaseProductParamsForRepo = {
      productCode,
      name,
      mainImage: mainImageData,
      subheading,
      description,
      applications,
      bulletPoints,
    };

    const creation = await this._baseProductRepository.createBaseProduct(creationParams);
    if (!creation) throw new InternalServerError("Failed to create base product");

    return creation;
  }

  async editBaseProduct(params: EditBaseProductParams & { mainImage?: Express.Multer.File }) {
    const { productId, mainImage, ...updateData } = params;

    const existing = await this._baseProductRepository.getBaseProductById(productId);
    if (!existing) throw new NotFoundError("Base product not found");

    let mainImageData = existing.mainImage;

    if (mainImage) {
      // Upload new image and overwrite mainImageData
      const uploadResult = await uploadToCloudinary(mainImage);
      mainImageData = { url: uploadResult, publicId: undefined };
    }

    const updatedData = {
      ...updateData,
      mainImage: mainImageData,
    };

    const updated = await this._baseProductRepository.updateBaseProduct(productId, updatedData);
    if (!updated) throw new InternalServerError("Failed to update base product");

    return updated;
  }


  async deleteBaseProduct(productId: string) {
    if (!productId) throw new BadRequestError("Product ID not provided");

    const deleted = await this._baseProductRepository.deleteBaseProduct(productId);
    if (!deleted) throw new InternalServerError("Failed to delete base product");
    return deleted;
  }

  async searchBaseProducts(query: string) {
    const results = await this._baseProductRepository.getBaseProductsByNameOrCode(query);
    if (!results || results.length === 0) throw new NotFoundError("No matching base products found");
    return results;
  }
}

export default new BaseProductService(new ProductRepository());
