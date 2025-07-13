import { GraduationCap, Phone, User, Lock, KeyRound, X } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { instructorAuthService } from "../services/instructorAuth.service";
import { auth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
type UserRole = "instructor" | "student" | null;
interface AccessCodePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
  role:  UserRole;
}
const AccessCodePopup: React.FC<AccessCodePopupProps> = ({ isOpen, onClose, onSubmit, role }) => {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError("Access code is required");
      return;
    }
    onSubmit(accessCode);
  }
  if (!isOpen) return null;
  return(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <KeyRound className={`w-6 h-6 ${role === 'instructor' ? 'text-blue-600' : 'text-green-600'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-sans">Access Code Required</h3>
          <p className="text-sm text-gray-500 font-sans mt-1">
            Please enter your access code to continue to the dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={accessCode}
                onChange={(e) => {
                  setError("");
                  setAccessCode(e.target.value);
                }}
                placeholder="Enter access code"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors
                  ${error ? 'border-red-300 focus:ring-red-200' : 
                    role === 'instructor' ? 'focus:ring-blue-200 focus:border-blue-500' : 'focus:ring-green-200 focus:border-green-500'}`}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 font-sans transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-white rounded-lg font-sans transition-all duration-200 
                ${role === 'instructor' 
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200' 
                  : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'}`}
            >
              Verify & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
const Login = () => {
  const navigate = useNavigate();
  
  // Check if user is already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate('/instructor/dashboard');
    }
  }, [navigate]);

  const [showAccessCodePopup, setShowAccessCodePopup] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    username: "",
    password: "",
  });
  const [accessCode, setAccessCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    setFormData({ phoneNumber: "", username: "", password: "" });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (role === 'instructor') {
        setIsLoading(true);
        const response = await instructorAuthService.createAccessCode({
          phoneNumber: formData.phoneNumber
        });
        setAccessCode(response.accessCode || '');
        setShowAccessCodePopup(true);
      } else if (role === 'student') {
        // Handle student login here
        console.log('Student login:', formData);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleAccessCodeSubmit = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await instructorAuthService.verifyAccessCode({
        phoneNumber: formData.phoneNumber,
        accessCode: code
      });

      auth.setToken(response.accessToken);
      localStorage.setItem('userType', response.userType);
      
      setShowAccessCodePopup(false);
      navigate(response.userType === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
      
    } catch (error) {
      setError('Invalid access code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">
            Welcome to Classroom Management
          </h1>
          <p className="text-gray-600 font-sans">
            Please select your role to continue
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => handleRoleSelect("instructor")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                role === "instructor"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Instructor</span>
            </button>
            <button
              onClick={() => handleRoleSelect("student")}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                role === "student"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <GraduationCap className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Student</span>
            </button>
          </div>
          {role && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`transition-all duration-300 ${
                  role ? "opacity-100" : "opacity-0"
                }`}
              >
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                {role === "instructor" && (
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2 font-sans"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {role === "student" && (
                  <>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-2 font-sans"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Enter your username"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2 font-sans"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95 ${
                  role === 'instructor'
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                    : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Sign In as ${role === 'instructor' ? 'Instructor' : 'Student'}`
                )}
              </button>
            </form>
          )}
           {!role && (
            <div className="text-center py-8 text-gray-500">
              Please select your role to continue
            </div>
          )}
        </div>
      </div>
    </div>
    <AccessCodePopup
    isOpen= {showAccessCodePopup}
    onClose={() => setShowAccessCodePopup(false)}
    onSubmit={handleAccessCodeSubmit}
    role={role}
    />
    </>
  );
};
export default Login;
