import contactModel from "../models/contact.model";

export interface ICreateContactParams {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

export class ContactRepository {
  private _model = contactModel;

  async getAllContacts() {
    return this._model.find();
  }

  async getContactById(contactId: string) {
    return this._model.findById(contactId);
  }

  async createContact(params: ICreateContactParams) {
    return this._model.create(params);
  }

  async updateContact(contactId: string, updateData: Partial<ICreateContactParams>) {
    return this._model.findByIdAndUpdate(contactId, updateData, { new: true });
  }

  async deleteContact(contactId: string) {
    return this._model.findByIdAndDelete(contactId);
  }
}
