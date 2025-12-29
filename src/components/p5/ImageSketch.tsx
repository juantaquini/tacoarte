"use client";

import React, { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

// Importación dinámica de react-p5 para evitar problemas de SSR
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

type P5Instance = any;

// 🔁 Imágenes del 1 al 9 (loop)
const validImageIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const cachedImages: Record<number, any> = {};

const ImageSketch: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const p5InstanceRef = useRef<P5Instance | null>(null);
  const currentImageRef = useRef<any>(null);
  const isDrawingRef = useRef(false);

  const getImageSize = (p5: P5Instance): number => {
    return p5.windowWidth < 768 ? 80 : 250;
  };

  const loadImage = useCallback(
    async (p5: P5Instance, index: number): Promise<any> => {
      if (cachedImages[index]) return cachedImages[index];

      try {
        const imagePath = `/images/taco-p5/TACO_${String(
          validImageIndices[index]
        ).padStart(3, "0")}.png`;

        const img = await new Promise((resolve) => {
          const loadedImg = p5.loadImage(imagePath, () =>
            resolve(loadedImg)
          );
        });

        cachedImages[index] = img;
        return img;
      } catch (error) {
        console.error("Error al cargar imagen:", error);
        return null;
      }
    },
    []
  );

  const setup = useCallback(
    (p5: P5Instance, canvasParentRef: Element) => {
      p5InstanceRef.current = p5;
      p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
      p5.background("#F5F5F5");
      p5.frameRate(37);

      // Precarga de la primera imagen
      loadImage(p5, 0).then((img) => {
        currentImageRef.current = img;
      });
    },
    [loadImage]
  );

  const draw = useCallback(
    (p5: P5Instance) => {
      if (!hasStarted) {
        const message =
          p5.windowWidth < 768 ? "Touch the screen" : "Click to start";

        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textFont("IBM Plex Sans");
        p5.textSize(p5.windowWidth < 768 ? 26 : 40);

        const c = p5.color("#2b3072");
        c.setAlpha(Math.abs(Math.sin(p5.frameCount * 0.02)) * 255);
        p5.fill(c);

        p5.text(message, p5.width / 2, p5.height / 2);
      }

      if (isDrawingRef.current && currentImageRef.current) {
        const imgSize = getImageSize(p5);
        p5.image(
          currentImageRef.current,
          p5.mouseX - imgSize / 2,
          p5.mouseY - imgSize / 2,
          imgSize,
          imgSize
        );
      }
    },
    [hasStarted]
  );

  const mousePressed = useCallback(
    async (p5: P5Instance) => {
      const navbarHeight = 80;
      if (p5.mouseY < navbarHeight) return;

      if (!hasStarted) {
        setHasStarted(true);
        p5.background("#F5F5F5");
      }

      isDrawingRef.current = true;

      // 🔁 Loop infinito
      const nextIndex =
        (currentImageIndex + 1) % validImageIndices.length;

      const nextImage = await loadImage(p5, nextIndex);
      if (nextImage) {
        currentImageRef.current = nextImage;
        setCurrentImageIndex(nextIndex);
      }
    },
    [currentImageIndex, hasStarted, loadImage]
  );

  const mouseReleased = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  const windowResized = useCallback((p5: P5Instance) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    p5.background("#F5F5F5");
  }, []);

  return (
    <div
      className="page-container"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <Sketch
        setup={setup}
        draw={draw}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        windowResized={windowResized}
      />
    </div>
  );
};

export default ImageSketch;
