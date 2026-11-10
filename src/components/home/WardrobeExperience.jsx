import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  X,
  ShoppingBag,
  Sparkles,
  Crown,
  Play,
  Pause,
  Store,
} from "lucide-react";

const dresses = [
  { id: 1, name: "Royal Peshawari", category: "Peshawari Collection", price: 18500 },
  { id: 2, name: "Ivory Elegance", category: "Luxury Formal", price: 22000 },
  { id: 3, name: "Emerald Grace", category: "Traditional Wear", price: 16900 },
  { id: 4, name: "Midnight Royal", category: "Evening Collection", price: 19500 },
  { id: 5, name: "Rose Tradition", category: "Festive Collection", price: 17500 },
  { id: 6, name: "Golden Heritage", category: "Embroidered Wear", price: 24500 },
  { id: 7, name: "Pearl Majesty", category: "Luxury Pret", price: 21000 },
  { id: 8, name: "Crimson Queen", category: "Wedding Collection", price: 28500 },
  { id: 9, name: "Desert Bloom", category: "Traditional Wear", price: 16500 },
  { id: 10, name: "Royal Sapphire", category: "Formal Collection", price: 23000 },
  { id: 11, name: "Blush Heritage", category: "Festive Collection", price: 18000 },
  { id: 12, name: "Golden Noor", category: "Signature Collection", price: 26000 },
].map((dress) => ({
  ...dress,
  image: `/images/raunaq-dresses/dress-${String(dress.id).padStart(2, "0")}.jpg.jpg`,
}));

const money = (value) => `Rs. ${value.toLocaleString("en-PK")}`;
const wrapIndex = (index) => (index + dresses.length) % dresses.length;

