"use client";

import { useEffect, useRef, useState } from "react";
import configLines from "../utils/configLines.json";
import styles from "../styles/futuristicLines.module.css";
import { AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { TbFileCv } from "react-icons/tb";

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
  const circleCanvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [textElements, setTextElements] = useState<JSX.Element[]>([]);
  // Ref para guardar el id de requestAnimationFrame
  const animationFrameId = useRef<number | null>(null);
  // Ref para controlar la versión del dibujo. Cada vez que se inicia un nuevo dibujo se incrementa.
  const versionRef = useRef(0);

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
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;
      ctx.imageSmoothingEnabled = true;
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

  // Función para dibujar el círculo
  const drawCircle = (
    ctxCircle: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    const circleRadius = 3;
    ctxCircle.clearRect(0, 0, ctxCircle.canvas.width, ctxCircle.canvas.height);
    ctxCircle.beginPath();
    ctxCircle.fillStyle = "white";
    ctxCircle.shadowColor = "rgba(255, 255, 255, 1)";
    ctxCircle.shadowBlur = 30;
    ctxCircle.arc(x, y, circleRadius, 0, 2 * Math.PI);
    ctxCircle.fill();
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
    if (!linesCanvas) return;
    const linesCtx = linesCanvas.getContext("2d");
    if (!linesCtx) return;

    const circleContexts = circleCanvasRefs.current
      .map((canvas) => {
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return ctx;
      })
      .filter(Boolean);

    if (!circleContexts.length) return;

    // Iniciamos una nueva versión para este dibujo
    versionRef.current++;
    const currentVersion = versionRef.current;

    const initialCanvas = () => {
      // Configuramos los canvas y limpiamos
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);

      circleContexts.forEach((circleCtx, index) => {
        const configEntry = configLines[index];
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
          (x, y) => circleCtx && drawCircle(circleCtx, x, y),
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
      linesCanvas.width = window.innerWidth;
      linesCanvas.height = window.innerHeight;
      linesCtx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);

      circleContexts.forEach((circleCtx, index) => {
        if (!circleCtx) return;
        circleCtx.clearRect(0, 0, circleCtx.canvas.width, circleCtx.canvas.height);
        const configEntry = configLines[index];
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
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
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
      {/* Canvas para los círculos */}
      {configLines.map((item, index) => (
        <canvas
          key={index}
          ref={(el) => {
            circleCanvasRefs.current[index] = el;
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ))}
      {textElements}
    </div>
  );
};

export default GrowingLines;
