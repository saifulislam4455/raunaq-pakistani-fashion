import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Crown,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";

import "./HeritageStory.css";

const fashionLooks = [
  {
    id: 1,
    number: "01",
    name: "The Royal Red",
    category: "BRIDAL COUTURE",
    description: "A celebration of timeless Pakistani craftsmanship.",
    color: "Ruby & antique gold",
    image:
      "https://www.faizasaqlain.pk/cdn/shop/files/3_38f9ec2b-a40e-4df5-9ede-5d63503e87b2.jpg?v=1695186050",
    position: "center 38%",
  },
  {
    id: 2,
    number: "02",
    name: "Golden Heirloom",
    category: "LUXURY FORMALS",
    description: "Intricate artistry, made for unforgettable moments.",
    color: "Rose gold",
    image:
      "https://erumkhanstores.com/cdn/shop/products/EK-18-GE-10001_2.jpg?v=1753386726&width=1800",
    position: "center 35%",
  },
  {
    id: 3,
    number: "03",
    name: "Blush Romance",
    category: "FESTIVE EDIT",
    description: "Soft tones and delicate details with a modern spirit.",
    color: "Blush pink",
    image:
      "https://declarepakistan.com/cdn/shop/files/LFU13_3.jpg?v=1694590147&width=1800",
    position: "center 38%",
  },
  {
    id: 4,
    number: "04",
    name: "Emerald Legacy",
    category: "HERITAGE EDIT",
    description: "A rich expression of tradition and contemporary grace.",
    color: "Emerald green",
    image:
      "https://razruya.com/cdn/shop/files/aik-atelier-wedding-festive-26-vol-1-look-04-1_21e51727-f9cf-4edf-8d6e-f790e576127b.jpg?v=1774858170&width=1200",
    position: "center 35%",
  },
];

