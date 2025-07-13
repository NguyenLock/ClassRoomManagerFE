const TOKEN_KEY = 'accessToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_DURATION = 15 * 60 * 1000;

export const auth = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    
    const expiryTime = new Date().getTime() + TOKEN_DURATION;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return null;
    }

    
    const hasExpired = new Date().getTime() > parseInt(expiry);
    if (hasExpired) {
      auth.removeToken();
      return null;
    }

    return token;
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken();
  },

  
  getTokenRemainingTime: (): number => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    
    const remaining = parseInt(expiry) - new Date().getTime();
    return Math.max(0, Math.floor(remaining / 1000));
  }
}; 