import industryModel from "../models/industry.model";

export interface ICreateIndustryParams {
  name: string;
  image: { url: string; publicId?: string };
  description?: string;
}

export class IndustryRepository {
  private _model = industryModel;

  async getAllIndustries() {
    return this._model.find();
  }

  async getIndustryById(industryId: string) {
    return this._model.findById(industryId);
  }

  async createIndustry(industryData: ICreateIndustryParams) {
    return this._model.create(industryData);
  }

  async updateIndustry(industryId: string, updateData: Partial<ICreateIndustryParams>) {
    return this._model.findByIdAndUpdate(
      industryId,
      updateData,
      { new: true }
    );
  }

  async deleteIndustry(industryId: string) {
    return this._model.deleteOne({ _id: industryId });
  }

  async getIndustriesByName(query: string) {
    return this._model.find({
      name: { $regex: query, $options: "i" }
    });
  }
}