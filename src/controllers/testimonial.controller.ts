import { NextFunction, Request, Response } from "express";
import testimonialService from "../services/testimonial.service";

export const getAllTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  const response = await testimonialService.getAllTestimonials();

  next(response);
};

export const getATestimonial = async (req: Request, res: Response, next: NextFunction) => {
  const { testimonialId } = req.params;
  const response = await testimonialService.getATestimonial(testimonialId);

  next(response);
};

export const createATestimonial = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;
  const file = req.file as Express.Multer.File;

  const response = await testimonialService.createTestimonial({
    name,
    title,
    description,
    file,
  });

  next(response);
};

export const editATestimonial = async (req: Request, res: Response, next: NextFunction) => {
  const { testimonialId } = req.params;
  const { name, title, description } = req.body;
  const file = req.file as Express.Multer.File;

  const response = await testimonialService.editTestimonial({
    testimonialId,
    name,
    title,
    description,
    file,
  });

  next(response);
};

export const deleteATestimonial = async (req: Request, res: Response, next: NextFunction) => {
  const { testimonialId } = req.params;
  const response = await testimonialService.deleteATestimonial({ testimonialId });
  
  next(response);
};