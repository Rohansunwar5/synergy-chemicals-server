import { Router } from "express";
import isAdminLoggedIn from "../middlewares/isAdminLoggedIn.middleware";
import { asyncHandler } from "../utils/asynchandler";
import { createATestimonial, deleteATestimonial, editATestimonial, getAllTestimonials, getATestimonial } from "../controllers/testimonial.controller";
import { uploadPersonImage } from "../middlewares/multer.middleware";

const testimonialRouter = Router();

testimonialRouter.get('/', asyncHandler(getAllTestimonials));
testimonialRouter.get('/:testimonialId', asyncHandler(getATestimonial));
testimonialRouter.post('/create', isAdminLoggedIn, uploadPersonImage, asyncHandler(createATestimonial));
testimonialRouter.put('/edit/:testimonialId', isAdminLoggedIn, uploadPersonImage, asyncHandler(editATestimonial));
testimonialRouter.delete('/delete/:testimonialId', isAdminLoggedIn, asyncHandler(deleteATestimonial));

export default testimonialRouter;