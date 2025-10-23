import { Router } from "express";
import { createLead, getAllLeads, verifyLeadOTP } from "../controllers/lead.controller";
import { asyncHandler } from "../utils/asynchandler";

const leadRouter = Router();

leadRouter.post('/submit', asyncHandler(createLead));
leadRouter.post('/verify-otp', asyncHandler(verifyLeadOTP))
leadRouter.get('/all', asyncHandler(getAllLeads));

export default leadRouter