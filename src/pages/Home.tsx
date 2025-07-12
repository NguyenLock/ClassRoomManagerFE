import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Stats from "../components/Stats";
import FeatureSection from "../components/FeatureSection";
import DashBoardReview from "../components/DashBoardReview";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Home = () => {
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