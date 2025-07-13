import { ArrowRight, TrendingUp } from "lucide-react";
import studentandTeacher from "../assets/studentandTeacher.webp";
import { stats } from "../mock/Stats";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 font-sans leading-tight">
                Effective Student
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {" "}
                  Management
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-sans">
                Comprehensive classroom management system supporting teachers
                and students with role-based dashboards, real-time chat, and
                maximum security
              </p>
            </div>
            <div className= "flex flex-col sm:flex-row gap-4">
                <button className= "bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
                    <span className= "font-semibold">Get Started</span>
                    <ArrowRight className= "w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center space-x-8 pt-4">
                {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-blue-600 font-sans">{stat.number}</div>
                        <div className="text-gray-600 font-sans">{stat.label}</div>
                    </div>
                ))}
            </div>
          </div>
          <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <img 
                  src={studentandTeacher} 
                  alt="Student and Teacher" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
        </div>
      </div>
    </section>
    
  );
};

export default HeroSection;
