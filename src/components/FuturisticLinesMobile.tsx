"use client";

import { useEffect, useRef } from "react";
import styles from "../styles/futuristicLinesMobile.module.css";
import { debounce } from "../utils/performanceUtils";

interface SimpleLine {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

const FuturisticLinesMobile: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sin líneas laterales - solo efectos sutiles en CSS
  const lines: SimpleLine[] = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawLines = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Estilo sutil y elegante
      ctx.strokeStyle = "rgba(224, 224, 224, 0.25)"; // Mucho más sutil
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(224, 224, 224, 0.2)";
      ctx.shadowBlur = 3;

      lines.forEach((line) => {
        setTimeout(() => {
          if (!ctx) return;
          ctx.beginPath();
          ctx.moveTo(canvas.width * line.startX, canvas.height * line.startY);
          ctx.lineTo(canvas.width * line.endX, canvas.height * line.endY);
          ctx.stroke();
        }, line.delay * 1000);
      });
    };

    drawLines();

    const handleResize = debounce(() => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines();
    }, 200);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Elementos decorativos adicionales con CSS */}
      <div className={styles.glow1} />
      <div className={styles.glow2} />
      <div className={styles.particle1} />
      <div className={styles.particle2} />
      <div className={styles.particle3} />
    </div>
  );
};

export default FuturisticLinesMobile;
