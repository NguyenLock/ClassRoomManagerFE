export interface SetupAccountRequest {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface CreateAccessCode {
  phoneNumber: string;
}
export interface CreateAccessCodeResponse {
  accessCode?: string;
  message?: string;
  error?: string;
}
export interface VerifyAccessCodeRequest {
  phoneNumber: string;
  accessCode: string;
}

export interface VerifyAccessCodeResponse {
  success: boolean;
  userType: string;
  accessToken: string;
}

export interface StudentLoginRequest {
  email: string;
  password: string;
}

export interface AccessCodeValidationRequest {
  email: string;
  accessCode: string;
}

export interface StudentAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      email: string;
      name: string;
      phoneNumber: string;
      userType: string;
    }
  }
}

export interface Stat {
  number: string;
  label: string;
}
