"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation"; // CRITICAL: Imported to track Next.js routes
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get current route path string (e.g., '/dashboard' or '/create-task')

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Particles
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorOptions = [
      new THREE.Color("#7c3aed"),
      new THREE.Color("#a78bfa"),
      new THREE.Color("#ec4899"),
      new THREE.Color("#2dd4bf"),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating orbs
    const orbs: THREE.Mesh[] = [];
    const orbData = [
      { color: "#7c3aed", size: 2, x: -15, y: 8, z: -10 },
      { color: "#ec4899", size: 1.5, x: 15, y: -5, z: -15 },
      { color: "#2dd4bf", size: 1.2, x: 5, y: 12, z: -8 },
      { color: "#a78bfa", size: 1, x: -10, y: -10, z: -5 },
    ];

    orbData.forEach((orb) => {
      const geo = new THREE.SphereGeometry(orb.size, 32, 32);
      const mat = new THREE.MeshBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: 0.15,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(orb.x, orb.y, orb.z);
      scene.add(mesh);
      orbs.push(mesh);
    });

    // Mouse tracking initialization
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let frame = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frame += 0.005;

      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;

      orbs.forEach((orb, i) => {
        orb.position.y += Math.sin(frame + i) * 0.02;
        orb.rotation.x += 0.005;
        orb.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // ================================================================
    // CLEANUP ROUTINE: Fires automatically whenever 'pathname' shifts
    // ================================================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      
      orbs.forEach((orb) => {
        orb.geometry.dispose();
        if (Array.isArray(orb.material)) {
          orb.material.forEach((mat) => mat.dispose());
        } else {
          orb.material.dispose();
        }
      });

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [pathname]); // <-- Adding 'pathname' forces a clean structural refresh on navigation!

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}