
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* GARMENT COLLECTION */

const garments = [
  { color: "#641c2c", x: -3.4, scale: 0.78, speed: 0.8 },
  { color: "#b58a53", x: -1.75, scale: 0.91, speed: 1.1 },
  { color: "#e8dfd0", x: 0, scale: 1.05, speed: 0.9 },
  { color: "#263d36", x: 1.75, scale: 0.91, speed: 1.2 },
  { color: "#873d42", x: 3.4, scale: 0.78, speed: 0.85 },
];

/* GOLD RAIL */

function GoldRail() {
  return (
    <group>
      {/* Horizontal hanging rod */}
      <mesh
        position={[0, 2.8, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.045, 0.045, 9.5, 32]} />
        <meshStandardMaterial
          color="#c9a66b"
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {/* Supports */}
      {[-4.55, 4.55].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.75, 0]}>
            <cylinderGeometry args={[0.035, 0.055, 4.1, 24]} />
            <meshStandardMaterial
              color="#b48b52"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          <mesh
            position={[x, -1.32, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.055, 0.055, 0.5, 24]} />
            <meshStandardMaterial color="#c9a66b" metalness={0.9} />
          </mesh>

          <mesh position={[x, 2.8, 0]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshStandardMaterial
              color="#e1bd7d"
              metalness={1}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* GOLD HANGER */

function Hanger() {
  return (
    <group position={[0, 1.02, 0]}>
      <mesh position={[0, 0.24, 0]}>
        <torusGeometry args={[0.105, 0.014, 12, 32, Math.PI * 1.7]} />
        <meshStandardMaterial color="#d5b47b" metalness={1} roughness={0.18} />
      </mesh>

      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.2, 12]} />
        <meshStandardMaterial color="#d5b47b" metalness={1} />
      </mesh>

      <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.92, 12]} />
        <meshStandardMaterial color="#d5b47b" metalness={1} roughness={0.2} />
      </mesh>

      <mesh position={[0, -0.02, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#f0d29b" metalness={1} />
      </mesh>
    </group>
  );
}

/* DRESS GEOMETRY */

function createDressGeometry() {
  const shape = new THREE.Shape();

  shape.moveTo(-0.17, 0.88);
  shape.bezierCurveTo(-0.24, 0.88, -0.38, 0.78, -0.46, 0.7);

  shape.lineTo(-0.64, 0.43);
  shape.lineTo(-0.46, 0.27);
  shape.lineTo(-0.31, 0.49);

  shape.lineTo(-0.29, -0.16);
  shape.bezierCurveTo(-0.38, -0.55, -0.55, -0.95, -0.68, -1.28);

  shape.quadraticCurveTo(0, -1.42, 0.68, -1.28);

  shape.bezierCurveTo(0.55, -0.95, 0.38, -0.55, 0.29, -0.16);

  shape.lineTo(0.31, 0.49);
  shape.lineTo(0.46, 0.27);
  shape.lineTo(0.64, 0.43);
  shape.lineTo(0.46, 0.7);

  shape.bezierCurveTo(0.38, 0.78, 0.24, 0.88, 0.17, 0.88);
  shape.quadraticCurveTo(0, 0.57, -0.17, 0.88);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 20,
  });
}

/* DRESS EMBROIDERY */

