import { SetupAccountRequest } from '../types';
import apiInstance from './api';

export const studentAuthService = {
  setupAccount: async (verificationToken: string, data: SetupAccountRequest) => {
    try {
      const response = await apiInstance.post(
        `${import.meta.env.VITE_SETUP_ACCOUNT}/${verificationToken}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error setting up account:', error);
      throw error;
    }
  },
}; 