function FashionFrame({ item, className = "", onOpen, style }) {
  return (
    <motion.button
      type="button"
      className={`cinema-frame ${className}`}
      style={style}
      onClick={() => onOpen(item)}
      whileHover={{ scale: 1.035, z: 35 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Open ${item.name}`}
    >
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        style={{ objectPosition: item.position }}
      />

      <span className="cinema-frame-shade" />

      <span className="cinema-frame-number">{item.number}</span>

      <span className="cinema-frame-open">
        <Maximize2 size={16} />
      </span>

      <span className="cinema-frame-caption">
        <small>{item.category}</small>
        <strong>{item.name}</strong>
      </span>
    </motion.button>
  );
}

export default function HeritageStory() {
  const sceneRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 85,
    damping: 22,
    mass: 0.8,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 85,
    damping: 22,
    mass: 0.8,
  });

  const sceneRotateY = useTransform(smoothX, [-1, 1], [-8, 8]);
  const sceneRotateX = useTransform(smoothY, [-1, 1], [5, -5]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });

  const sceneY = useTransform(scrollYProgress, [0, 0.5, 1], [90, 0, -90]);
  const sceneScale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    [0.88, 1, 1, 0.92]
  );

  const sideLeftY = useTransform(
    scrollYProgress,
    [0, 1],
    [100, -100]
  );

  const sideRightY = useTransform(
    scrollYProgress,
    [0, 1],
    [-70, 90]
  );

  const currentLook = fashionLooks[activeIndex];

  const getImage = (item) => imageErrors[item.id] || item.image;

  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse" || !sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set((x - 0.5) * 2);
    pointerY.set((y - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const changeLook = (direction) => {
    setActiveIndex((previous) => {
      return (
        (previous + direction + fashionLooks.length) %
        fashionLooks.length
      );
    });
  };

  const openLook = (item) => {
    setActiveImage(item);
  };

  const closeLook = () => {
    setActiveImage(null);
  };

  useEffect(() => {
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLook();

      if (event.key === "ArrowRight") changeLook(1);
      if (event.key === "ArrowLeft") changeLook(-1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage]);

  return (
    <>
      <section className="raunaq-cinema" ref={sceneRef}>
        <div className="cinema-grain" />
        <div className="cinema-glow cinema-glow-one" />
        <div className="cinema-glow cinema-glow-two" />

        <div className="cinema-orbit cinema-orbit-one" />
        <div className="cinema-orbit cinema-orbit-two" />

        <div className="cinema-topline">
          <span>RAUNAQ / PAKISTANI FASHION HOUSE</span>
          <span>THE HERITAGE COLLECTION — 2026</span>
        </div>

        <div className="cinema-heading">
          <motion.div
            className="cinema-kicker"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown size={15} />
            <span>AN EXPRESSION OF OUR HERITAGE</span>
            <Sparkles size={15} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            Elegance, Beyond
            <span>Time.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            A visual journey through the beauty of Pakistani craftsmanship.
            Tradition in every detail. Modernity in every silhouette.
          </motion.p>
        </div>

        <div
          className="cinema-stage"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <motion.div
            className="cinema-scene"
            style={{
              rotateX: sceneRotateX,
              rotateY: sceneRotateY,
              y: sceneY,
              scale: sceneScale,
            }}
          >
            <motion.div
              className="cinema-side cinema-side-left"
              style={{ y: sideLeftY }}
            >
              <FashionFrame
                item={fashionLooks[1]}
                className="cinema-frame-left"
                onOpen={openLook}
              />

              <div className="cinema-side-label">
                <span>02</span>
                <span>GOLDEN HEIRLOOM</span>
              </div>
            </motion.div>

            <motion.div
              className="cinema-side cinema-side-right"
              style={{ y: sideRightY }}
            >
              <FashionFrame
                item={fashionLooks[2]}
                className="cinema-frame-right"
                onOpen={openLook}
              />

              <div className="cinema-side-label">
                <span>03</span>
                <span>BLUSH ROMANCE</span>
              </div>
            </motion.div>

            <div className="cinema-center">
              <div className="cinema-center-halo" />
              <div className="cinema-center-ring cinema-ring-a" />
              <div className="cinema-center-ring cinema-ring-b" />

              <motion.div
                className="cinema-hero-frame"
                key={currentLook.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -12 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <button
                  type="button"
                  className="cinema-hero-image-button"
                  onClick={() => openLook(currentLook)}
                  aria-label={`View ${currentLook.name} full screen`}
                >
                  <img
                    src={getImage(currentLook)}
                    alt={currentLook.name}
                    onError={() => {
                      setImageErrors((previous) => ({
                        ...previous,
                        [currentLook.id]:
                          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1400&q=90",
                      }));
                    }}
                  />

                  <span className="cinema-hero-vignette" />
                  <span className="cinema-hero-light" />

                  <span className="cinema-hero-view">
                    <Maximize2 size={15} />
                    EXPLORE LOOK
                  </span>
                </button>

                <div className="cinema-hero-index">
                  <span>RAUNAQ</span>
                  <span>{currentLook.number} / 04</span>
                </div>
              </motion.div>

              <div className="cinema-floating-seal">
                <Crown size={21} />
                <span>ROOTED IN</span>
                <strong>HERITAGE</strong>
              </div>

              <div className="cinema-orbit-dot cinema-dot-one" />
              <div className="cinema-orbit-dot cinema-dot-two" />
              <div className="cinema-orbit-dot cinema-dot-three" />
            </div>
          </motion.div>
        </div>

        <div className="cinema-controls">
          <div className="cinema-look-info">
            <span>{currentLook.category}</span>
            <h3>{currentLook.name}</h3>
            <p>{currentLook.description}</p>
            <small>{currentLook.color}</small>
          </div>

          <div className="cinema-navigation">
            <button
              type="button"
              onClick={() => changeLook(-1)}
              aria-label="Previous look"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="cinema-progress">
              {fashionLooks.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className={activeIndex === index ? "active" : ""}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${item.name}`}
                >
                  <span />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => changeLook(1)}
              aria-label="Next look"
            >
              <ArrowRight size={19} />
            </button>
          </div>

          <button
            type="button"
            className="cinema-discover"
            onClick={() => openLook(currentLook)}
          >
            DISCOVER THE LOOK
            <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="cinema-bottom">
          <span>01 — 04 / A STUDY IN ELEGANCE</span>
          <span>
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </span>
          <span>MADE WITH HERITAGE</span>
        </div>
      </section>

      <section className="cinema-afterword">
        <div className="cinema-afterword-inner">
          <span>THE RAUNAQ PHILOSOPHY</span>
          <h2>
            Rooted in heritage.
            <em>Designed for today.</em>
          </h2>
          <p>
            We believe Pakistani fashion is more than what we wear. It is
            a story of artistry, identity and timeless grace.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="cinema-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLook}
          >
            <div className="cinema-lightbox-top">
              <div>
                <span>RAUNAQ / THE HERITAGE COLLECTION</span>
                <h3>{activeImage.name}</h3>
              </div>

              <button
                type="button"
                onClick={closeLook}
                aria-label="Close showcase"
              >
                <X size={23} />
              </button>
            </div>

            <motion.div
              className="cinema-lightbox-content"
              onClick={(event) => event.stopPropagation()}
              initial={{ scale: 0.84, opacity: 0, rotateY: -8 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="cinema-lightbox-image">
                <img
                  src={getImage(activeImage)}
                  alt={activeImage.name}
                />
              </div>

              <div className="cinema-lightbox-details">
                <span>{activeImage.category}</span>
                <h2>{activeImage.name}</h2>
                <p>{activeImage.description}</p>
                <small>{activeImage.color}</small>

                <div className="cinema-lightbox-arrows">
                  <button
                    type="button"
                    onClick={() => changeLook(-1)}
                    aria-label="Previous look"
                  >
                    <ArrowLeft size={19} />
                  </button>
                  <span>{activeImage.number} / 04</span>
                  <button
                    type="button"
                    onClick={() => changeLook(1)}
                    aria-label="Next look"
                  >
                    <ArrowRight size={19} />
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="cinema-lightbox-footer">
              <span>PAKISTANI FASHION HOUSE</span>
              <span>PRESS ESC TO CLOSE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}