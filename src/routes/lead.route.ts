import { Router } from "express";
import { createLead, verifyLeadOTP } from "../controllers/lead.controller";
import { asyncHandler } from "../utils/asynchandler";

const leadRouter = Router();

leadRouter.post('/submit', asyncHandler(createLead));
leadRouter.post('/verify-otp', asyncHandler(verifyLeadOTP))

export default leadRouter