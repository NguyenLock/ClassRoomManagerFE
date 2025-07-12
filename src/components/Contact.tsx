import { ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Ready to Start Efficient Classroom Management?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of teachers and students already using our system
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center space-x-2">
            <span>Sign Up Now - Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default Contact;
