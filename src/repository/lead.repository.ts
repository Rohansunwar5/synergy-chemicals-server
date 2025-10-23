import leadModel from "../models/lead.model";

export class LeadRepository {
    async createLead(data: { name: string; phone: string }) {
        return leadModel.create(data);
    }

    async updateOTPStatus(phone: string, otpVerified: boolean) {
        return leadModel.updateOne({ phone }, { otpVerified });
    }

    async findByPhone(phone: string) {
        return leadModel.findOne({ phone }).lean();
    }
    async updateSessionId(phone: string, sessionId: string | null) {
        return leadModel.updateOne({ phone }, { sessionId });
    }

    async getAllLeads() {
        return leadModel.find();
    }
}