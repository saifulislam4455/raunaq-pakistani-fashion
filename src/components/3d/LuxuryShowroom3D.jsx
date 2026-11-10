
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Crown,
  ChevronLeft,
  ChevronRight,
  Sparkles as SparkleIcon,
} from "lucide-react";

const dresses = Array.from({ length: 10 }, (_, i) => ({
  image: `/images/hero-dress/hero-${String(i + 1).padStart(2, "0")}.jpg.jpg`,
  name: `RAUNAQ Signature ${String(i + 1).padStart(2, "0")}`,
}));

/* ========================================
   GOLDEN 3D ORBIT
======================================== */

function GoldenOrbit() {
  const group = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.z += delta * 0.035;

    group.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
  });

  return (
    <group ref={group}>
      {[3.2, 3.55, 3.9].map((radius, i) => (
        <mesh key={i} rotation={[0.8 + i * 0.35, 0.3, 0]}>
          <torusGeometry args={[radius, 0.012 + i * 0.004, 8, 120]} />

          <meshStandardMaterial
            color={i === 1 ? "#e6c58d" : "#a77b43"}
            metalness={1}
            roughness={0.2}
            emissive="#8b6334"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ========================================
   RUNWAY 3D SCENE
======================================== */

function RunwayScene() {
  return (
    <>
      <color attach="background" args={["#211817"]} />
      <fog attach="fog" args={["#211817", 9, 19]} />

      <ambientLight intensity={1.5} />

      <hemisphereLight args={["#fff0d8", "#39251f", 1.2]} />

      <spotLight
        position={[3, 7, 5]}
        intensity={45}
        angle={0.65}
        penumbra={1}
        color="#f5d8a5"
      />

      <pointLight
        position={[-5, 0, 3]}
        intensity={12}
        color="#8e3545"
      />

      <pointLight
        position={[5, 1, 2]}
        intensity={15}
        color="#d6a65f"
      />

      <Float speed={0.5} floatIntensity={0.12}>
        <GoldenOrbit />
      </Float>

      <Sparkles
        count={65}
        scale={[13, 9, 8]}
        size={1.5}
        speed={0.2}
        color="#e5c48c"
      />
    </>
  );
}

/* ========================================
   MAIN SHOWROOM
======================================== */

export default function LuxuryShowroom3D() {
  const [selected, setSelected] = useState(0);
  const [dragStart, setDragStart] = useState(null);

  const stageRef = useRef(null);

  // Actual continuous rotation value
  const rotationRef = useRef(0);

  // One complete rotation takes 55 seconds
  const ROTATION_SPEED = 360 / 55;

  /* ========================================
     UPDATE RING ROTATION
  ======================================== */

  const updateRotation = () => {
    const rotation = rotationRef.current;

    stageRef.current?.style.setProperty(
      "--runway-rotation",
      `${-rotation}deg`
    );

    const currentIndex =
      Math.floor(rotation / 36) % dresses.length;

    setSelected(currentIndex);
  };

  /* ========================================
     NEXT DRESS
  ======================================== */

  const nextDress = () => {
    rotationRef.current =
      (rotationRef.current + 36) % 360;

    updateRotation();
  };

  /* ========================================
     PREVIOUS DRESS
  ======================================== */

  const previousDress = () => {
    rotationRef.current =
      (rotationRef.current - 36 + 360) % 360;

    updateRotation();
  };

  /* ========================================
     INFINITE SMOOTH ROTATION
  ======================================== */

  useEffect(() => {
    let animationFrame;
    let previousTime = 0;
    let previousIndex = -1;

    const animate = (time) => {
      if (!previousTime) {
        previousTime = time;
      }

      const delta = Math.min(
        (time - previousTime) / 1000,
        0.05
      );

      previousTime = time;

      rotationRef.current =
        (rotationRef.current + delta * ROTATION_SPEED) % 360;

      const rotation = rotationRef.current;

      stageRef.current?.style.setProperty(
        "--runway-rotation",
        `${-rotation}deg`
      );

      const currentIndex =
        Math.floor(rotation / 36) % dresses.length;

      // React only updates when another dress reaches the front
      if (currentIndex !== previousIndex) {
        setSelected(currentIndex);
        previousIndex = currentIndex;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  /* ========================================
     MOUSE DRAG
  ======================================== */

  const handlePointerDown = (event) => {
    if (event.pointerType === "touch") return;

    setDragStart(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (dragStart === null) return;

    const difference = event.clientX - dragStart;

    if (difference < -45) nextDress();
    if (difference > 45) previousDress();

    setDragStart(null);
  };

  const handlePointerCancel = () => {
    setDragStart(null);
  };

  return (
    <section
      id="home"
      className="raunaq-hero relative isolate min-h-[760px] overflow-hidden bg-[#211817] text-white sm:min-h-[820px] lg:min-h-[900px]"
    >
      <style>{`
        .raunaq-hero {
          --gold: #d6b477;
          --burgundy: #211817;
          position: relative;
          isolation: isolate;
          touch-action: pan-y;
        }

        /* 3D STAGE */

        .raunaq-stage {
          --radius: 430px;

          position: absolute;
          z-index: 2;
          top: 50%;
          right: -2%;
          width: min(76vw, 1050px);
          height: 620px;
          transform: translateY(-50%);
          perspective: 1450px;
          touch-action: pan-y;
          cursor: grab;
        }

        .raunaq-stage:active {
          cursor: grabbing;
        }

        /* ROTATING RING */

        .raunaq-ring {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transform: rotateY(var(--runway-rotation, 0deg));
          pointer-events: none;
          will-change: transform;
        }

        /* DRESS CARD */

        .raunaq-card {
          position: absolute;
          top: 50%;
          left: 50%;

          width: 230px;
          height: 345px;

          margin-left: -115px;
          margin-top: -172px;

          transform-style: preserve-3d;
          backface-visibility: hidden;

          border: 1px solid rgba(218,181,119,.75);
          border-radius: 4px;
          padding: 7px;

          background: linear-gradient(
            145deg,
            #d9b879,
            #49301f 45%,
            #a77b43
          );

          box-shadow:
            0 20px 65px rgba(0,0,0,.55),
            0 0 28px rgba(214,180,119,.12);

          overflow: hidden;
          transition: filter .6s, opacity .6s;

          pointer-events: auto;
        }

        .raunaq-card img {
          width: 100%;
          height: 100%;
          display: block;

          /* Show complete outfit */
          object-fit: contain;
          object-position: center center;

          background: #35251f;
          pointer-events: none;
        }

        .raunaq-card::after {
          content: "";
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(255,235,195,.25);
          pointer-events: none;
        }

        .raunaq-card-front {
          box-shadow:
            0 25px 85px rgba(0,0,0,.65),
            0 0 55px rgba(214,180,119,.3);
        }

        /* GOLDEN HALO */

        .raunaq-halo {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 470px;
          height: 470px;

          transform: translate(-50%,-50%);

          border: 1px solid rgba(214,180,119,.22);
          border-radius: 50%;

          box-shadow:
            0 0 75px rgba(214,180,119,.1),
            inset 0 0 70px rgba(214,180,119,.07);

          pointer-events: none;
        }

        .raunaq-halo::before,
        .raunaq-halo::after {
          content: "";
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(214,180,119,.2);
          border-radius: 50%;
        }

        .raunaq-halo::after {
          inset: 38px;
          border-style: dashed;
          opacity: .55;
        }

        /* STAGE GLOW */

        .raunaq-stage-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 600px;
          height: 600px;

          transform: translate(-50%,-50%);

          background: radial-gradient(
            circle,
            rgba(190,133,69,.16),
            transparent 65%
          );

          pointer-events: none;
        }

        /* PLATFORM */

        .raunaq-platform {
          position: absolute;
          bottom: 4%;
          left: 50%;

          width: 470px;
          height: 100px;

          transform: translateX(-50%) rotateX(68deg);

          border: 2px solid rgba(214,180,119,.6);
          border-radius: 50%;

          background: radial-gradient(
            ellipse,
            rgba(214,180,119,.2),
            rgba(75,43,30,.08) 65%,
            transparent
          );

          box-shadow: 0 0 45px rgba(214,180,119,.16);

          pointer-events: none;
        }

        /* NUMBER */

        .raunaq-stage-number {
          position: absolute;
          right: 8%;
          bottom: 7%;

          color: rgba(214,180,119,.5);
          font-family: Georgia, serif;
          font-size: 12px;
          letter-spacing: .35em;

          pointer-events: none;
        }

        /* TABLET */

        @media(max-width: 900px) {
          .raunaq-stage {
            --radius: 310px;

            top: 52%;
            right: -18%;
            width: 100%;
            height: 480px;
          }

          .raunaq-card {
            width: 175px;
            height: 265px;
            margin-left: -87.5px;
            margin-top: -132px;
          }

          .raunaq-halo {
            width: 340px;
            height: 340px;
          }

          .raunaq-platform {
            width: 330px;
          }
        }

        /* MOBILE */

        @media(max-width: 640px) {
          .raunaq-stage {
            --radius: 235px;

            top: 56%;
            right: -28%;
            width: 120%;
            height: 390px;
          }

          .raunaq-card {
            width: 140px;
            height: 215px;

            margin-left: -70px;
            margin-top: -107px;

            padding: 5px;
          }

          .raunaq-card::after {
            inset: 5px;
          }

          .raunaq-halo {
            width: 270px;
            height: 270px;
          }

          .raunaq-platform {
            width: 270px;
            bottom: 0;
          }
        }

        @media(prefers-reduced-motion: reduce) {
          .raunaq-ring {
            will-change: auto;
          }
        }
      `}</style>

      {/* =================================
          3D ENVIRONMENT
      ================================= */}

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas
          dpr={[1, 1.2]}
          camera={{ position: [0, 0, 9], fov: 45 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
          }}
        >
          <RunwayScene />
        </Canvas>
      </div>

      {/* CINEMATIC OVERLAYS */}

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#211817] via-[#211817]/90 to-[#211817]/15" />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_78%_45%,rgba(198,153,86,0.18),transparent_55%)]" />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(0,0,0,.32),transparent_30%,transparent_80%,rgba(0,0,0,.18))]" />

      {/* =================================
          INFINITE 3D RUNWAY
      ================================= */}

      <div
        ref={stageRef}
        className="raunaq-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onLostPointerCapture={handlePointerCancel}
      >
        <div className="raunaq-stage-glow" />

        <div className="raunaq-halo" />

        <div className="raunaq-platform" />

        <div className="raunaq-ring">
          {dresses.map((dress, index) => {
            const angle = index * 36;

            const distance = Math.abs(
              ((index - selected + 15) % 10) - 5
            );

            return (
              <button
                key={dress.image}
                type="button"
                aria-label={`Show ${dress.name}`}
                onClick={() => {
                  rotationRef.current = (index * 36) % 360;
                  updateRotation();
                }}
                className={`raunaq-card ${
                  index === selected ? "raunaq-card-front" : ""
                }`}
                style={{
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(var(--radius, 430px))
                  `,
                  opacity: distance > 3 ? 0.7 : 1,
                  filter:
                    distance > 2
                      ? "brightness(.65)"
                      : "brightness(1)",
                }}
              >
                <img
                  src={dress.image}
                  alt={dress.name}
                  loading="eager"
                  decoding="async"
                  draggable="false"
                />
              </button>
            );
          })}
        </div>

        <div className="raunaq-stage-number">
          {String(selected + 1).padStart(2, "0")} / 10
        </div>
      </div>

      {/* =================================
          LEFT BRAND CONTENT
      ================================= */}

      <div className="relative z-10 flex min-h-[760px] items-center px-6 pb-36 pt-24 sm:min-h-[820px] sm:px-12 lg:min-h-[900px] lg:px-[8%]">
        <div className="w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="mb-7 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#d6b477] sm:text-[10px]"
          >
            <Crown size={17} />
            Pakistani Fashion House
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="font-serif text-[64px] font-medium leading-[0.95] tracking-[0.08em] sm:text-8xl lg:text-[100px]"
          >
            RAUNAQ
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 125 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-7 h-[2px] bg-gradient-to-r from-[#e2c28d] to-transparent"
          />

          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mt-7 font-serif text-4xl leading-tight sm:text-5xl"
          >
            Wear your
            <br />
            <span className="italic text-[#d6b477]">
              heritage.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-5 max-w-[310px] text-xs leading-7 text-white/65 sm:text-sm"
          >
            Timeless Pakistani elegance.
            Reimagined for today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#collections"
              className="group flex items-center gap-4 bg-[#c8a36a] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#211817] transition duration-300 hover:bg-[#ead1a4] hover:shadow-[0_0_35px_rgba(200,163,106,0.35)]"
            >
              Explore collection

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <button
              type="button"
              onClick={nextDress}
              className="flex items-center gap-2 border border-white/35 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition hover:border-[#d6b477] hover:text-[#d6b477]"
            >
              <SparkleIcon size={14} />
              Discover more
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-10 flex items-center gap-3 text-[8px] uppercase tracking-[0.22em] text-white/45"
          >
            <span className="h-px w-8 bg-[#c8a36a]" />
            Tradition meets modern luxury
          </motion.div>
        </div>
      </div>

      {/* =================================
          CURRENT OUTFIT CONTROLS
      ================================= */}

      <div className="absolute bottom-8 right-6 z-20 sm:bottom-10 sm:right-12 lg:right-[8%]">
        <div className="border-l border-[#d6b477] bg-[#211817]/75 py-3 pl-4 pr-3 backdrop-blur-md">
          <p className="text-[8px] uppercase tracking-[0.3em] text-[#d6b477]">
            On the runway
          </p>

          <AnimatePresence mode="wait">
            <motion.p
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-2 font-serif text-xl sm:text-2xl"
            >
              {dresses[selected].name}
            </motion.p>
          </AnimatePresence>

          <div className="mt-3 flex items-center justify-between gap-5">
            <p className="text-[9px] tracking-[0.2em] text-white/50">
              {String(selected + 1).padStart(2, "0")} — 10 DESIGNS
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={previousDress}
                aria-label="Previous dress"
                className="rounded-full border border-white/30 p-2 transition hover:border-[#d6b477] hover:text-[#d6b477]"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                type="button"
                onClick={nextDress}
                aria-label="Next dress"
                className="rounded-full border border-white/30 p-2 transition hover:border-[#d6b477] hover:text-[#d6b477]"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL HINT */}

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="pointer-events-none absolute bottom-9 left-7 z-20 hidden items-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/45 sm:flex lg:left-[8%]"
      >
        Scroll to discover

        <ArrowDown size={13} className="text-[#d6b477]" />
      </motion.div>
    </section>
  );
}
