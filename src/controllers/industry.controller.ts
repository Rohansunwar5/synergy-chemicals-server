import { NextFunction, Request, Response } from "express";
import industryService from "../services/industry.service";

interface MulterFiles {
  image?: Express.Multer.File[];
}

export const getAllIndustries = async (req: Request, res: Response, next: NextFunction) => {
  const response = await industryService.getAllIndustries();
  next(response);
};

export const getAnIndustry = async (req: Request, res: Response, next: NextFunction) => {
  const { industryId } = req.params;
  const response = await industryService.getIndustryById(industryId);
  next(response);
};

export const createAnIndustry = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  const files = req.files as MulterFiles;
  const image = files?.image?.[0];

  const response = await industryService.createIndustry({
    name,
    image,
    description,
  });

  next(response);
};

export const editAnIndustry = async (req: Request, res: Response, next: NextFunction) => {
  const { industryId } = req.params;
  const { name, description } = req.body;

  const files = req.files as MulterFiles;
  const image = files?.image?.[0];

  const response = await industryService.editIndustry({
    industryId,
    name,
    image,
    description,
  });

  next(response);
};

export const deleteIndustry = async (req: Request, res: Response, next: NextFunction) => {
  const { industryId } = req.params;
  const response = await industryService.deleteIndustry(industryId);

  next(response);
};

export const searchIndustries = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.query;
  const response = await industryService.searchIndustries(query as string);
  next(response);
};