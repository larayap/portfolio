"use client";

import { useEffect, useRef, useState } from "react";
import configLines from "../utils/configLines.json";
import styles from "../styles/futuristicLines.module.css"; // Importa el archivo CSS

interface LineParams {
  startX: number; // Coordenada X inicial
  startY: number; // Coordenada Y inicial
  angle: number; // Ángulo inicial
  growthSpeed: number; // Velocidad de crecimiento
  angleIncrement: number; // Incremento del ángulo
  maxTotalLength: number; // Longitud total máxima
  spin?: boolean; // Gira?,
  momentSpin1?: number,
  momentSpin2?: number,
  momentSpin3?: number,
  color?: string; // Color de la línea
  text?: string;
  url?: string;
}

const GrowingLines: React.FC = () => {
  const linesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circleCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [textElements, setTextElements] = useState<JSX.Element[]>([]);

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
      growthSpeed,
      angleIncrement,
      maxTotalLength,
      spin = false,
      momentSpin1 = 0,
      momentSpin2 = 0,
      momentSpin3 = 0,
      color = "white",
      text,
      url,
    } = params;

    let currentX = startX;
    let currentY = startY;
    let currentAngle = angle;
    let totalLength = 0;
    let textDrawn = false;

    const drawSegment = () => {
      if (totalLength >= maxTotalLength) {
        return;
      }

      if (spin && totalLength > canvasWidth * momentSpin1) {
        currentAngle = angleIncrement;
        if (!textDrawn && text && url) {
          console.log(text)
          const textX = currentX;
          const textY = currentY - 17;
          const fontSize = Math.max(12, canvasWidth * 0.011);
          setTextElements((prev) => [
        ...prev,
        <a
          key={text}
          href={url}
          className={styles.fadeIn} 
          style={{
            top: `${textY}px`,
            left: `${textX}px`,
            fontSize: `${fontSize}px`,
          }}
        >
          {text}
        </a>,
          ]);
          textDrawn = true;
        }
        if ((spin && totalLength > canvasWidth * momentSpin2)) {
          currentAngle = angle;
        }
        if ((spin && totalLength > canvasWidth * momentSpin3) && momentSpin3 !== 0) {
          currentAngle = -90;
        }
      }

      const angleInRadians = currentAngle * (Math.PI / 180);
      const nextX = Math.round(currentX + growthSpeed * Math.cos(angleInRadians));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(angleInRadians));
      // console.log(currentX + growthSpeed * Math.cos(angleInRadians), currentY + growthSpeed * Math.sin(angleInRadians))
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;
      ctx.imageSmoothingEnabled = true;
      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      // Notificar la posición actual al círculo
      onPointUpdate(nextX, nextY);

      currentX = nextX;
      currentY = nextY;

      totalLength += growthSpeed;

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
      growthSpeed,
      angleIncrement,
      maxTotalLength,
      spin = false,
      momentSpin1 = 0,
      momentSpin2 = 0,
      momentSpin3 = 0,
      color = "white",
      text,
      url,
    } = params;

    let currentX = startX;
    let currentY = startY;
    let currentAngle = angle;
    let totalLength = 0;
    let textDrawn = false;

    while (totalLength < maxTotalLength) {
      if (spin && totalLength > canvasWidth * momentSpin1) {
        currentAngle = angleIncrement;
        if (!textDrawn && text && url) {
          console.log(text)
          const textX = currentX;
          const textY = currentY - 17;
          const fontSize = Math.max(12, canvasWidth * 0.011);
          setTextElements((prev) => [
            ...prev,
            <a
              key={text}
              href={url}
              className={styles.fadeIn} 
              style={{
                top: `${textY}px`,
                left: `${textX}px`,
                fontSize: `${fontSize}px`,
              }}
            >
              {text}
            </a>,
          ]);
          textDrawn = true;
        }
        if (spin && totalLength > canvasWidth * momentSpin2) {
          currentAngle = angle;
        }
        if ((spin && totalLength > canvasWidth * momentSpin3) && momentSpin3 !== 0) {
          currentAngle = -90;
        }
      }

      const angleInRadians = currentAngle * (Math.PI / 180);
      const nextX = Math.round(currentX + growthSpeed * Math.cos(angleInRadians));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(angleInRadians));

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;

      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      currentX = nextX;
      currentY = nextY;

      totalLength += growthSpeed;
    }
    const circleRadius = 3;
    ctx.save()
    ctx.beginPath();
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


    return;
  };


  useEffect(() => {

    const linesCanvas = linesCanvasRef.current;
    if (!linesCanvas) return;

    const linesCtx = linesCanvas.getContext("2d");
    if (!linesCtx) return;

    const circleContexts = circleCanvasRefs.current.map((canvas) => {
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Configuración inicial de cada canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
      }
      return ctx;
    }).filter(Boolean); // Filtrar contextos nulos

    if (!circleContexts.length) return;


    const initialCanvas = () => {
      // Ajustar el tamaño de los canvas
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;

      // Limpiar los canvas
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);

      circleContexts.forEach((circleCtx, index) => {
        if (!circleCtx) return;

        const configEntry = configLines[index]; // Obtener datos del JSON correspondiente
        const { startX, startY, angle, growthSpeed, angleIncrement, spin, momentSpin1, momentSpin2, momentSpin3, maxTotalLength, text, url } = configEntry;

        drawLines(
          linesCtx,
          {
            startX: linesCanvas.width * startX,
            startY: linesCanvas.height * startY,
            angle: angle,
            growthSpeed: growthSpeed,
            angleIncrement: angleIncrement, // Alternar la dirección del ángulo
            spin: spin,
            momentSpin1: momentSpin1,
            momentSpin2: momentSpin2,
            momentSpin3: momentSpin3,
            maxTotalLength: linesCanvas.width * maxTotalLength,
            text: text,
            url: url,
          },
          linesCanvas.width,
          linesCanvas.height,
          (x, y) => drawCircle(circleCtx, x, y) // Pasar el contexto correspondiente
        );
      });
    };

    const resizeCanvas = () => {
      setTextElements([]); // Limpiar los elementos de texto

      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;

      // Limpiar los canvas
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);

      circleContexts.forEach((circleCtx, index) => {
        if (!circleCtx) return;

        circleCtx.clearRect(0, 0, circleCtx.canvas.width, circleCtx.canvas.height);

        const configEntry = configLines[index]; // Obtener datos del JSON correspondiente
        const { startX, startY, angle, growthSpeed, angleIncrement, spin, momentSpin1, momentSpin2, momentSpin3, maxTotalLength, text, url } = configEntry;

        drawLinesInstantly(
          linesCtx,
          {
            startX: linesCanvas.width * startX,
            startY: linesCanvas.height * startY,
            angle: angle,
            growthSpeed: growthSpeed,
            angleIncrement: angleIncrement, // Alternar la dirección del ángulo
            spin: spin,
            momentSpin1: momentSpin1,
            momentSpin2: momentSpin2,
            momentSpin3: momentSpin3,
            maxTotalLength: linesCanvas.width * maxTotalLength,
            text: text,
            url: url,
          },
          linesCanvas.width,
          //linesCanvas.height,
          //(x, y) => drawCircle(circleCtx, x, y) // Pasar el contexto correspondiente
        );
      });
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
      {configLines.map((item, index) => (
        <canvas
          key={index}
          ref={(el) => {
            // Vincular el canvas al índice correspondiente
            circleCanvasRefs.current[index] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: "none", // Evitar interferencias con interacciones
          }}
        />
        
      ))}
      {textElements}
    </div>
  );
};

export default GrowingLines;
