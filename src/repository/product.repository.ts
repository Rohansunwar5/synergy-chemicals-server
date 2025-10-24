import baseProductModel from "../models/baseProduct.model";

export interface ICreateBaseProductParams {
  productCode: string;
  name: string;
  mainImage?: { url: string; publicId?: string };
  subheading?: string;
  description?: string;
  applications?: Array<{ point: string; description?: string }>;
  bulletPoints?: Array<{ point: string; description?: string }>;
}

export class ProductRepository {
  private _model = baseProductModel;

  async getAllBaseProducts() {
    return this._model.find();
  }

  async getBaseProductById(productId: string) {
    return this._model.findById(productId);
  }

  async createBaseProduct(productData: ICreateBaseProductParams) {
    return this._model.create(productData);
  }

  async updateBaseProduct(productId: string, updateData: Partial<ICreateBaseProductParams>) {
    return this._model.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );
  }

  async deleteBaseProduct(productId: string) {
    return this._model.deleteOne({ _id: productId });
  }

  async getBaseProductsByNameOrCode(query: string) {
    return this._model.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { productCode: { $regex: query, $options: "i" } }
      ]
    });
  }
}
