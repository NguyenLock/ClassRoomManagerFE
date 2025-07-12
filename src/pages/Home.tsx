import HeroSection from "../components/heroSection";
import Stats from "../components/Stats";
import FeatureSection from "../components/FeatureSection";
import DashBoardReview from "../components/DashBoardReview";
import Contact from "../components/Contact";
const Home = () => {
  return (
    <div>
      <HeroSection />
      <Stats/>
      <FeatureSection/>
      <DashBoardReview/>
      <Contact/>
    </div>
  );
};
export default Home;