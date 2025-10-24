import { BadRequestError } from "../errors/bad-request.error";
import { InternalServerError } from "../errors/internal-server.error";
import { NotFoundError } from "../errors/not-found.error";
import { ContactRepository } from "../repository/contact.repository";

interface CreateContactParams {
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
}

interface EditContactParams {
  contactId: string;
  name?: string;
  phoneNumber?: string;
  email?: string;
  message?: string;
}

class ContactService {
  constructor(private readonly _contactRepository: ContactRepository) {}

  async getAllContacts() {
    const contacts = await this._contactRepository.getAllContacts();
    if (!contacts || contacts.length === 0) throw new NotFoundError("No contact queries found");
    return contacts;
  }

  async getContactById(contactId: string) {
    const contact = await this._contactRepository.getContactById(contactId);
    if (!contact) throw new NotFoundError("Contact query not found");
    return contact;
  }

  async createContact(params: CreateContactParams) {
    const { name, phoneNumber, email, message } = params;

    if (!name || !phoneNumber || !email || !message) {
      throw new BadRequestError("All fields are required");
    }

    const createdContact = await this._contactRepository.createContact(params);
    if (!createdContact) throw new InternalServerError("Failed to create contact query");

    return createdContact;
  }

  async editContact(params: EditContactParams) {
    const { contactId, name, phoneNumber, email, message } = params;
    const existingContact = await this._contactRepository.getContactById(contactId);
    if (!existingContact) throw new NotFoundError("Contact query not found");

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    if (message) updateData.message = message;

    const updatedContact = await this._contactRepository.updateContact(contactId, updateData);
    if (!updatedContact) throw new InternalServerError("Failed to update contact query");

    return updatedContact;
  }

  async deleteContact(contactId: string) {
    const existingContact = await this._contactRepository.getContactById(contactId);
    if (!existingContact) throw new NotFoundError("Contact query not found");

    const deletedContact = await this._contactRepository.deleteContact(contactId);
    if (!deletedContact) throw new InternalServerError("Failed to delete contact query");

    return { message: "Contact query deleted successfully", deletedContact };
  }
}

export default new ContactService(new ContactRepository());
