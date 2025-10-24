import { NextFunction, Request, Response } from "express";
import contactService from "../services/contact.service";

export const getAllContacts = async (req: Request, res: Response, next: NextFunction) => {
  const response = await contactService.getAllContacts();
  next(response);
};

export const getAContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  const response = await contactService.getContactById(contactId);
  next(response);
};

export const createAContact = async (req: Request, res: Response, next: NextFunction) => {
  const { name, phoneNumber, email, message } = req.body;
  const response = await contactService.createContact({ name, phoneNumber, email, message });
  next(response);
};

export const editAContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, message } = req.body;
  const response = await contactService.editContact({ contactId, name, phoneNumber, email, message });
  next(response);
};

export const deleteAContact = async (req: Request, res: Response, next: NextFunction) => {
  const { contactId } = req.params;
  const response = await contactService.deleteContact(contactId);
  next(response);
};
