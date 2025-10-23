import { Request, Response, NextFunction } from "express";
import leadService from "../services/lead.service";


export const createLead = async(req: Request, res: Response, next: NextFunction) => {
    const { name, phone } = req.body;

    await leadService.createLead({ name, phone});
    const response = await leadService.sendOTP(phone);

    next(response);
}

export const verifyLeadOTP = async(req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = req.body;
    const verifyResponse = await leadService.verifyOTP(phone, otp);

    next(verifyResponse);
}