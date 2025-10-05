import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service"; 

interface MulterFiles {
  mainImage?: Express.Multer.File[];
}

export const getAllBaseProducts = async (req: Request, res: Response, next: NextFunction) => {
  const response = await productService.getAllBaseProducts();
  next(response);
};

export const getABaseProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const response = await productService.getBaseProductById(productId);
  next(response);
};

export const createABaseProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productCode, name, subheading, description } = req.body;

  let applications = req.body.applications;
  let bulletPoints = req.body.bulletPoints;
  if (typeof applications === "string") {
    applications = JSON.parse(applications);
  }
  if (typeof bulletPoints === "string") {
    bulletPoints = JSON.parse(bulletPoints);
  }

  // multer files
  const files = req.files as MulterFiles;
  const mainImage = files?.mainImage?.[0];

  const response = await productService.createBaseProduct({
    productCode,
    name,
    mainImage,
    subheading,
    description,
    applications,
    bulletPoints,
  });

  next(response);
};

export const editABaseProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const { productCode, name, subheading, description } = req.body;

  let applications = req.body.applications;
  let bulletPoints = req.body.bulletPoints;
  if (typeof applications === "string") {
    applications = JSON.parse(applications);
  }
  if (typeof bulletPoints === "string") {
    bulletPoints = JSON.parse(bulletPoints);
  }

  const files = req.files as MulterFiles;
  const mainImage = files?.mainImage?.[0];

  const response = await productService.editBaseProduct({
    productId,
    productCode,
    name,
    mainImage,
    subheading,
    description,
    applications,
    bulletPoints,
  });

  next(response);
};


export const deleteBaseProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productId } = req.params;
  const response = await productService.deleteBaseProduct(productId);

  next(response);
};

export const searchBaseProducts = async (req: Request, res: Response, next: NextFunction) => {
  const { query } = req.query;
  const response = await productService.searchBaseProducts(query as string);
  next(response);
};
