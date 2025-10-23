import axios from 'axios';
import { LeadRepository } from '../repository/lead.repository';

const twoFactorApiKey = process.env.TWO_FACTOR_API_KEY!;
const twoFactorBaseUrl = 'https://2factor.in/API/V1';
// Optional: Add template name if you have one registered in 2Factor dashboard
const otpTemplateName = process.env.TWO_FACTOR_TEMPLATE_NAME || ''; // e.g., 'OTP1', 'AUTOGEN'

interface TwoFactorSendOTPResponse {
    Status: string;
    Details: string; // This is the session_id
}

interface TwoFactorVerifyOTPResponse {
    Status: string;
    Details: string; // "OTP Matched" or error message
}

class LeadService {
    constructor(private readonly _leadRepository: LeadRepository) {} 

    async createLead({ name, phone }: { name: string; phone: string }) {
        const existingLead = await this._leadRepository.findByPhone(phone);

        if (!existingLead) {
            await this._leadRepository.createLead({ name, phone });
        }

        return existingLead;
    }

    /**
     * Sends OTP via SMS (not voice)
     * 
     * METHOD 1: Using AUTOGEN (System generates OTP)
     * URL Format: https://2factor.in/API/V1/{api_key}/SMS/{phone}/AUTOGEN
     * OR with template: https://2factor.in/API/V1/{api_key}/SMS/{phone}/AUTOGEN/{template_name}
     */
    async sendOTP(phone: string): Promise<{ success: boolean; sessionId?: string; message?: string }> {
        try {
            // Format phone number (ensure it has country code)
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

            // Build URL - using SMS endpoint explicitly (NOT VOICE)
            let url = `${twoFactorBaseUrl}/${twoFactorApiKey}/SMS/${formattedPhone}/AUTOGEN`;
            
            // If you have a registered template, append it
            if (otpTemplateName) {
                url += `/${otpTemplateName}`;
            }
            
            const response = await axios.post<TwoFactorSendOTPResponse>(url);
            
            console.log('2Factor Response:', response.data);

            if (response.data.Status === 'Success') {
                // Store session ID for verification
                await this._leadRepository.updateSessionId(phone, response.data.Details);
                
                return {
                    success: true,
                    sessionId: response.data.Details,
                    message: 'OTP sent successfully via SMS'
                };
            } else {
                return {
                    success: false,
                    message: response.data.Details || 'Failed to send OTP'
                };
            }
        } catch (error: any) {
            console.error('2Factor sendOTP error:', error.response?.data || error.message);
            
            // Check if error is related to DND or template issues
            const errorMessage = error.response?.data?.Details || error.message;
            
            if (errorMessage.includes('DND')) {
                return {
                    success: false,
                    message: 'Phone number is on DND. Please enable SMS on your number or contact support.'
                };
            }
            
            if (errorMessage.includes('template')) {
                return {
                    success: false,
                    message: 'SMS template not configured. Please set up SMS template in 2Factor dashboard.'
                };
            }

            return {
                success: false,
                message: errorMessage || 'Error sending OTP'
            };
        }
    }

    /**
     * Alternative Method: Send Custom OTP (you generate the OTP)
     * Use this if AUTOGEN isn't working properly
     */
    async sendCustomOTP(phone: string, customOTP: string): Promise<{ success: boolean; message?: string }> {
        try {
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

            // URL format for custom OTP
            let url = `${twoFactorBaseUrl}/${twoFactorApiKey}/SMS/${formattedPhone}/${customOTP}`;
            
            if (otpTemplateName) {
                url += `/${otpTemplateName}`;
            }

            console.log('Sending custom SMS OTP to:', formattedPhone);
            
            const response = await axios.post<TwoFactorSendOTPResponse>(url);
            
            if (response.data.Status === 'Success') {
                // Store the custom OTP and session in your database
                await this._leadRepository.updateSessionId(phone, customOTP);
                
                return {
                    success: true,
                    message: 'OTP sent successfully via SMS'
                };
            } else {
                return {
                    success: false,
                    message: response.data.Details || 'Failed to send OTP'
                };
            }
        } catch (error: any) {
            console.error('2Factor sendCustomOTP error:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.Details || 'Error sending OTP'
            };
        }
    }

    async getAllLeads() {
        return this._leadRepository.getAllLeads();
    }

    async verifyOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
        try {
            const lead = await this._leadRepository.findByPhone(phone);
            
            if (!lead || !lead.sessionId) {
                console.error('No session ID found for phone:', phone);
                return {
                    success: false,
                    message: 'Session not found. Please request OTP again.'
                };
            }

            // Verify OTP using the session ID
            const url = `${twoFactorBaseUrl}/${twoFactorApiKey}/SMS/VERIFY/${lead.sessionId}/${otp}`;
            
            console.log('Verifying OTP for session:', lead.sessionId);
            
            const response = await axios.get<TwoFactorVerifyOTPResponse>(url);
            
            console.log('Verification response:', response.data);

            if (response.data.Status === 'Success' && response.data.Details === 'OTP Matched') {
                // Mark user as verified
                await this._leadRepository.updateOTPStatus(phone, true);
                await this._leadRepository.updateSessionId(phone, null);
                
                return {
                    success: true,
                    message: 'OTP verified successfully'
                };
            }
            
            return {
                success: false,
                message: response.data.Details || 'Invalid OTP'
            };
        } catch (error: any) {
            console.error('2Factor verifyOTP error:', error.response?.data || error.message);
            
            const errorMessage = error.response?.data?.Details || error.message;
            
            if (errorMessage.includes('expired')) {
                return {
                    success: false,
                    message: 'OTP has expired. Please request a new one.'
                };
            }
            
            return {
                success: false,
                message: errorMessage || 'Error verifying OTP'
            };
        }
    }
}

export default new LeadService(new LeadRepository());