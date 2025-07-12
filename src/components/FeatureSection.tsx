import {
  Smartphone,
  Users,
  BookOpen,
  MessageCircle,
  Shield,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Phone Number Authentication",
    description:
      "Quick verification via 6-digit SMS code with Twilio technology, ensuring high security standards",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Role-Based Dashboard",
    description:
      "Separate interfaces for teachers and students with optimized features for each role",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Comprehensive Student Management",
    description:
      "Easily add, edit, delete students, and automatically send account setup emails",
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Real-Time Chat",
    description:
      "Direct communication between teachers and students via Socket.io technology",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Maximum Security",
    description:
      "Email verification, data encryption, and secure user information storage",
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: "Learning Progress Tracking",
    description:
      "Mark lesson completion, detailed reports on learning progress",
  },
];
const FeatureSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-sans">
            Key Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
          Comprehensive management system for Teachers and Students
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 font-sans">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeatureSection;