function DressDetails() {
  return (
    <group>
      <mesh position={[0, -0.18, 0.115]}>
        <torusGeometry args={[0.28, 0.012, 8, 48]} />
        <meshStandardMaterial
          color="#d7b779"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>

      {[0.45, 0.27, 0.09].map((y) => (
        <mesh key={y} position={[0, y, 0.17]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial
            color="#e7c68b"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.65, 0.12]}>
        <boxGeometry args={[0.018, 0.75, 0.015]} />
        <meshStandardMaterial
          color="#d7b779"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

/* HANGING DRESS */

function Dress({ color, x, scale, speed }) {
  const dressRef = useRef(null);
  const elapsed = useRef(0);

  const geometry = useMemo(() => createDressGeometry(), []);

  useFrame((_, delta) => {
    elapsed.current += delta;

    if (dressRef.current) {
      const time = elapsed.current;

      dressRef.current.rotation.z =
        Math.sin(time * speed + x) * 0.035;

      dressRef.current.rotation.y =
        Math.sin(time * 0.35 + x) * 0.045;
    }
  });

  return (
    <group position={[x, 1.2, 0]} scale={scale}>
      <group ref={dressRef}>
        <Hanger />

        <mesh geometry={geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={color}
            roughness={0.43}
            metalness={0.05}
            clearcoat={0.3}
            clearcoatRoughness={0.35}
            sheen={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>

        <DressDetails />
      </group>
    </group>
  );
}

/* COMPLETE SHOWROOM SCENE */

function WardrobeScene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.45, 12]}
        fov={38}
      />

      <color attach="background" args={["#f3ecdf"]} />

      <ambientLight intensity={1.1} />

      <hemisphereLight args={["#fff4e5", "#8c6950", 1.1]} />

      <spotLight
        position={[0, 8, 6]}
        intensity={110}
        angle={0.65}
        penumbra={1}
        castShadow
      />

      <pointLight
        position={[-5, 1, 4]}
        intensity={35}
        color="#e7bd82"
      />

      <pointLight
        position={[5, 2, -2]}
        intensity={30}
        color="#b56c75"
      />

      <Float speed={1} rotationIntensity={0.008} floatIntensity={0.035}>
        <GoldRail />

        {garments.map((garment, index) => (
          <Dress key={index} {...garment} />
        ))}
      </Float>

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.25}
        scale={12}
        blur={3}
        far={4}
      />

      <Environment preset="studio" />
    </>
  );
}

/* BOUTIQUE HERO */

export default function BoutiqueHero() {
  return (
    <section id="home" className="boutique-hero">
      {/* 3D wardrobe */}
      <div className="boutique-hero__canvas">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <WardrobeScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Readability overlay */}
      <div className="boutique-hero__shade" />

      {/* Hero text */}
      <div className="boutique-hero__content">
        <motion.div
          className="boutique-hero__copy"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-7 block text-[10px] font-bold tracking-[3px] text-[#997447]">
            PAKISTANI FASHION HOUSE · EST. 2026
          </span>

          <h1 className="font-serif text-[clamp(58px,6vw,88px)] leading-[0.92] tracking-[-3px]">
            Heritage
            <br />
            <em className="font-normal text-[#9a6c48]">in every</em>
            <br />
            thread.
          </h1>

          <p className="my-7 max-w-[350px] text-sm leading-[2] text-[#766b60]">
            Discover the beauty of Pakistani craftsmanship, where
            timeless tradition meets contemporary elegance.
          </p>

          <motion.a
            href="#collections"
            whileHover={{ y: -5, scale: 1.035 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-7 bg-[#521d2b] px-7 py-5 text-[10px] font-semibold tracking-[2px] text-[#fffaf1] shadow-xl shadow-[#521d2b]/15 transition-colors hover:bg-[#80513e]"
          >
            EXPLORE COLLECTIONS
            <span className="text-xl">↗</span>
          </motion.a>

          <div className="mt-12">
            <span className="font-serif text-3xl tracking-[7px]">
              RAUNAQ
            </span>

            <p className="mt-2 text-[8px] tracking-[2.5px] text-[#9a8063]">
              ROOTED IN HERITAGE. DESIGNED FOR TODAY.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom details */}
      <div className="boutique-hero__bottom text-[8px] font-bold tracking-[2.5px] text-[#8d7965] max-sm:text-[6px]">
        <span>SCROLL TO DISCOVER</span>
        <span className="h-px w-[90px] bg-[#b79b75]" />
        <span>PESHAWAR · PAKISTAN</span>
      </div>
    </section>
  );
}
