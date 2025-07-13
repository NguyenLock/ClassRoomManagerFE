import { SetupAccountRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SETUP_ACCOUNT_PATH = import.meta.env.VITE_SETUP_ACCOUNT || '/student-auth/setup-account';

export const studentAuthService = {
  setupAccount: async (verificationToken: string, data: SetupAccountRequest) => {
    try {
      const response = await fetch(`${API_URL}${SETUP_ACCOUNT_PATH}/${verificationToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to setup account');
      }

      return await response.json();
    } catch (error) {
      console.error('Error setting up account:', error);
      throw error;
    }
  },
}; 