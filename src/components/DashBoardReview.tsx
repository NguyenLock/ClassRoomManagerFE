import { Users, BookOpen, MessageCircle, TrendingUp, CheckCircle } from "lucide-react";
const DashBoardReview = () => {
    return(
        <section id="dashboard" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Smart Role-Based Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Separate interfaces designed for each role, optimizing user experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">Teacher Dashboard</h3>
                <p className="opacity-90">Easy classroom management and student management</p>
              </div>
              <div className="bg-white border-2 border-gray-100 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Student Management</span>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Assign Lessons</span>
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Chat with Students</span>
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Progress Reports</span>
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>

           
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl">
                <h3 className="text-2xl font-bold mb-2">Student Dashboard</h3>
                <p className="opacity-90">Improve learning efficiency and easy interaction</p>
              </div>
              <div className="bg-white border-2 border-gray-100 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">View Lessons</span>
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Mark Completion</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Chat with Teachers</span>
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Update Profile</span>
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}
export default DashBoardReview;