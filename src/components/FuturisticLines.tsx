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
  spin?: boolean; // Gira?,
  momentSpin1?: number,
  momentSpin2?: number,
  color?: string; // Color de la línea
}

const GrowingLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  const drawLines = (
    ctx: CanvasRenderingContext2D,
    params: LineParams,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const {
      startX,
      startY,
      angle,
      maxLength,
      growthSpeed,
      angleIncrement,
      maxTotalLength,
      spin = false,
      momentSpin1 = 0,
      momentSpin2 = 0,
      color = "white",
    } = params;

    let currentX = startX;
    let currentY = startY;
    let currentAngle = angle;
    let currentMaxLength = maxLength;
    let totalLength = 0;

    const drawSegment = () => {
      if (totalLength >= maxTotalLength) {
        // Renderizar el texto una vez que se haya completado la línea
        /*
        ctx.fillStyle = "white";
        ctx.font = `${canvasHeight * 0.03}px Arial`; // Escalar el tamaño de la fuente
        ctx.textAlign = "center";
        ctx.fillText("Holaaa", canvasWidth * 0.1, canvasHeight * 0.1 - 10);
        */
        return;
      }

      if (spin && totalLength > canvasWidth * momentSpin1) {
        currentAngle = angleIncrement;
        if (spin && totalLength > canvasWidth * momentSpin2) {
          currentAngle = 0;
        }
      }

      const nextX = Math.round(currentX + growthSpeed * Math.cos(currentAngle));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(currentAngle));

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      currentX = nextX;
      currentY = nextY;

      totalLength += growthSpeed;

      if (Math.hypot(nextX - startX, nextY - startY) >= currentMaxLength) {
        currentMaxLength += canvasWidth * 0.05; // Ajustar longitud máxima
      }

      requestAnimationFrame(drawSegment);
    };

    drawSegment();
  };

  const drawLinesInstantly = (
    ctx: CanvasRenderingContext2D,
    params: LineParams,
    canvasWidth: number,
    canvasHeight: number
  ) => {
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

    while (totalLength < maxTotalLength) {
      if (spin && totalLength > canvasWidth * 0.1) {
        currentAngle = angleIncrement;
        if (spin && totalLength > canvasWidth * 0.12) {
          currentAngle = 0;
        }
      }

      const nextX = Math.round(currentX + growthSpeed * Math.cos(currentAngle));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(currentAngle));

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      currentX = nextX;
      currentY = nextY;

      totalLength += growthSpeed;

      if (Math.hypot(nextX - startX, nextY - startY) >= currentMaxLength) {
        currentMaxLength += canvasWidth * 0.05; // Ajustar longitud máxima
      }
    }

    // Renderizar el texto después de terminar las líneas
    /*
    ctx.fillStyle = "white";
    ctx.font = `${canvasHeight * 0.03}px Arial`; // Escalar el tamaño de la fuente
    ctx.textAlign = "center";
    ctx.fillText("Holaaa", canvasWidth * 0.1, canvasHeight * 0.1 - 10);
    */
  };


  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const initialCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ajustar el tamaño del canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar líneas adaptadas al nuevo tamaño
      drawLines(
        ctx,
        {
          startX: 0,
          startY: canvas.height * 0.08,
          angle: 0,
          maxLength: 0,
          growthSpeed: 1.2,
          angleIncrement: Math.PI / 4, // 45 grados en radianes
          spin: true,
          momentSpin1: 0.1,
          momentSpin2: 0.12,
          maxTotalLength: canvas.width * 0.2,
        },
        canvas.width,
        canvas.height
      );

      drawLines(
        ctx,
        {
          startX: 0,
          startY: canvas.height * 0.5,
          angle: 0,
          maxLength: canvas.width * 0.2,
          growthSpeed: 1.2,
          angleIncrement: Math.PI / 4, // 45 grados en radianes
          maxTotalLength: canvas.width * 0.4,
        },
        canvas.width,
        canvas.height
      );
    };

    const resizeCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ajustar el tamaño del canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar líneas adaptadas al nuevo tamaño
      drawLinesInstantly(
        ctx,
        {
          startX: 0,
          startY: canvas.height * 0.08,
          angle: 0,
          maxLength: canvas.width * 0.2,
          growthSpeed: 1.2,
          angleIncrement: Math.PI / 4, // 45 grados en radianes
          spin: true,
          maxTotalLength: canvas.width * 0.4,
        },
        canvas.width,
        canvas.height
      );

      drawLinesInstantly(
        ctx,
        {
          startX: canvas.width * 0.2,
          startY: canvas.height * 0.3,
          angle: Math.PI / 4,
          maxLength: canvas.width * 0.15,
          growthSpeed: 1.2,
          angleIncrement: 0,
          maxTotalLength: canvas.width * 0.3,
          color: "red",
        },
        canvas.width,
        canvas.height
      );
    };
    // Configurar canvas inicial
    initialCanvas();

    // Redimensionar al cambiar el tamaño de la ventana
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default GrowingLines;
