import React, { useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import gsap from "gsap";

/* ===================== 3D MODEL ===================== */

function SuperDogModel() {
  const group = useRef();
  const { scene } = useGLTF("/rat.glb");

  useEffect(() => {
    if (!group.current) return;

    gsap.fromTo(
      group.current.position,
      { x: 4, y: 0, z: 0 },
      { x: 0, y: -0.5, z: 0, duration: 2, ease: "power3.out" }
    );

    gsap.to(group.current.position, {
      y: 0.3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
      <primitive
        ref={group}
        object={scene}
        scale={1.2}
        rotation={[0, Math.PI / 1.8, 0]}
      />
    </Float>
  );
}

/* ===================== TEXT ANIMATION ===================== */

function BotText() {
  const textRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      }
    ).to(textRef.current, {
      y: -6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={textRef}
      className="absolute -top-4 left-1/2 w-[250px] -translate-x-1/2 text-center pointer-events-none"
    >
      <p className="text-sm font-semibold text-white drop-shadow-lg">
        👋 Welcome!
      </p>
      <p className="text-xs text-white/80 tracking-wide">
        Explore with me 🚀
      </p>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */

export default function BotCharacter() {
  return (
    <div className="fixed cursor-grab right-4 top-1/2 -translate-y-1/4 w-[150px] h-[220px] z-[500] hidden lg:block">
      
      {/* Text Overlay */}
      <BotText />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [6, 1, 4], fov: 55 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <SuperDogModel />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/rat.glb");
