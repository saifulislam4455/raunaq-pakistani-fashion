
import AnnouncementBar from "../components/layout/AnnouncementBar.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import LuxuryShowroom3D from "../components/3d/LuxuryShowroom3D.jsx";
import WardrobeExperience from "../components/home/WardrobeExperience.jsx";
import CollectionShowcase from "../components/home/CollectionShowcase.jsx";
import FeaturedProducts from "../components/home/FeaturedProducts.jsx";
import HeritageStory from "../components/home/HeritageStory.jsx";

export default function Home() {
  return (
    <div className="site-shell">
      <AnnouncementBar />

      <Navbar />

      <main id="home">
        <LuxuryShowroom3D />
        <WardrobeExperience />
        <CollectionShowcase />
        <FeaturedProducts />
        <HeritageStory />
      </main>

      <Footer />
    </div>
  );
}
