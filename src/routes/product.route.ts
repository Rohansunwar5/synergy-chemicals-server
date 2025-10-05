import { Router } from "express";
import isAdminLoggedIn from "../middlewares/isAdminLoggedIn.middleware";
import { asyncHandler } from "../utils/asynchandler";
import {
  createABaseProduct,
  deleteBaseProduct,
  editABaseProduct,
  getABaseProduct,
  getAllBaseProducts,
  searchBaseProducts
} from "../controllers/product.controller";
import { uploadProductImages } from "../middlewares/multer.middleware";

const productRouter = Router();

productRouter.get('/', asyncHandler(getAllBaseProducts));
productRouter.get('/:productId', asyncHandler(getABaseProduct));
productRouter.post('/create', isAdminLoggedIn, uploadProductImages, asyncHandler(createABaseProduct));
productRouter.put('/edit/:productId', isAdminLoggedIn, uploadProductImages, asyncHandler(editABaseProduct));
productRouter.delete('/delete/:productId', isAdminLoggedIn, asyncHandler(deleteBaseProduct));
productRouter.get('/search', asyncHandler(searchBaseProducts));

export default productRouter;
