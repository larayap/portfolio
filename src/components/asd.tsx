"use client";

import { useEffect, useRef, useState } from "react";

interface LineParams {
  startX: number; // Coordenada X inicial
  startY: number; // Coordenada Y inicial
  angle: number; // Ángulo inicial
  maxLength: number; // Longitud máxima para el tramo actual
  growthSpeed: number; // Velocidad de crecimiento
  angleIncrement: number; // Incremento del ángulo
  maxTotalLength: number; // Longitud total máxima
  spin?: boolean; // Gira?
  color?: string; // Color de la línea
}

const GrowingLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1); // Factor de escala

  const drawLines = (ctx: CanvasRenderingContext2D, params: LineParams) => {
    const {
      startX,
      startY,
      angle,
      maxLength,
      growthSpeed,
      angleIncrement,
      maxTotalLength,
      spin = false,
      color = "white",
    } = params;

    let currentX = startX;
    let currentY = startY;
    let currentAngle = angle;
    let currentMaxLength = maxLength;
    let totalLength = 0;

    const path: { x: number; y: number }[] = []; // Para guardar el historial si lo necesitas

    const drawSegment = () => {
      if (totalLength >= maxTotalLength) {
        // Renderizar el texto una vez que se haya completado la línea
        ctx.fillStyle = "white"; // Color del texto
        ctx.font = `${16 * scaleFactor}px Arial`; // Tamaño de la fuente escalado
        ctx.textAlign = "center";
        ctx.fillText('Holaaa', 35 * scaleFactor, (100 - 10) * scaleFactor); // Texto sobre la línea
        return;
      }

      if (spin && totalLength > 100) {
        currentAngle = angleIncrement;
      }

      // Escalar el siguiente punto de la línea con el factor de escala
      const nextX = Math.round(currentX + growthSpeed * Math.cos(currentAngle) * scaleFactor);
      const nextY = Math.round(currentY + growthSpeed * Math.sin(currentAngle) * scaleFactor);

      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * scaleFactor; // Escalar el grosor de la línea

      // Dibujar segmento actual
      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      path.push({ x: currentX, y: currentY });
      currentX = nextX;
      currentY = nextY;

      totalLength += growthSpeed;

      // Cambiar ángulo y longitud máxima si alcanza el límite actual
      if (Math.hypot(nextX - startX, nextY - startY) >= currentMaxLength) {
        currentMaxLength += 50 * scaleFactor; // Incrementar la longitud máxima proporcionalmente
      }

      requestAnimationFrame(drawSegment);
    };

    drawSegment();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar el tamaño del canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calcular el factor de escala en función de las dimensiones de la ventana
    const factor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    setScaleFactor(factor);

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Llamar a `drawLines` con diferentes parámetros, ajustados al factor de escala
    drawLines(ctx, {
      startX: 0,
      startY: 100,
      angle: 0,
      maxLength: 200,
      growthSpeed: 1.2,
      angleIncrement: 45,
      spin: true,
      maxTotalLength: 200,
    });

    drawLines(ctx, {
      startX: 20,
      startY: 100,
      angle: 45,
      maxLength: 150,
      growthSpeed: 1.2,
      angleIncrement: 0,
      maxTotalLength: 200,
      color: "red",
    });

    // Volver a ajustar el tamaño cuando se cambie el tamaño de la ventana
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newScaleFactor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      setScaleFactor(newScaleFactor);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawLines(ctx, {
        startX: 0,
        startY: 100,
        angle: 0,
        maxLength: 200,
        growthSpeed: 1.2,
        angleIncrement: 45,
        spin: true,
        maxTotalLength: 200,
      });

      drawLines(ctx, {
        startX: 20,
        startY: 100,
        angle: 45,
        maxLength: 150,
        growthSpeed: 1.2,
        angleIncrement: 0,
        maxTotalLength: 200,
        color: "red",
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [scaleFactor]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default GrowingLines;
