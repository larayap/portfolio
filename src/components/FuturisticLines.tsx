"use client";

import { useEffect, useRef, useState } from "react";
import configLines from "../utils/configLines.json";
import styles from "../styles/futuristicLines.module.css";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { TbFileCv } from "react-icons/tb";
import { debounce } from "../utils/performanceUtils";

interface LineParams {
  startX: number; // Coordenada X inicial
  startY: number; // Coordenada Y inicial
  angle: number; // Ángulo inicial
  growthSpeed: number; // Velocidad de crecimiento
  angleIncrement: number; // Incremento del ángulo
  maxTotalLength: number; // Longitud total máxima
  spin?: boolean; // ¿Gira?
  momentSpin1?: number;
  momentSpin2?: number;
  momentSpin3?: number;
  color?: string; // Color de la línea
  text?: string;
  url?: string;
}

const GrowingLines: React.FC = () => {
  const linesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const circlesCanvasRef = useRef<HTMLCanvasElement | null>(null); // 1 solo canvas para todos los círculos
  const [textElements, setTextElements] = useState<JSX.Element[]>([]);
  // Ref para guardar el id de requestAnimationFrame
  const animationFrameId = useRef<number | null>(null);
  // Ref para controlar la versión del dibujo. Cada vez que se inicia un nuevo dibujo se incrementa.
  const versionRef = useRef(0);
  // Ref para almacenar las posiciones actuales de los círculos
  const circlePositionsRef = useRef<{x: number, y: number}[]>([]);

  // Función para dibujar las líneas de forma progresiva
  const drawLines = (
    ctx: CanvasRenderingContext2D,
    params: LineParams,
    canvasWidth: number,
    canvasHeight: number,
    onPointUpdate: (x: number, y: number) => void,
    drawVersion: number // Versión del dibujo actual
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

    const aspect = window.innerWidth / window.innerHeight;
    const multiplier = -0.02 * aspect + 1.0;
    const multiplierMail = -0.02 * aspect + 0.88;

    // Configurar contexto una sola vez antes del loop
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.7;
    ctx.imageSmoothingEnabled = true;

    const drawSegment = () => {
      if (totalLength >= maxTotalLength) {
        // Al terminar el trazo, agregamos los elementos de texto si la versión coincide
        if (url === "linkedin&github") {
          const fontSize = Math.max(12, canvasWidth * 0.02);
          const textX = currentX;
          const textY = currentY * multiplier;
          if (versionRef.current === drawVersion) {
            setTextElements((prev) => [
              ...prev,
              <a
                key={`linkedin-${textX}-${drawVersion}`}
                href="https://www.linkedin.com/in/luis-alberto-araya-pardo-38308518/"
                className={styles.fadeIn}
                aria-label="Linkedin"
                style={{
                  top: `${textY}px`,
                  left: `${textX}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                <AiFillLinkedin />
              </a>,
              <a
                key={`github-${textY}-${drawVersion}`}
                href="https://github.com/larayap"
                aria-label="GitHub"
                className={`${styles.fadeIn} ${styles.delayAnimation}`}
                style={{
                  top: `${textY - fontSize - 5}px`,
                  left: `${textX}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                <AiFillGithub />
              </a>,
            ]);
          }
        }
        if (text === "l.arayapardo.dev@gmail.com") {
          const fontSize = Math.max(12, canvasWidth * 0.008);
          const textX = currentX;
          const textY = currentY * multiplierMail;
          if (versionRef.current === drawVersion) {
            setTextElements((prev) => [
              ...prev,
              <a
                key={`${text}-${drawVersion}`}
                href={url}
                className={`${styles.fadeIn} ${styles.verticalText}`}
                style={{
                  top: `${textY}px`,
                  left: `${textX}px`,
                  fontSize: `${fontSize}px`,
                }}
              >
                {text}
              </a>,
            ]);
          }
          textDrawn = true;
        }
        return;
      }

      // Cambiamos el ángulo según el valor de spin y los momentos
      if (spin && totalLength > canvasWidth * momentSpin1) {
        currentAngle = angleIncrement;
        if (!textDrawn && text && url && text !== "l.arayapardo.dev@gmail.com") {
          const textX = currentX;
          const textY = currentY * 0.7;
          const fontSize = Math.max(12, canvasWidth * 0.011);
          if (versionRef.current === drawVersion && text !== "cv") {
            setTextElements((prev) => [
              ...prev,
              <a
                key={`${text}-${drawVersion}`}
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
          }
          textDrawn = true;
          if (text === "cv") {
            const textX = currentX * 2.6;
            const textY = currentY * 0.55;
            if (versionRef.current === drawVersion ) {
              setTextElements((prev) => [
                ...prev,
                <a
                  key={`${text}-${drawVersion}-cv`}
                  href="/CV - Luis Araya.pdf"
                  download="CV-Luis-Araya.pdf"
                  aria-label="Descargar CV"
                  className={styles.fadeIn}
                  style={{
                    top: `${textY}px`,
                    left: `${textX}px`,
                    fontSize: `${Math.max(12, canvasWidth * 0.03)}px`,
                  }}
                >
                  <TbFileCv style={{ fontSize: Math.max(12, canvasWidth * 0.03) }} />
                </a>,
              ]);
            }
          }
        }
        if (spin && totalLength > canvasWidth * momentSpin2) {
          currentAngle = angle;
        }
        if (spin && totalLength > canvasWidth * momentSpin3 && momentSpin3 !== 0) {
          currentAngle = -90;
        }
      }

      // Dibujamos el segmento
      const angleInRadians = currentAngle * (Math.PI / 180);
      const nextX = Math.round(currentX + growthSpeed * Math.cos(angleInRadians));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(angleInRadians));

      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      onPointUpdate(nextX, nextY);

      currentX = nextX;
      currentY = nextY;
      totalLength += growthSpeed;

      if (versionRef.current === drawVersion) {
        animationFrameId.current = requestAnimationFrame(drawSegment);
      }
    };

    drawSegment();
  };

  // Función optimizada para dibujar todos los círculos en un solo canvas
  const drawAllCircles = (
    ctxCircle: CanvasRenderingContext2D,
    circleIndex: number,
    x: number,
    y: number
  ) => {
    // Actualizar la posición del círculo específico
    circlePositionsRef.current[circleIndex] = { x, y };

    // Limpiar todo el canvas
    ctxCircle.clearRect(0, 0, ctxCircle.canvas.width, ctxCircle.canvas.height);

    // Configuración del círculo (solo una vez antes del loop)
    const circleRadius = 3;
    ctxCircle.fillStyle = "white";
    ctxCircle.shadowColor = "rgba(255, 255, 255, 1)";
    ctxCircle.shadowBlur = 30;

    // Dibujar todos los círculos
    circlePositionsRef.current.forEach((pos) => {
      if (pos) {
        ctxCircle.beginPath();
        ctxCircle.arc(pos.x, pos.y, circleRadius, 0, 2 * Math.PI);
        ctxCircle.fill();
      }
    });
  };

  // Función para dibujar las líneas de forma instantánea (usada en resize)
  const drawLinesInstantly = (
    ctx: CanvasRenderingContext2D,
    params: LineParams,
    canvasWidth: number,
    drawVersion: number
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
    const aspect = window.innerWidth / window.innerHeight;
    const multiplier = -0.02 * aspect + 1.0;
    const multiplierMail = -0.02 * aspect + 0.88;

    // Configurar contexto una sola vez antes del loop
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.7;
    ctx.imageSmoothingEnabled = true;

    while (totalLength < maxTotalLength) {
      if (spin && totalLength > canvasWidth * momentSpin1) {
        currentAngle = angleIncrement;
        if (!textDrawn && text && url && text !== "l.arayapardo.dev@gmail.com") {
          const textX = currentX;
          const textY = currentY - 17;
          const fontSize = Math.max(12, canvasWidth * 0.011);
          if (versionRef.current === drawVersion && text !== "cv") {
            setTextElements((prev) => [
              ...prev,
              <a
                key={`${text}-${drawVersion}`}
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
          }
          textDrawn = true;
          if (text === "cv") {
            const textX = currentX * 2.6;
            const textY = currentY * 0.55;
            if (versionRef.current === drawVersion) {
              setTextElements((prev) => [
                ...prev,
                <a
                  key={`${text}-${drawVersion}-cv`}
                  href="/CV - Luis Araya.pdf"
                  download="CV-Luis-Araya.pdf"
                  aria-label="Descargar CV"
                  className={styles.fadeIn}
                  style={{
                    top: `${textY}px`,
                    left: `${textX}px`,
                    fontSize: `${Math.max(12, canvasWidth * 0.03)}px`,
                  }}
                >
                  <TbFileCv style={{ fontSize: Math.max(12, canvasWidth * 0.03) }} />
                </a>,
              ]);
            }
          }
        }
        if (spin && totalLength > canvasWidth * momentSpin2) {
          currentAngle = angle;
        }
        if (spin && totalLength > canvasWidth * momentSpin3 && momentSpin3 !== 0) {
          currentAngle = -90;
        }
      }

      const angleInRadians = currentAngle * (Math.PI / 180);
      const nextX = Math.round(currentX + growthSpeed * Math.cos(angleInRadians));
      const nextY = Math.round(currentY + growthSpeed * Math.sin(angleInRadians));

      ctx.beginPath();
      ctx.moveTo(Math.round(currentX), Math.round(currentY));
      ctx.lineTo(nextX, nextY);
      ctx.stroke();

      currentX = nextX;
      currentY = nextY;
      totalLength += growthSpeed;
    }
    // Dibujar el círculo final
    const circleRadius = 3;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.shadowBlur = 30;
    ctx.arc(currentX, currentY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();
    if (url === "linkedin&github") {
      const fontSize = Math.max(12, canvasWidth * 0.02);
      const textX = currentX;
      const textY = currentY * multiplier;
      if (versionRef.current === drawVersion) {
        setTextElements((prev) => [
          ...prev,
          <a
            key={`linkedin-${textX}-${drawVersion}`}
            href="https://www.linkedin.com/in/luis-alberto-araya-pardo-38308518/"
            className={styles.fadeIn}
            aria-label="Linkedin"
            style={{
              top: `${textY}px`,
              left: `${textX}px`,
              fontSize: `${fontSize}px`,
            }}
          >
            <AiFillLinkedin />
          </a>,
          <a
            key={`github-${textY}-${drawVersion}`}
            href="https://github.com/larayap"
            aria-label="GitHub"
            className={`${styles.fadeIn} ${styles.delayAnimation}`}
            style={{
              top: `${textY - fontSize - 5}px`,
              left: `${textX}px`,
              fontSize: `${fontSize}px`,
            }}
          >
            <AiFillGithub />
          </a>,
        ]);
      }
    }
    if (text === "l.arayapardo.dev@gmail.com") {
      const fontSize = Math.max(12, canvasWidth * 0.008);
      const textX = currentX;
      const textY = currentY * multiplierMail;
      if (versionRef.current === drawVersion) {
        setTextElements((prev) => [
          ...prev,
          <a
            key={`${text}-${drawVersion}`}
            href={url}
            className={`${styles.fadeIn} ${styles.verticalText}`}
            style={{
              top: `${textY}px`,
              left: `${textX}px`,
              fontSize: `${fontSize}px`,
            }}
          >
            {text}
          </a>,
        ]);
      }
    }
  };

  useEffect(() => {
    const linesCanvas = linesCanvasRef.current;
    const circlesCanvas = circlesCanvasRef.current;
    if (!linesCanvas || !circlesCanvas) return;

    const linesCtx = linesCanvas.getContext("2d");
    const circlesCtx = circlesCanvas.getContext("2d");
    if (!linesCtx || !circlesCtx) return;

    // Inicializar el array de posiciones de círculos
    circlePositionsRef.current = new Array(configLines.length).fill(null);

    // Iniciamos una nueva versión para este dibujo
    versionRef.current++;
    const currentVersion = versionRef.current;

    const initialCanvas = () => {
      // Configuramos los canvas y limpiamos
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;
      circlesCanvas.width = window.innerWidth;
      circlesCanvas.height = window.innerHeight;

      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
      circlesCtx.clearRect(0, 0, circlesCanvas.width, circlesCanvas.height);

      configLines.forEach((configEntry, index) => {
        const { startX, startY, angle, growthSpeed, angleIncrement, spin, momentSpin1, momentSpin2, momentSpin3, maxTotalLength, text, url } = configEntry;
        drawLines(
          linesCtx,
          {
            startX: linesCanvas.width * startX,
            startY: linesCanvas.height * startY,
            angle: angle,
            growthSpeed: growthSpeed,
            angleIncrement: angleIncrement,
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
          (x, y) => drawAllCircles(circlesCtx, index, x, y),
          currentVersion
        );
      });
    };

    const resizeCanvas = () => {
      // Al redimensionar, limpiamos los elementos de texto y cancelamos animaciones anteriores
      setTextElements([]);
      versionRef.current++; // Incrementamos la versión para invalidar callbacks antiguos
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }

      // Reinicializar posiciones de círculos
      circlePositionsRef.current = new Array(configLines.length).fill(null);

      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;
      circlesCanvas.width = window.innerWidth;
      circlesCanvas.height = window.innerHeight;

      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
      circlesCtx.clearRect(0, 0, circlesCanvas.width, circlesCanvas.height);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      configLines.forEach((configEntry, index) => {
        const { startX, startY, angle, growthSpeed, angleIncrement, spin, momentSpin1, momentSpin2, momentSpin3, maxTotalLength, text, url } = configEntry;
        drawLinesInstantly(
          linesCtx,
          {
            startX: linesCanvas.width * startX,
            startY: linesCanvas.height * startY,
            angle: angle,
            growthSpeed: growthSpeed,
            angleIncrement: angleIncrement,
            spin: spin,
            momentSpin1: momentSpin1,
            momentSpin2: momentSpin2,
            momentSpin3: momentSpin3,
            maxTotalLength: linesCanvas.width * maxTotalLength,
            text: text,
            url: url,
          },
          linesCanvas.width,
          versionRef.current
        );
      });
    };

    initialCanvas();

    // Throttle del resize para mejor rendimiento
    const debouncedResize = debounce(resizeCanvas, 200);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Canvas para las líneas */}
      <canvas
        ref={linesCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      {/* Canvas consolidado para TODOS los círculos */}
      <canvas
        ref={circlesCanvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {textElements}
    </div>
  );
};

export default GrowingLines;
