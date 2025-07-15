import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Stats from "../components/Stats";
import FeatureSection from "../components/FeatureSection";
import DashBoardReview from "../components/DashBoardReview";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { auth } from "../utils/auth";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      const userType = localStorage.getItem("userType");
      navigate(userType === "instructor" ? "/instructor/dashboard" : "/student/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <HeroSection />
      <Stats/>
      <FeatureSection/>
      <DashBoardReview/>
      <Contact/>
      <Footer />
    </div>
  );
};
export default Home;