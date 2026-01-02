"use client";

import React, { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

type P5Instance = any;

const validImageIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const cachedImages: Record<number, any> = {};

const ImageSketch: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isExporting, setIsExporting] = useState(false); 

  const p5InstanceRef = useRef<P5Instance | null>(null);
  const currentImageRef = useRef<any>(null);
  const isDrawingRef = useRef(false);

  const getImageSize = (p5: P5Instance): number => {
    return p5.windowWidth < 768 ? 80 : 250;
  };

  const exportImage = async () => {
    if (isExporting) return; 
    setIsExporting(true);

    try {
      const p5 = p5InstanceRef.current;
      if (!p5) return;

      const dataUrl = p5.canvas.toDataURL("image/png");

      await fetch("/api/save-sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
    } catch (error) {
      console.error("Error exporting image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const loadImage = useCallback(
    async (p5: P5Instance, index: number): Promise<any> => {
      if (cachedImages[index]) return cachedImages[index];

      try {
        const imagePath = `/images/taco-p5/TACO_${String(
          validImageIndices[index]
        ).padStart(3, "0")}.png`;

        const img = await new Promise((resolve) => {
          const loadedImg = p5.loadImage(imagePath, () => resolve(loadedImg));
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
      p5.clear();
      p5.frameRate(37);

      loadImage(p5, 0).then((img) => {
        currentImageRef.current = img;
      });
    },
    [loadImage]
  );

  const draw = useCallback(
    (p5: P5Instance) => {
      if (!hasStarted) {
        p5.clear();
        const message =
          p5.windowWidth < 768 ? "Touch the screen" : "Click to start drawing";

        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textFont("IBM Plex Sans");
        p5.textSize(p5.windowWidth < 768 ? 20 : 28);
        p5.fill("#2b3072");

        const charsToShow = Math.floor(
          (p5.frameCount * 0.15) % (message.length + 30)
        );
        p5.text(message.substring(0, charsToShow), p5.width / 2, p5.height / 2);
        return;
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
        p5.clear();
      }

      isDrawingRef.current = true;

      const nextIndex = (currentImageIndex + 1) % validImageIndices.length;
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

  const windowResized = useCallback(
    (p5: P5Instance) => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    },
    []
  );

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {!hasStarted && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/IMG_1224.jpeg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="relative z-10 pointer-events-none">
        <Sketch
          setup={setup}
          draw={draw}
          mousePressed={mousePressed}
          mouseReleased={mouseReleased}
          windowResized={windowResized}
        />
      </div>

      <button
        onClick={exportImage}
        disabled={isExporting}
        className={`absolute bottom-30 right-12 z-50 pointer-events-auto bg-foreground text-white px-4 py-2 shadow-lg cursor-pointer ${
          isExporting ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {isExporting ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default ImageSketch;
