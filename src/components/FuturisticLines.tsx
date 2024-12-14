"use client";

import { useEffect, useRef /*, useState */ } from "react";
// import config from "../utils/configLines.json";

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
  const linesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circleCanvasRef2 = useRef<HTMLCanvasElement | null>(null);

  const drawLines = (
    ctx: CanvasRenderingContext2D,
    params: LineParams,
    canvasWidth: number,
    canvasHeight: number,
    onPointUpdate: (x: number, y: number) => void
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
      ctx.lineWidth = 1.7;

      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      // Notificar la posición actual al círculo
      onPointUpdate(nextX, nextY);

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

  const drawCircle = (
    ctxCircle: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    const circleRadius = 3; // Tamaño del círculo

    // const clearSize = 40; // Tamaño de la región a borrar
    ctxCircle.clearRect(0, 0, ctxCircle.canvas.width, ctxCircle.canvas.height);

    ctxCircle.beginPath();
    ctxCircle.fillStyle = "white";

    // Añadir sombra para el brillo
    ctxCircle.shadowColor = "rgba(255, 255, 255, 1)";
    ctxCircle.shadowBlur = 30;
    ctxCircle.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctxCircle.fill();
    ctxCircle.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctxCircle.fill();
    ctxCircle.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctxCircle.fill();
    ctxCircle.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctxCircle.fill();
    ctxCircle.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctxCircle.fill();

  };

  
  const drawLinesInstantly = (
    ctx: CanvasRenderingContext2D,
    params: LineParams,
    canvasWidth: number,
    // canvasHeight: number
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

    while (totalLength < maxTotalLength) {
      if (spin && totalLength > canvasWidth * momentSpin1) {
        currentAngle = angleIncrement;
        if (spin && totalLength > canvasWidth * momentSpin2) {
          currentAngle = 0;
        }
      }

      const nextX = Math.round(currentX + growthSpeed * Math.cos(currentAngle));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(currentAngle));

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;

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
    const circleRadius = 3; // Tamaño del círculo
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save()
      ctx.beginPath();
      // Color sólido del círculo
      ctx.fillStyle = "white"; 

      // Tercera capa de sombra (brillo máximo)
      ctx.shadowColor = "rgba(255, 255, 255, 1)"; // Máxima opacidad
      ctx.shadowBlur = 30; // Difusión más amplia
      ctx.arc(currentX, currentY, circleRadius, 0, 2 * Math.PI); 
      ctx.fill();
      ctx.arc(currentX, currentY, circleRadius, 0, 2 * Math.PI); 
      ctx.fill();
      ctx.arc(currentX, currentY, circleRadius, 0, 2 * Math.PI); 
      ctx.fill();
      ctx.arc(currentX, currentY, circleRadius, 0, 2 * Math.PI); 
      ctx.fill();
      ctx.arc(currentX, currentY, circleRadius, 0, 2 * Math.PI); 
      ctx.fill();


      return;
  };


  useEffect(() => {

    const linesCanvas = linesCanvasRef.current;
    const circleCanvas = circleCanvasRef.current;
    const circleCanvas2 = circleCanvasRef2.current;

    if (!linesCanvas || !circleCanvas || !circleCanvas2) return;

    const linesCtx = linesCanvas.getContext("2d");
    const circleCtx = circleCanvas.getContext("2d");

    const circleCtx2 = circleCanvas2.getContext("2d");

    if (!linesCtx || !circleCtx || !circleCtx2) return;

    const initialCanvas = () => {
      // Ajustar el tamaño de los canvas
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;

      circleCanvas.width = window.innerWidth;
      circleCanvas.height = window.innerHeight;

      circleCanvas2.width = window.innerWidth;
      circleCanvas2.height = window.innerHeight;

      // Limpiar los canvas
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
      circleCtx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

      circleCtx2.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

      drawLines(
        linesCtx,
        {
          startX: 0,
          startY: linesCanvas.height * 0.08,
          angle: 0,
          maxLength: 0,
          growthSpeed: 1.2,
          angleIncrement: 45, // 45 grados en radianes
          spin: true,
          momentSpin1: 0.1,
          momentSpin2: 0.12,
          maxTotalLength: linesCanvas.width * 0.2,
        },
        linesCanvas.width,
        linesCanvas.height,
        (x, y) => drawCircle(circleCtx, x, y)
      );

      drawLines(
        linesCtx,
        {
          startX: 0,
          startY: linesCanvas.height * 0.08,
          angle: 0,
          maxLength: 0,
          growthSpeed: 1.2,
          angleIncrement: -45, // 45 grados en radianes
          spin: true,
          momentSpin1: 0.058,
          momentSpin2: 0.077,
          maxTotalLength: linesCanvas.width * 0.11,
        },
        linesCanvas.width,
        linesCanvas.height,
        (x, y) => drawCircle(circleCtx2, x, y)
      );
    };

    const resizeCanvas = () => {
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;

      circleCanvas.width = window.innerWidth;
      circleCanvas.height = window.innerHeight;

      // Limpiar los canvas
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
      circleCtx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
      circleCtx2.clearRect(0, 0, circleCanvas.width, circleCanvas.height);

      // Ajustar el tamaño del canvas
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;

      // Dibujar líneas adaptadas al nuevo tamaño
      drawLinesInstantly(
        linesCtx,
        {
          startX: 0,
          startY: linesCanvas.height * 0.08,
          angle: 0,
          maxLength: 0,
          growthSpeed: 1.2,
          angleIncrement: 45, // 45 grados en radianes
          spin: true,
          momentSpin1: 0.1,
          momentSpin2: 0.12,
          maxTotalLength: linesCanvas.width * 0.2,
        },
        linesCanvas.width,
        // canvas.height
      );

      drawLinesInstantly(
        linesCtx,
        {
          startX: 0,
          startY: linesCanvas.height * 0.08,
          angle: 0,
          maxLength: 0,
          growthSpeed: 1.2,
          angleIncrement: -45, // 45 grados en radianes
          spin: true,
          momentSpin1: 0.058,
          momentSpin2: 0.077,
          maxTotalLength: linesCanvas.width * 0.11,
        },
        linesCanvas.width,
        // canvas.height
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

  return (
    <div style={{ position: "relative" }}>
      {/* Canvas para líneas */}
      <canvas
        ref={linesCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      {/* Canvas para círculos */}
      <canvas
        ref={circleCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none", // Evitar interferencias con interacciones
        }}
      />
      <canvas
        ref={circleCanvasRef2}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none", // Evitar interferencias con interacciones
        }}
      />
    </div>
  );
};

export default GrowingLines;
