"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "../styles/animatedBorder.module.css";

interface AnimatedBorderProps {
  children: React.ReactNode;
  trigger?: boolean; // Trigger para redibujar la animación
}

const AnimatedBorder: React.FC<AnimatedBorderProps> = ({ children, trigger = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    };

    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    const timer = setTimeout(updateDimensions, 0);
    window.addEventListener("resize", updateDimensions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cancelar animación anterior si existe
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const w = dimensions.width;
    const h = dimensions.height;
    const r = 3; // border radius
    const speed = 0.009; // velocidad de la animación (0 a 1)

    let progress = 0; // De 0 a 1

    const drawAnimatedBorder = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);

      // 1. PRIMERO: Dibujar el fondo del botón (siempre visible)
      ctx.save();
      ctx.fillStyle = "rgba(26, 25, 25, 0.9)";
      ctx.beginPath();
      ctx.roundRect(0, 0, w, h, r);
      ctx.fill();
      ctx.restore();

      // 2. SEGUNDO: Dibujar el borde animado encima
      ctx.strokeStyle = "rgba(224, 224, 224, 0.9)";
      ctx.lineWidth = 2;
      // ctx.shadowColor = "rgba(224, 224, 224, 0.8)";
      ctx.shadowBlur = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Dibujar el borde completo pero solo hasta el progreso actual
      ctx.beginPath();

      // Empezar desde arriba a la izquierda, después del radio
      ctx.moveTo(r, 0);

      // Calcular el perímetro total
      const topWidth = w - 2 * r;
      const sideHeight = h - 2 * r;
      const arcLength = (Math.PI / 2) * r;
      const totalLength =
        topWidth + arcLength + // Top line + top-right arc
        sideHeight + arcLength + // Right line + bottom-right arc
        topWidth + arcLength + // Bottom line + bottom-left arc
        sideHeight + arcLength; // Left line + top-left arc

      const currentLength = progress * totalLength;
      let drawn = 0;

      // 1. Top line (left to right)
      if (currentLength > drawn) {
        const segmentLength = topWidth;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        ctx.lineTo(r + topWidth * ratio, 0);
        drawn += segmentLength;
      }

      // 2. Top-right arc
      if (currentLength > drawn) {
        const segmentLength = arcLength;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (Math.PI / 2) * ratio;
        ctx.arc(w - r, r, r, startAngle, endAngle, false);
        drawn += segmentLength;
      }

      // 3. Right line (top to bottom)
      if (currentLength > drawn) {
        const segmentLength = sideHeight;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        ctx.lineTo(w, r + sideHeight * ratio);
        drawn += segmentLength;
      }

      // 4. Bottom-right arc
      if (currentLength > drawn) {
        const segmentLength = arcLength;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        const startAngle = 0;
        const endAngle = startAngle + (Math.PI / 2) * ratio;
        ctx.arc(w - r, h - r, r, startAngle, endAngle, false);
        drawn += segmentLength;
      }

      // 5. Bottom line (right to left)
      if (currentLength > drawn) {
        const segmentLength = topWidth;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        ctx.lineTo(w - r - topWidth * ratio, h);
        drawn += segmentLength;
      }

      // 6. Bottom-left arc
      if (currentLength > drawn) {
        const segmentLength = arcLength;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        const startAngle = Math.PI / 2;
        const endAngle = startAngle + (Math.PI / 2) * ratio;
        ctx.arc(r, h - r, r, startAngle, endAngle, false);
        drawn += segmentLength;
      }

      // 7. Left line (bottom to top)
      if (currentLength > drawn) {
        const segmentLength = sideHeight;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        ctx.lineTo(0, h - r - sideHeight * ratio);
        drawn += segmentLength;
      }

      // 8. Top-left arc (completing the loop)
      if (currentLength > drawn) {
        const segmentLength = arcLength;
        const toDraw = Math.min(currentLength - drawn, segmentLength);
        const ratio = toDraw / segmentLength;
        const startAngle = Math.PI;
        const endAngle = startAngle + (Math.PI / 2) * ratio;
        ctx.arc(r, r, r, startAngle, endAngle, false);
      }

      ctx.stroke();

      // Continuar animación
      if (progress < 1) {
        progress += speed;
        animationRef.current = requestAnimationFrame(drawAnimatedBorder);
      }
    };

    drawAnimatedBorder();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions.width, dimensions.height, trigger]);

  return (
    <div ref={containerRef} className={styles.container}>
      <motion.canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className={styles.canvas}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default AnimatedBorder;
