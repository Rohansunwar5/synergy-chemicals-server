import { Router } from "express";
import isAdminLoggedIn from "../middlewares/isAdminLoggedIn.middleware";
import { asyncHandler } from "../utils/asynchandler";
import {
  createAnIndustry,
  deleteIndustry,
  editAnIndustry,
  getAnIndustry,
  getAllIndustries,
  searchIndustries
} from "../controllers/industry.controller";
import { uploadIndustryImage, uploadProductImages } from "../middlewares/multer.middleware";

const industryRouter = Router();

industryRouter.get('/', asyncHandler(getAllIndustries));
industryRouter.get('/search', asyncHandler(searchIndustries));
industryRouter.post('/create', isAdminLoggedIn, uploadIndustryImage, asyncHandler(createAnIndustry));
industryRouter.get('/:industryId', asyncHandler(getAnIndustry));
industryRouter.put('/edit/:industryId', isAdminLoggedIn, uploadIndustryImage, asyncHandler(editAnIndustry));
industryRouter.delete('/delete/:industryId', isAdminLoggedIn, asyncHandler(deleteIndustry));

export default industryRouter;