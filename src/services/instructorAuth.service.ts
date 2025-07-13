import { 
    CreateAccessCode, 
    CreateAccessCodeResponse, 
    VerifyAccessCodeRequest,
    VerifyAccessCodeResponse 
} from "../types";
import apiInstance from './api';

export const instructorAuthService = {
    createAccessCode: async(data: CreateAccessCode): Promise<CreateAccessCodeResponse> => {
        try {
            const response = await apiInstance.post(
                import.meta.env.VITE_INSTRUCTOR_LOGIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error creating access code:', error);
            throw error;
        }
    },

    verifyAccessCode: async(data: VerifyAccessCodeRequest): Promise<VerifyAccessCodeResponse> => {
        try {
            const response = await apiInstance.post(
                import.meta.env.VITE_ACCESS_CODE,
                data
            );
            return response.data;
        } catch (error) {
            console.error('Error verifying access code:', error);
            throw error;
        }
    }
}