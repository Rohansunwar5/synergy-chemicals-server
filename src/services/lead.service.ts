import twilio from 'twilio'
import { LeadRepository } from '../repository/lead.repository'

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioClient = twilio(accountSid, authToken);
const twilioServiceSid = process.env.TWILIO_SERVICE_SID!;

class LeadService {
    constructor(private readonly _leadRepository: LeadRepository) {} 

    async createLead({ name, phone }: { name: string; phone: string }) {
        const existingLead = await this._leadRepository.findByPhone(phone);

        if(!existingLead) {
            await this._leadRepository.createLead({ name, phone })
        }

        return existingLead;
    }

    async sendOTP(phone: string) {
        const verification = await twilioClient
        .verify
        .services(twilioServiceSid)
        .verifications
        .create({ to: phone, channel: "sms" });

        return verification;
    }

    async verifyOTP(phone: string, otp: string) {
        const verificationCheck = await twilioClient
        .verify
        .services(twilioServiceSid)
        .verificationChecks
        .create({ to: phone, code: otp });

        if(verificationCheck.status === "approved") {
            await this._leadRepository.updateOTPStatus(phone, true);
            return true
        }

        return false
    }
}

export default new LeadService(new LeadRepository());