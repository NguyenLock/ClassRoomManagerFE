import { GraduationCap, Phone, User, Lock } from "lucide-react";
import React from "react";
import { useState } from "react";

type UserRole = "instructor" | "student" | null;
const Login = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    username: "",
    password: "",
  });
  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    setFormData({ phoneNumber: "", username: "", password: "" });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
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
                {role === "instructor" && (
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
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
                      />
                    </div>
                  </div>
                )}

                {role === "student" && (
                  <>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-2"
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
                        className="block text-sm font-medium text-gray-700 mb-2"
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
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95 ${
                  role === 'instructor'
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                    : 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                }`}
              >
                Sign In as {role === 'instructor' ? 'Instructor' : 'Student'}
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
  );
};
export default Login;
