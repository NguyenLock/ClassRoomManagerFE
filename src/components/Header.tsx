import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header =() =>{
    const navigate = useNavigate();

    return(
        <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ClassroomManagement</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-sans">Features</a>
              <a href="#dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-sans">Dashboard</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-sans">Contact</a>
            </nav>
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-sans"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    )
}
export default Header;