export default function WardrobeExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [direction, setDirection] = useState(1);

  const touchStart = useRef(null);
  const wheelLock = useRef(false);
  const activeDress = dresses[activeIndex];

  const nextDress = () => {
    setDirection(1);
    setActiveIndex((current) => wrapIndex(current + 1));
  };

  const previousDress = () => {
    setDirection(-1);
    setActiveIndex((current) => wrapIndex(current - 1));
  };

  useEffect(() => {
    if (paused || selected) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => wrapIndex(current + 1));
    }, 4500);

    return () => window.clearInterval(timer);
  }, [paused, selected]);

  useEffect(() => {
    if (!selected) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") setSelected(null);

      if (event.key === "ArrowRight") {
        setSelected((current) =>
          current ? dresses[wrapIndex(current.id)] : null
        );
      }

      if (event.key === "ArrowLeft") {
        setSelected((current) =>
          current ? dresses[wrapIndex(current.id - 2)] : null
        );
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [selected]);

  const openDress = () => {
    setSelected(activeDress);
    setSelectedSize("M");
    setPaused(true);
  };

  const showDress = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setPaused(true);
  };

  const handleWheel = (event) => {
    if (selected || wheelLock.current) return;
    if (Math.abs(event.deltaY) < 25) return;

    wheelLock.current = true;

    if (event.deltaY > 0) nextDress();
    else previousDress();

    window.setTimeout(() => {
      wheelLock.current = false;
    }, 1000);
  };

  const handleTouchStart = (event) => {
    touchStart.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;

    const difference =
      event.changedTouches[0].clientX - touchStart.current;

    if (difference < -55) nextDress();
    if (difference > 55) previousDress();

    touchStart.current = null;
  };

  const renderRack = (items, side) => (
    <div className={`boutique-rack ${side}`}>
      <div className="boutique-rack-frame" />

      <div className="boutique-rack-items">
        {items.map((dress) => (
          <button
            type="button"
            key={dress.id}
            className={`boutique-rack-item ${
              activeDress.id === dress.id ? "active" : ""
            }`}
            onClick={() => showDress(dress.id - 1)}
            aria-label={`View ${dress.name}`}
          >
            <span className="boutique-hanger">
              <span className="boutique-hanger-hook" />
              <span className="boutique-hanger-shoulder" />
            </span>

            <span className="boutique-rack-photo">
              <img
                src={dress.image}
                alt={dress.name}
                loading="lazy"
              />
            </span>

            <span className="boutique-rack-name">
              {dress.name}
            </span>
          </button>
        ))}
      </div>

      <div className="boutique-rack-base" />
    </div>
  );

  return (
    <section className="raunaq-boutique">
      <style>{`
        .raunaq-boutique {
          --gold: #dfbd83;
          --gold-light: #f4dfb8;
          position: relative;
          isolation: isolate;
          width: 100%;
          padding: 105px 24px 85px;
          overflow: hidden;
          color: #fff7ed;
          background:
            radial-gradient(ellipse at 50% 45%, #503334 0%, transparent 50%),
            linear-gradient(145deg, #1b1012, #10090b 65%, #211416);
        }

        .raunaq-boutique *,
        .raunaq-boutique *::before,
        .raunaq-boutique *::after {
          box-sizing: border-box;
        }

        .boutique-lighting {
          position: absolute;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .boutique-glow {
          position: absolute;
          top: 40%;
          left: 50%;
          width: 900px;
          height: 800px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(174, 119, 75, .17);
          filter: blur(110px);
        }

        .boutique-beam {
          position: absolute;
          top: -20%;
          left: 50%;
          width: 250px;
          height: 110%;
          transform: translateX(-50%);
          background: linear-gradient(
            180deg,
            rgba(248,215,166,.16),
            rgba(248,215,166,.025) 65%,
            transparent
          );
          filter: blur(35px);
          animation: boutiqueBeam 9s ease-in-out infinite alternate;
        }

        .boutique-beam.second {
          left: 20%;
          width: 150px;
          opacity: .5;
          animation-delay: -4s;
        }

        @keyframes boutiqueBeam {
          from { transform: translateX(-70%) rotate(-12deg); }
          to { transform: translateX(-20%) rotate(13deg); }
        }

        .boutique-heading {
          position: relative;
          z-index: 5;
          max-width: 900px;
          margin: 0 auto 55px;
          text-align: center;
        }

        .boutique-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: var(--gold);
          font-size: 10px;
          letter-spacing: 5px;
        }

        .boutique-eyebrow-line {
          width: 35px;
          height: 1px;
          background: var(--gold);
        }

        .boutique-heading h2 {
          margin: 22px 0 15px;
          color: #fff7ed;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(43px, 6.5vw, 78px);
          font-weight: 400;
          line-height: 1.04;
          letter-spacing: -2px;
        }

        .boutique-heading h2 em {
          color: var(--gold);
          font-weight: 400;
        }

        .boutique-heading p {
          max-width: 580px;
          margin: auto;
          color: rgba(255,244,230,.63);
          font-size: 13px;
          line-height: 2;
        }

        .boutique-topbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto 17px;
        }

        .boutique-brand-label {
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 3px;
        }

        .boutique-active-name {
          margin-top: 8px;
          color: white;
          font-family: Georgia, serif;
          font-size: 19px;
        }

        .boutique-counter {
          margin-top: 5px;
          color: rgba(255,255,255,.4);
          font-size: 9px;
          letter-spacing: 2px;
        }

        .boutique-pause {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 19px;
          border: 1px solid rgba(216,183,126,.42);
          border-radius: 40px;
          color: #f6e8d1;
          background: rgba(255,255,255,.04);
          font-size: 9px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: .25s;
        }

        .boutique-pause:hover {
          color: #170e10;
          background: var(--gold);
        }

        /* SHOWROOM */

        .boutique-scene {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: 800px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(216,183,126,.28);
          border-radius: 26px;
          background:
            radial-gradient(ellipse at 50% 40%, rgba(151,105,77,.23), transparent 57%),
            linear-gradient(180deg, #332020 0%, #211416 58%, #130c0e 100%);
          perspective: 1400px;
          transform-style: preserve-3d;
          box-shadow: 0 35px 100px rgba(0,0,0,.4);
          touch-action: pan-y;
        }

        .boutique-scene::before {
          content: "";
          position: absolute;
          inset: 12px;
          z-index: 15;
          border: 1px solid rgba(216,183,126,.15);
          border-radius: 19px;
          pointer-events: none;
        }

        .boutique-back-wall {
          position: absolute;
          top: 0;
          right: 7%;
          left: 7%;
          height: 54%;
          border-right: 1px solid rgba(216,183,126,.1);
          border-left: 1px solid rgba(216,183,126,.1);
          background:
            linear-gradient(90deg, transparent 49.8%, rgba(216,183,126,.07) 50%, transparent 50.2%),
            repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 24.5%,
              rgba(216,183,126,.045) 25%,
              transparent 25.5%
            ),
            linear-gradient(180deg, rgba(255,255,255,.025), transparent);
        }

        .boutique-back-wall::before {
          content: "RAUNAQ";
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(235,202,151,.55);
          font-family: Georgia, serif;
          font-size: clamp(23px, 4vw, 45px);
          letter-spacing: 12px;
          text-shadow: 0 0 35px rgba(223,189,131,.3);
        }

        .boutique-back-wall::after {
          content: "PAKISTANI FASHION HOUSE";
          position: absolute;
          top: 83px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,.28);
          font-size: 8px;
          letter-spacing: 5px;
          white-space: nowrap;
        }

        .boutique-wall-light {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 200px;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(229,185,121,.13), transparent 70%);
        }

        /* RACKS */

        .boutique-rack {
          position: absolute;
          top: 21%;
          z-index: 2;
          width: 43%;
          height: 510px;
          transform-style: preserve-3d;
          opacity: 1;
        }

        .boutique-rack.left {
          left: -1%;
          transform: perspective(1000px) rotateY(15deg);
        }

        .boutique-rack.right {
          right: -1%;
          transform: perspective(1000px) rotateY(-15deg);
        }

        .boutique-rack-frame {
          position: absolute;
          top: 0;
          right: 3%;
          left: 3%;
          height: 12px;
          border: 1px solid #b58c56;
          border-radius: 5px;
          background: linear-gradient(180deg, #f0d19b, #76512e);
          box-shadow: 0 0 25px rgba(216,183,126,.3);
        }

        .boutique-rack-frame::before,
        .boutique-rack-frame::after {
          content: "";
          position: absolute;
          top: 0;
          width: 7px;
          height: 500px;
          background: linear-gradient(90deg, #7c5634, #e3bf83, #72502e);
          border-radius: 4px;
        }

        .boutique-rack-frame::before { left: 0; }
        .boutique-rack-frame::after { right: 0; }

        .boutique-rack-base {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 9px;
          border-radius: 5px;
          background: linear-gradient(90deg, #79532e, #e3c18a, #79532e);
          box-shadow: 0 0 20px rgba(223,189,131,.18);
        }

        .boutique-rack-items {
          position: absolute;
          top: 16px;
          right: 8%;
          left: 8%;
          display: flex;
          align-items: stretch;
          justify-content: space-around;
          gap: 5px;
          height: 480px;
        }

        .boutique-rack-item {
          position: relative;
          display: flex;
          flex: 1;
          min-width: 0;
          height: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          transform-origin: top center;
          transition: transform .4s ease, filter .4s ease;
        }

        .boutique-rack-item:hover {
          z-index: 4;
          transform: translateY(-7px) scale(1.06);
          filter: brightness(1.2);
        }

        .boutique-hanger {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 3;
          width: 100%;
          height: 28px;
          transform: translateX(-50%);
        }

        .boutique-hanger-hook {
          position: absolute;
          top: -11px;
          left: 50%;
          width: 9px;
          height: 17px;
          transform: translateX(-50%);
          border: 2px solid #e5c38f;
          border-bottom: 0;
          border-radius: 9px 9px 0 0;
        }

        .boutique-hanger-shoulder {
          position: absolute;
          top: 5px;
          left: 50%;
          width: 85%;
          height: 18px;
          transform: translateX(-50%);
          border-top: 2px solid #e5c38f;
          border-left: 2px solid #e5c38f;
          border-right: 2px solid #e5c38f;
          clip-path: polygon(0 0, 50% 100%, 100% 0, 100% 20%, 50% 100%, 0 20%);
          filter: drop-shadow(0 2px 3px rgba(0,0,0,.7));
        }

        .boutique-rack-photo {
          position: absolute;
          top: 25px;
          right: 0;
          bottom: 18px;
          left: 0;
          display: flex;
          align-items: stretch;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(216,183,126,.25);
          border-radius: 5px 5px 12px 12px;
          background: linear-gradient(145deg, rgba(96,68,71,.45), rgba(40,25,28,.55));
          box-shadow: 0 15px 25px rgba(0,0,0,.3);
        }

        .boutique-rack-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center top;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,.4));
          transition: transform .5s ease, filter .5s ease;
        }

        .boutique-rack-item:hover .boutique-rack-photo img {
          transform: scale(1.09) translateZ(20px);
          filter: drop-shadow(0 15px 15px rgba(0,0,0,.5));
        }

        .boutique-rack-item.active .boutique-rack-photo {
          border-color: var(--gold);
          box-shadow: 0 0 22px rgba(223,189,131,.4);
        }

        .boutique-rack-name {
          position: absolute;
          right: 0;
          bottom: -16px;
          left: 0;
          overflow: hidden;
          color: rgba(244,223,184,.65);
          font-size: 7px;
          text-align: center;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* LIGHTS */

        .boutique-ceiling {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 75px;
          display: flex;
          justify-content: space-around;
          padding: 18px 15%;
          background: linear-gradient(180deg, rgba(0,0,0,.3), transparent);
        }

        .boutique-ceiling span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffe2ad;
          box-shadow: 0 0 15px 7px rgba(238,192,125,.27);
        }

        /* FLOOR */

        .boutique-floor {
          position: absolute;
          right: -15%;
          bottom: -23%;
          left: -15%;
          height: 48%;
          transform: rotateX(68deg);
          transform-origin: top center;
          background:
            repeating-linear-gradient(90deg, transparent 0, transparent 18%, rgba(216,183,126,.1) 18.2%, transparent 18.5%),
            repeating-linear-gradient(0deg, transparent 0, transparent 24%, rgba(216,183,126,.09) 24.3%, transparent 24.6%),
            linear-gradient(135deg, #4a3430, #171012);
          border-top: 2px solid rgba(216,183,126,.35);
          box-shadow: 0 -15px 50px rgba(0,0,0,.4);
        }

        .boutique-floor-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 700px;
          height: 250px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(221,176,113,.22), transparent 70%);
          filter: blur(25px);
        }

        /* CENTER DRESS */

        .boutique-center-stage {
          position: absolute;
          top: 9%;
          left: 50%;
          z-index: 5;
          width: min(49%, 650px);
          height: 85%;
          transform: translateX(-50%);
          transform-style: preserve-3d;
        }

        .boutique-display-glow {
          position: absolute;
          top: 15%;
          left: 50%;
          width: 90%;
          height: 75%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(225,178,111,.27), transparent 67%);
          filter: blur(25px);
        }

        .boutique-display-halo {
          position: absolute;
          top: 24%;
          left: 50%;
          width: 78%;
          height: 60%;
          transform: translateX(-50%) rotateX(65deg);
          border: 1px solid rgba(223,189,131,.3);
          border-radius: 50%;
          box-shadow: 0 0 35px rgba(223,189,131,.12);
        }

        .boutique-display-halo::before {
          content: "";
          position: absolute;
          inset: 25px;
          border: 1px dashed rgba(223,189,131,.22);
          border-radius: 50%;
        }

        .boutique-main-dress {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
        }

        .boutique-main-image {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 45px 35px 105px;
          transform-style: preserve-3d;
          perspective: 1200px;
        }

        .boutique-main-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
          transform-style: preserve-3d;
          transform: translateZ(65px);
          filter:
            drop-shadow(0 25px 25px rgba(0,0,0,.5))
            drop-shadow(0 0 25px rgba(223,189,131,.2));
          animation: boutiqueDress3D 6s ease-in-out infinite;
          user-select: none;
          -webkit-user-drag: none;
        }

        @keyframes boutiqueDress3D {
          0%, 100% {
            transform: translateZ(55px) rotateY(-7deg) rotateX(1deg) scale(1);
          }
          50% {
            transform: translateZ(95px) rotateY(7deg) rotateX(-2deg) scale(1.045);
          }
        }

        .boutique-dress-label {
          position: absolute;
          top: 12px;
          left: 50%;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 17px;
          transform: translateX(-50%);
          border: 1px solid rgba(216,183,126,.48);
          border-radius: 40px;
          color: var(--gold-light);
          background: rgba(24,14,15,.82);
          font-size: 8px;
          letter-spacing: 2px;
          white-space: nowrap;
          backdrop-filter: blur(10px);
        }

        .boutique-dress-details {
          position: absolute;
          right: 0;
          bottom: 12px;
          left: 0;
          z-index: 8;
          text-align: center;
          pointer-events: none;
          text-shadow: 0 5px 25px #160d0e;
        }

        .boutique-dress-details span {
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 3px;
        }

        .boutique-dress-details h3 {
          margin: 8px 0 5px;
          color: #fff7ed;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(25px, 3vw, 38px);
          font-weight: 400;
        }

        .boutique-dress-details p {
          margin: 0;
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .boutique-discover {
          position: absolute;
          bottom: 108px;
          left: 50%;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 19px;
          transform: translateX(-50%);
          border: 1px solid rgba(216,183,126,.6);
          border-radius: 40px;
          color: #f6e8d1;
          background: rgba(24,14,15,.86);
          font-size: 8px;
          letter-spacing: 2px;
          white-space: nowrap;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .boutique-discover:hover {
          color: #1b1112;
          background: var(--gold);
        }

        .boutique-pedestal {
          position: absolute;
          bottom: 1%;
          left: 50%;
          z-index: 4;
          width: 180px;
          height: 43px;
          transform: translateX(-50%);
          border: 1px solid rgba(240,210,165,.7);
          border-radius: 50%;
          background: linear-gradient(180deg, #c59a61, #503622 60%, #251919);
          box-shadow: 0 0 35px rgba(216,183,126,.32), 0 20px 35px rgba(0,0,0,.55);
        }

        .boutique-pedestal::before {
          content: "";
          position: absolute;
          top: -10px;
          right: 13px;
          left: 13px;
          height: 15px;
          border: 1px solid rgba(255,224,178,.75);
          border-radius: 50%;
          background: linear-gradient(180deg, #e5c38f, #8d653d);
        }

        /* LABELS */

        .boutique-side-label {
          position: absolute;
          top: 46%;
          z-index: 6;
          color: rgba(239,207,157,.6);
          font-size: 8px;
          letter-spacing: 4px;
          writing-mode: vertical-rl;
        }

        .boutique-side-label.left {
          left: 17px;
          transform: rotate(180deg);
        }

        .boutique-side-label.right {
          right: 17px;
        }

        .boutique-shop-caption {
          position: absolute;
          right: 20px;
          bottom: 22px;
          left: 20px;
          z-index: 12;
          display: flex;
          justify-content: space-between;
          color: rgba(255,255,255,.37);
          font-size: 8px;
          letter-spacing: 2px;
          pointer-events: none;
        }

        /* CONTROLS */

        .boutique-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          margin-top: 30px;
        }

        .boutique-arrow {
          display: grid;
          width: 48px;
          height: 48px;
          place-items: center;
          border: 1px solid rgba(216,183,126,.5);
          border-radius: 50%;
          color: var(--gold);
          background: rgba(255,255,255,.03);
          cursor: pointer;
          transition: .25s;
        }

        .boutique-arrow:hover {
          color: #1b1112;
          background: var(--gold);
          transform: scale(1.08);
        }

        .boutique-control-copy {
          min-width: 240px;
          text-align: center;
        }

        .boutique-control-copy p {
          margin: 0;
          color: rgba(255,255,255,.72);
          font-size: 9px;
          letter-spacing: 2px;
        }

        .boutique-control-copy span {
          display: block;
          margin-top: 8px;
          color: var(--gold);
          font-size: 8px;
          letter-spacing: 2px;
        }

        .boutique-progress {
          width: min(360px, 75%);
          height: 2px;
          margin: 28px auto 0;
          overflow: hidden;
          background: rgba(255,255,255,.15);
        }

        .boutique-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #a97d4d, #f0d6a9);
          box-shadow: 0 0 12px rgba(216,183,126,.5);
        }

        .boutique-footer-note {
          margin: 24px auto 0;
          color: rgba(255,255,255,.33);
          font-size: 8px;
          letter-spacing: 3px;
          text-align: center;
        }

        /* MODAL */

        .boutique-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
          background: rgba(8,4,5,.94);
          backdrop-filter: blur(20px);
        }

        .boutique-modal {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: min(1000px, 100%);
          max-height: 92vh;
          overflow: auto;
          border: 1px solid rgba(216,183,126,.35);
          border-radius: 22px;
          background: #241719;
        }

        .boutique-modal-image {
          position: relative;
          display: flex;
          min-height: 540px;
          align-items: center;
          justify-content: center;
          padding: 25px;
          background: #eee5d9;
        }

        .boutique-modal-image img {
          width: 100%;
          max-height: 75vh;
          object-fit: contain;
        }

        .boutique-modal-tag {
          position: absolute;
          bottom: 20px;
          left: 20px;
          padding: 9px 13px;
          color: #f3d8aa;
          background: rgba(28,16,17,.85);
          font-size: 8px;
          letter-spacing: 2px;
        }

        .boutique-modal-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 45px;
        }

        .boutique-modal-kicker {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 3px;
        }

        .boutique-modal-content h2 {
          margin: 22px 0 0;
          color: #fff7ed;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(35px, 4vw, 53px);
          font-weight: 400;
        }

        .boutique-modal-category {
          margin: 13px 0 0;
          color: rgba(255,255,255,.45);
          font-size: 12px;
        }

        .boutique-modal-price {
          margin-top: 26px;
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 29px;
        }

        .boutique-modal-divider {
          height: 1px;
          margin: 23px 0;
          background: rgba(216,183,126,.2);
        }

        .boutique-modal-description {
          color: rgba(255,255,255,.58);
          font-size: 12px;
          line-height: 2;
        }

        .boutique-size-heading {
          margin: 25px 0 13px;
          color: var(--gold);
          font-size: 9px;
          letter-spacing: 3px;
        }

        .boutique-sizes {
          display: flex;
          gap: 10px;
        }

        .boutique-size {
          width: 43px;
          height: 43px;
          border: 1px solid rgba(216,183,126,.35);
          border-radius: 50%;
          color: white;
          background: transparent;
          font-size: 11px;
          cursor: pointer;
        }

        .boutique-size.active,
        .boutique-size:hover {
          color: #1b1112;
          background: var(--gold);
        }

        .boutique-add {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 29px;
          padding: 17px;
          border: 0;
          color: #1b1112;
          background: linear-gradient(110deg, #bd925e, #f0d4a4);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
        }

        .boutique-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 50%;
          color: white;
          background: rgba(0,0,0,.6);
          cursor: pointer;
        }

        .boutique-modal-footer {
          margin-top: 22px;
          color: rgba(255,255,255,.3);
          font-size: 8px;
          letter-spacing: 2px;
          text-align: center;
        }

        /* TABLET */

        @media (max-width: 950px) {
          .raunaq-boutique { padding: 85px 15px; }
          .boutique-scene { height: 690px; }
          .boutique-rack { top: 24%; width: 43%; height: 390px; }
          .boutique-rack-frame::before,
          .boutique-rack-frame::after { height: 380px; }
          .boutique-rack-items { height: 360px; }
          .boutique-center-stage { top: 13%; width: 55%; height: 80%; }
          .boutique-main-image { padding: 40px 25px 100px; }
          .boutique-modal-content { padding: 30px; }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .raunaq-boutique { padding: 65px 9px; }
          .boutique-heading { margin-bottom: 35px; }
          .boutique-heading h2 { font-size: 40px; }
          .boutique-heading p { font-size: 11px; }
          .boutique-eyebrow { font-size: 8px; letter-spacing: 2px; }
          .boutique-topbar { padding: 0 4px; }
          .boutique-active-name { font-size: 15px; }
          .boutique-pause { padding: 10px 12px; font-size: 8px; }
          .boutique-scene { height: 610px; border-radius: 17px; }
          .boutique-scene::before { inset: 7px; }
          .boutique-back-wall { right: 4%; left: 4%; height: 45%; }
          .boutique-back-wall::before { top: 24px; letter-spacing: 7px; }
          .boutique-back-wall::after { top: 66px; font-size: 6px; letter-spacing: 3px; }

          .boutique-rack {
            top: 27%;
            width: 47%;
            height: 260px;
            opacity: .8;
          }

          .boutique-rack.left { left: -22%; }
          .boutique-rack.right { right: -22%; }

          .boutique-rack-frame::before,
          .boutique-rack-frame::after { height: 250px; }

          .boutique-rack-items {
            top: 14px;
            height: 235px;
            gap: 2px;
          }

          .boutique-rack-photo {
            top: 22px;
            bottom: 14px;
          }

          .boutique-rack-name { font-size: 5px; }
          .boutique-hanger-shoulder { width: 75%; }

          .boutique-center-stage {
            top: 14%;
            width: 78%;
            height: 79%;
          }

          .boutique-main-image {
            padding: 40px 10px 100px;
          }

          .boutique-main-image img {
            transform: translateZ(35px);
          }

          .boutique-dress-label {
            top: 12px;
            font-size: 7px;
            padding: 8px 12px;
          }

          .boutique-dress-details { bottom: 13px; }
          .boutique-dress-details h3 { font-size: 25px; }
          .boutique-dress-details p { font-size: 15px; }
          .boutique-discover { bottom: 98px; font-size: 7px; padding: 10px 14px; }
          .boutique-pedestal { bottom: 1%; width: 130px; height: 32px; }
          .boutique-side-label { display: none; }
          .boutique-shop-caption { font-size: 6px; letter-spacing: 1px; }
          .boutique-controls { gap: 12px; margin-top: 22px; }
          .boutique-arrow { width: 42px; height: 42px; }
          .boutique-control-copy { min-width: 180px; }
          .boutique-control-copy p { font-size: 8px; }
          .boutique-control-copy span { font-size: 7px; }

          .boutique-modal-backdrop { padding: 10px; }

          .boutique-modal {
            grid-template-columns: 1fr;
            max-width: 430px;
            max-height: 94vh;
          }

          .boutique-modal-image { min-height: 300px; height: 330px; }
          .boutique-modal-content { padding: 25px; }
          .boutique-modal-content h2 { font-size: 37px; }
        }

        @media (max-width: 380px) {
          .boutique-scene { height: 560px; }
          .boutique-heading h2 { font-size: 35px; }
          .boutique-center-stage { width: 82%; }
          .boutique-dress-details h3 { font-size: 22px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .raunaq-boutique *,
          .raunaq-boutique *::before,
          .raunaq-boutique *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* LIGHTING */}
      <div className="boutique-lighting">
        <div className="boutique-glow" />
        <div className="boutique-beam" />
        <div className="boutique-beam second" />
      </div>

      {/* HEADING */}
      <div className="boutique-heading">
        <motion.div
          className="boutique-eyebrow"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="boutique-eyebrow-line" />
          <Sparkles size={14} />
          THE ART OF PAKISTANI COUTURE
          <Sparkles size={14} />
          <span className="boutique-eyebrow-line" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: .8 }}
        >
          Enter the World of
          <br />
          <em>RAUNAQ Boutique.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .15 }}
        >
          Walk into a world of Pakistani craftsmanship, timeless beauty
          and extraordinary fashion. Explore every creation in our
          signature boutique.
        </motion.p>
      </div>

      {/* TOP BAR */}
      <div className="boutique-topbar">
        <div>
          <div className="boutique-brand-label">
            <Crown size={12} style={{ display: "inline", marginRight: 7 }} />
            RAUNAQ SIGNATURE SHOWROOM
          </div>

          <div className="boutique-active-name">{activeDress.name}</div>

          <div className="boutique-counter">
            LOOK {String(activeIndex + 1).padStart(2, "0")} / 12
          </div>
        </div>

        <button
          type="button"
          className="boutique-pause"
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={13} /> : <Pause size={13} />}
          {paused ? "RESUME SHOW" : "PAUSE SHOW"}
        </button>
      </div>

      {/* SHOWROOM */}
      <div
        className="boutique-scene"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="boutique-back-wall">
          <div className="boutique-wall-light" />
        </div>

        <div className="boutique-ceiling">
          {Array.from({ length: 7 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>

        {/* LEFT RACK: 6 DRESSES */}
        {renderRack(dresses.slice(0, 6), "left")}

        {/* RIGHT RACK: 6 DRESSES */}
        {renderRack(dresses.slice(6, 12), "right")}

        <div className="boutique-floor" />
        <div className="boutique-floor-glow" />

        <div className="boutique-side-label left">
          PAKISTANI COUTURE
        </div>

        <div className="boutique-side-label right">
          SIGNATURE COLLECTION
        </div>

        {/* CENTER SHOWCASE */}
        <div className="boutique-center-stage">
          <div className="boutique-display-glow" />
          <div className="boutique-display-halo" />

          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={activeDress.id}
              className="boutique-main-dress"
              initial={{
                opacity: 0,
                scale: .7,
                y: 55,
                rotateY: direction * 30,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotateY: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: .8,
                y: -25,
                rotateY: direction * -20,
                filter: "blur(7px)",
              }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="boutique-dress-label">
                <Crown size={12} />
                RAUNAQ EXCLUSIVE DESIGN
              </div>

              <motion.div
                className="boutique-main-image"
                initial={{ scale: .85, rotateX: 8 }}
                animate={{ scale: 1, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.img
                  src={activeDress.image}
                  alt={activeDress.name}
                  draggable="false"
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 4.5, ease: "easeInOut" }}
                  onError={(event) => {
                    event.currentTarget.style.opacity = "0";
                  }}
                />
              </motion.div>

              <div className="boutique-dress-details">
                <span>{activeDress.category}</span>
                <h3>{activeDress.name}</h3>
                <p>{money(activeDress.price)}</p>
              </div>

              <motion.button
                type="button"
                className="boutique-discover"
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: .96 }}
                onClick={openDress}
              >
                DISCOVER THIS LOOK
                <ArrowUpRight size={15} />
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <div className="boutique-pedestal" />
        </div>

        <div className="boutique-shop-caption">
          <span>
            <Store size={11} style={{ display: "inline", marginRight: 6 }} />
            RAUNAQ BOUTIQUE
          </span>
          <span>ROOTED IN HERITAGE · DESIGNED FOR TODAY</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="boutique-controls">
        <motion.button
          type="button"
          className="boutique-arrow"
          onClick={previousDress}
          whileTap={{ scale: .9 }}
          aria-label="Previous dress"
        >
          <ArrowLeft size={19} />
        </motion.button>

        <div className="boutique-control-copy">
          <p>EXPLORE THE SHOWROOM</p>
          <span>SCROLL TO DISCOVER EACH MASTERPIECE</span>
        </div>

        <motion.button
          type="button"
          className="boutique-arrow"
          onClick={nextDress}
          whileTap={{ scale: .9 }}
          aria-label="Next dress"
        >
          <ArrowRight size={19} />
        </motion.button>
      </div>

      <div className="boutique-progress">
        <motion.div
          className="boutique-progress-fill"
          animate={{
            width: `${((activeIndex + 1) / dresses.length) * 100}%`,
          }}
          transition={{ duration: .5 }}
        />
      </div>

      <div className="boutique-footer-note">
        RAUNAQ · ROOTED IN HERITAGE · DESIGNED FOR TODAY
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="boutique-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelected(null);
              }
            }}
          >
            <motion.div
              className="boutique-modal"
              initial={{ opacity: 0, scale: .93, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .96, y: 20 }}
              transition={{ duration: .4 }}
            >
              <button
                type="button"
                className="boutique-modal-close"
                onClick={() => setSelected(null)}
                aria-label="Close product"
              >
                <X size={20} />
              </button>

              <div className="boutique-modal-image">
                <motion.img
                  key={selected.id}
                  src={selected.image}
                  alt={selected.name}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: .6 }}
                />

                <div className="boutique-modal-tag">
                  RAUNAQ SIGNATURE LOOK
                </div>
              </div>

              <div className="boutique-modal-content">
                <div className="boutique-modal-kicker">
                  <Crown size={14} />
                  EXCLUSIVE RAUNAQ CREATION
                </div>

                <h2>{selected.name}</h2>

                <p className="boutique-modal-category">
                  {selected.category}
                </p>

                <div className="boutique-modal-price">
                  {money(selected.price)}
                </div>

                <div className="boutique-modal-divider" />

                <p className="boutique-modal-description">
                  Discover the beauty of Pakistani fashion with this
                  exclusive RAUNAQ creation. Inspired by traditional
                  craftsmanship and designed with contemporary elegance,
                  this look brings timeless character to your wardrobe.
                </p>

                <div className="boutique-size-heading">
                  SELECT YOUR SIZE
                </div>

                <div className="boutique-sizes">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={`boutique-size ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <motion.button
                  type="button"
                  className="boutique-add"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: .98 }}
                  onClick={() => {
                    alert(
                      `Selected: ${selected.name} | Size: ${selectedSize}`
                    );
                  }}
                >
                  <ShoppingBag size={17} />
                  ADD TO BAG
                  <ArrowUpRight size={17} />
                </motion.button>

                <div className="boutique-modal-footer">
                  ROOTED IN HERITAGE · DESIGNED FOR TODAY
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}