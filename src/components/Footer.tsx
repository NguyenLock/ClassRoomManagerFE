import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">ClassroomManagement</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 ClassroomManagement. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
