"use client";

import React, { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const Sketch = dynamic(() => import("react-p5").then((m) => m.default), {
  ssr: false,
});

type P5 = any;

interface DrawingCanvasProps {
  onSave?: () => void;
}

const validImageIndices = [5, 6, 7, 8, 9];
const imageCache: Record<number, any> = {};
const MAX_IMAGES = 600;

const isPointerInsideCanvas = (p5: P5) =>
  p5.mouseX >= 0 &&
  p5.mouseX <= p5.width &&
  p5.mouseY >= 0 &&
  p5.mouseY <= p5.height;

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasStartedUI, setHasStartedUI] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const p5Ref = useRef<P5 | null>(null);
  const currentImageRef = useRef<any>(null);
  const isDrawingRef = useRef(false);
  const activePointerRef = useRef<"mouse" | "touch" | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const hasStartedRef = useRef(false);
  const drawCountRef = useRef(0);

  const imageSizeRef = useRef(120);

  const getBaseImageSize = (p5: P5) => (p5.windowWidth < 768 ? 50 : 120);

  const loadImage = useCallback(async (p5: P5, index: number) => {
    if (imageCache[index]) return imageCache[index];

    const path = `/images/taco-p5/TACO_${String(
      validImageIndices[index]
    ).padStart(3, "0")}.png`;

    const img = await new Promise((resolve) => {
      const i = p5.loadImage(path, () => resolve(i));
    });

    imageCache[index] = img;
    return img;
  }, []);

  const setup = useCallback(
    (p5: P5, parent: Element) => {
      p5Ref.current = p5;

      const w = (parent as HTMLElement).clientWidth;
      const h = 500;

      p5.createCanvas(w, h).parent(parent);
      p5.pixelDensity(window.devicePixelRatio || 1);
      p5.background(255);
      p5.frameRate(37);

      loadImage(p5, 0).then((img) => {
        currentImageRef.current = img;
      });
    },
    [loadImage]
  );

  const startDrawing = (p5: P5, type: "mouse" | "touch") => {
    if (!isPointerInsideCanvas(p5)) return;
    if (activePointerRef.current && activePointerRef.current !== type) return;
    if (drawCountRef.current >= MAX_IMAGES) return;

    activePointerRef.current = type;
    isDrawingRef.current = true;

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setHasStartedUI(true);
      p5.background(255); // SOLO UNA VEZ, como antes
    }

    imageSizeRef.current = getBaseImageSize(p5);
  };

  const advanceImage = async () => {
    const p5 = p5Ref.current;
    if (!p5) return;

    const next = (currentImageIndex + 1) % validImageIndices.length;
    const img = await loadImage(p5, next);

    currentImageRef.current = img;
    setCurrentImageIndex(next);
  };

  const draw = useCallback((p5: P5) => {
    if (!hasStartedRef.current) {
      p5.background(255); // 👈 ESTA ES LA CLAVE
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(p5.windowWidth < 768 ? 14 : 20);
      p5.fill(43, 57, 144);

      const msg =
        p5.windowWidth < 768 ? "Tap and drag" : "Create a community drawing";
      const msg2 =
        p5.windowWidth < 768 ? "to draw" : "Press and drag";
      const chars = Math.min(Math.floor(p5.frameCount * 0.4), msg.length);

      p5.text(msg.substring(0, chars), p5.width / 2, p5.height / 2);
      p5.text(msg2.substring(0, chars), p5.width / 2, p5.height / 2 + 40);

      return;
    }

    if (
      isDrawingRef.current &&
      currentImageRef.current &&
      isPointerInsideCanvas(p5) &&
      drawCountRef.current < MAX_IMAGES
    ) {
      const size = imageSizeRef.current;

      p5.image(
        currentImageRef.current,
        p5.mouseX - size / 2,
        p5.mouseY - size / 2,
        size,
        size
      );

      drawCountRef.current++;
    }
  }, []);

  const mousePressed = useCallback((p5: P5) => {
    startDrawing(p5, "mouse");
  }, []);

  const mouseReleased = useCallback(() => {
    isDrawingRef.current = false;
    activePointerRef.current = null;
    advanceImage();
  }, [currentImageIndex]);

  const touchStarted = useCallback((p5: P5) => {
    startDrawing(p5, "touch");
    return false;
  }, []);

  const touchEnded = useCallback(() => {
    isDrawingRef.current = false;
    activePointerRef.current = null;
    advanceImage();
  }, [currentImageIndex]);

  const windowResized = useCallback((p5: P5) => {
    if (!containerRef.current) return;
    p5.resizeCanvas(containerRef.current.clientWidth, 400);
  }, []);

  const clearCanvas = () => {
    const p5 = p5Ref.current;
    if (!p5) return;

    p5.clear();
    p5.background(255);
    hasStartedRef.current = false;
    setHasStartedUI(false);
    drawCountRef.current = 0;
  };

  const exportImage = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const p5 = p5Ref.current;
      if (!p5) return;

      const dataUrl = p5.canvas.toDataURL("image/png");

      await fetch("/api/save-sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      onSave?.();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full px-12">
      <div className="bg-white border border-foreground">
        <div className="p-1">
          <div
            ref={containerRef}
            className="border border-foreground overflow-hidden"
            style={{ touchAction: "none" }}
          >
            <Sketch
              setup={setup}
              draw={draw}
              mousePressed={mousePressed}
              mouseReleased={mouseReleased}
              touchStarted={touchStarted}
              touchEnded={touchEnded}
              windowResized={windowResized}
            />
          </div>
        </div>

        <div className="flex justify-between gap-2 p-3 border-t border-foreground">
          <button
            onClick={clearCanvas}
            className="px-4 bg-foreground text-white cursor-pointer"
          >
            Clear
          </button>

          <button
            onClick={exportImage}
            disabled={!hasStartedUI || isExporting}
            className={`px-4 border border-foreground ${
              isExporting || !hasStartedUI
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-foreground text-white cursor-pointer"
            }`}
          >
            {isExporting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
