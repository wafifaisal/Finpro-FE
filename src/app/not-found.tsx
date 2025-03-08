"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

const FloatingBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    const objects: THREE.Mesh[] = [];
    const geometries = [
      new THREE.TorusGeometry(0.5, 0.2, 16, 50),
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.CapsuleGeometry(0.3, 0.6, 4, 8),
      new THREE.SphereGeometry(0.4, 24, 24),
    ];
    const brandColors = ["#DC1E1E", "#F39C12", "#F1C40F", "#E67E22"];
    const createObject = (
      geometry: THREE.BufferGeometry,
      color: string,
      x: number,
      y: number,
      z: number
    ) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = {
        rotationSpeed: {
          x: Math.random() * 0.01 - 0.005,
          y: Math.random() * 0.01 - 0.005,
          z: Math.random() * 0.01 - 0.005,
        },
        floatSpeed: Math.random() * 0.005 + 0.002,
        floatHeight: Math.random() * 0.2 + 0.1,
        initialY: y,
      };
      scene.add(mesh);
      objects.push(mesh);
      return mesh;
    };

    createObject(geometries[0], brandColors[0], -3, -1, -2);
    createObject(geometries[1], brandColors[1], 3, 2, -3);
    createObject(geometries[2], brandColors[2], -2.5, 1.5, -2.5);
    createObject(geometries[3], brandColors[3], 2, -1.5, -1);
    createObject(geometries[4], brandColors[0], 3.5, 0.5, -3);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      objects.forEach((object) => {
        object.rotation.x += object.userData.rotationSpeed.x;
        object.rotation.y += object.userData.rotationSpeed.y;
        object.rotation.z += object.userData.rotationSpeed.z;

        const floatOffset =
          Math.sin(Date.now() * object.userData.floatSpeed) *
          object.userData.floatHeight;
        object.position.y = object.userData.initialY + floatOffset;
      });

      const parallaxX =
        (window.innerWidth / 2 - (window.mouseX || window.innerWidth / 2)) *
        0.0005;
      const parallaxY =
        (window.innerHeight / 2 - (window.mouseY || window.innerHeight / 2)) *
        0.0005;
      camera.position.x += (parallaxX - camera.position.x) * 0.05;
      camera.position.y += (parallaxY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    window.mouseX = window.innerWidth / 2;
    window.mouseY = window.innerHeight / 2;
    const handleMouseMove = (event: MouseEvent) => {
      window.mouseX = event.clientX;
      window.mouseY = event.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    animate();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      objects.forEach((object) => {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((m: THREE.Material) => m.dispose());
        } else {
          object.material.dispose();
        }
      });
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

declare global {
  interface Window {
    mouseX: number;
    mouseY: number;
  }
}

const NotFound: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-putih flex items-center justify-center">
      <FloatingBackground />
      <div className="relative z-10 text-center space-y-6 px-4">
        <h1 className="text-8xl font-bold text-rose-500">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900">
          Halaman tidak ditemukan
        </h2>
        <p className="text-gray-500">
          Kami tidak dapat menemukan halaman yang Anda cari.
        </p>
        <div className="pt-8 space-x-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-putih text-lg font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg font-medium py-3 px-6 rounded-lg transition-colors border border-gray-200"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
