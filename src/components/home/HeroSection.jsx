
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles size={14} /> THE RAUNAQ EXPERIENCE
        </span>

        <div className="hero-monogram">R</div>

        <span className="hero-kicker">PAKISTANI FASHION HOUSE</span>

        <h1>
          Elegance woven
          <br />
          into <em>every thread.</em>
        </h1>

        <p>
          Discover Pakistani fashion inspired by our heritage,
          crafted for modern living and made to express your identity.
        </p>

        <a className="primary-button" href="#wardrobe">
          EXPLORE THE WARDROBE <ArrowRight size={17} />
        </a>

        <div className="hero-caption">
          CULTURE <span>✦</span> CRAFT <span>✦</span> ELEGANCE
        </div>
      </div>

      <div className="hero-art">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"
          alt="Fashion inspiration for the Raunaq collection"
        />
        <div className="hero-art-label">
          <span>THE SIGNATURE EDIT</span>
          <strong>Rooted in heritage.</strong>
        </div>
      </div>
    </section>
  );
}
