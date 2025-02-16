"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaNodeJs,
  FaReact,
  FaPhp,
  FaJava,
  FaVuejs,
  FaGitAlt,
  FaFigma,
} from "react-icons/fa";
import { SiMysql, SiSharp, SiOracle } from "react-icons/si";
import styles from "../styles/about.module.css";
import DOMPurify from "dompurify";

const TechnologiesGrid = () => {
  const techList = [
    { name: "HTML", icon: <FaHtml5 /> },
    { name: "CSS", icon: <FaCss3Alt /> },
    { name: "JavaScript", icon: <FaJsSquare /> },
    { name: "Node.js", icon: <FaNodeJs /> },
    { name: "MySQL", icon: <SiMysql /> },
    { name: "React.js", icon: <FaReact /> },
    { name: "PHP", icon: <FaPhp /> },
    { name: "Java", icon: <FaJava /> },
    { name: "Vue", icon: <FaVuejs /> },
    { name: "PL/SQL", icon: <SiOracle /> },
    { name: "C#", icon: <SiSharp /> },
    { name: "Git", icon: <FaGitAlt /> },
    { name: "Figma", icon: <FaFigma /> },
  ];

  return (
    <div className={styles.techGrid}>
      {techList.map((tech, i) => (
        <div key={i} className={styles.techCard}>
          <div className={styles.icon}>{tech.icon}</div>
          <p>{tech.name}</p>
        </div>
      ))}
    </div>
  );
};

const TextCarousel = () => {
  const titles = ["Quien soy", "Experiencia", "Tecnologias"];
  const contents = [
    "<strong>¡Hola!</strong><br><br>Soy Luis Araya, un entusiasta del desarrollo web que encuentra magia en convertir ideas en experiencias digitales útiles y atractivas. Me apasiona aprender cosas nuevas y colaborar con personas que compartan esa chispa de curiosidad.<br><br>Además de programar, disfruto de la música y los videojuegos, dos aficiones que me recuerdan lo importante que es la creatividad en todo lo que hacemos. Creo firmemente que la tecnología puede conectar a la gente de formas sorprendentes, y esa posibilidad me impulsa a dar siempre lo mejor de mí en cada proyecto.",
    `
      <strong>
        <span class="company">AFP Modelo</span>
        <span class="job">Desarrollador Web (Ene 2024 - Presente)</span>
      </strong>
      <br>
      <ul>
        <li>Desarrollo con <strong>Vue</strong>, <strong>C</strong> y <strong>PL/SQL</strong>, trabajando con bases de datos y entornos de desarrollo colaborativos.</li>
        <li>Diseño de nuevas funcionalidades y mantenimiento de las existentes para optimizar la experiencia de usuario.</li>
        <li>Participación en la migración de sistemas internos a plataformas web y en la implementación de mejoras continuas.</li>
        <li>Colaboración con equipos multidisciplinarios, aplicando metodologías ágiles para reducir tiempos de entrega y mejorar la calidad del producto.</li>
      </ul>

      <strong>
        <span class="company">Iplacex</span>
        <span class="job">Desarrollador de recursos web interactivos para la educación (Nov 2024 - Feb 2024)</span>
      </strong>
      <br>
      <ul>
        <li>Responsable de la transformación y adaptación estratégica de material educativo para la plataforma digital Rise, asegurando la creación de experiencias de aprendizaje interactivas y atractivas.</li>
        <li>Seleccioné y adapté material educativo para garantizar la relevancia y el impacto pedagógico.</li>
        <li>Optimizé la interfaz de la plataforma, asegurando una experiencia de usuario fluida y envolvente.</li>
        <li>Colaboré con expertos en diseño instruccional para desarrollar contenido educativo preciso y de calidad.</li>
        <li>Me enfoqué en mantener altos estándares de calidad e innovación, revisando y mejorando cada aspecto del contenido.</li>
      </ul>
    `,
    <TechnologiesGrid key="technologies" />,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const horizontalRef = useRef(null);
  const verticalRef = useRef(null);
  const horizontalOppRef = useRef(null);
  const verticalOppRef = useRef(null);
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Aseguramos que el arreglo de refs tenga la cantidad de elementos de títulos
  useEffect(() => {
    titleRefs.current = titleRefs.current.slice(0, titles.length);
  }, [titles.length]);

  useEffect(() => {
    if (!horizontalRef.current || !verticalRef.current) return;

    // Detenemos animaciones en curso
    gsap.killTweensOf(horizontalRef.current);
    gsap.killTweensOf(verticalRef.current);
    gsap.killTweensOf(horizontalOppRef.current);
    gsap.killTweensOf(verticalOppRef.current);

    // Calculamos referencias y posiciones de los títulos
    const activeTitle = titleRefs.current[currentIndex];
    const adjustment = [2, 0, -2];
    const activeTitleOpp = titleRefs.current[currentIndex + adjustment[currentIndex]];
    if (!activeTitle || !activeTitleOpp) return;

    const titleRect = activeTitle.getBoundingClientRect();
    const containerRect = activeTitle.parentElement?.getBoundingClientRect();
    if (!containerRect) return;
    const relativeX = titleRect.left - containerRect.left;

    const titleRectOpp = activeTitleOpp.getBoundingClientRect();
    const containerRectOpp = activeTitleOpp.parentElement?.getBoundingClientRect();
    if (!containerRectOpp) return;
    const relativeXOpp = titleRectOpp.left - containerRectOpp.left;

    // Creamos dos timelines: uno para la animación principal y otro para la "Opp"
    const timeline = gsap.timeline();
    const timelineOpp = gsap.timeline();
    const prevIndex = prevIndexRef.current;

    const transitionKey = `${prevIndex}-${currentIndex}`;
    // Función para animar la línea principal
    const animateMain = () => {
      switch (transitionKey) {
        case "2-1":
          timeline
            .to(verticalRef.current, { duration: 0.3, height: 0, ease: "linear" })
            .to(horizontalRef.current, { duration: 0.3, width: titleRect.width, scaleX: 1, ease: "linear" })
            .to(horizontalRef.current, { duration: 0.7, x: relativeX, ease: "back.out(1.1)" }, "<");
          break;
        case "2-0":
          timeline
            .to(verticalRef.current, { duration: 0.3, height: 0, ease: "linear" })
            .to(horizontalRef.current, { duration: 0.3, x: relativeX, ease: "linear" })
            .to(horizontalRef.current, { duration: 0.7, width: titleRect.width, ease: "back.out(1.1)" })
            .set(verticalRef.current, { x: relativeX }, "<")
            .to(verticalRef.current, { duration: 0.7, height: 60, ease: "back.out(1.1)" }, "<");
          break;
        case "0-2":
          timeline
            .to(verticalRef.current, { duration: 0.3, height: 0, ease: "linear" })
            .to(horizontalRef.current, { duration: 0.3, x: relativeX, ease: "linear" })
            .to(horizontalRef.current, { duration: 0.1, width: titleRect.width, transformOrigin: "right center", ease: "back.out(1.1)" })
            .set(verticalRef.current, { x: relativeX + titleRect.width })
            .to(verticalRef.current, { duration: 0.3, height: 60, ease: "back.out(1.1)" }, "<");
          break;
        default:
          // Animaciones según el currentIndex cuando no se cumple una transición específica
          switch (currentIndex) {
            case 0:
              timeline
                .to(horizontalRef.current, { duration: 0.3, x: relativeX, ease: "linear" })
                .to(horizontalRef.current, { duration: 0.3, width: titleRect.width, ease: "back.out(1.1)" })
                .set(verticalRef.current, { x: relativeX }, "<")
                .to(verticalRef.current, { duration: 0.7, height: 60, ease: "back.out(1.1)" }, "<");
              break;
            case 1:
              gsap.to(verticalRef.current, { duration: 0.3, height: 0, ease: "linear" });
              timeline
                .to(horizontalRef.current, { duration: 0.3, width: titleRect.width, ease: "linear" })
                .to(horizontalRef.current, { duration: 0.7, x: relativeX, ease: "back.out(1.1)" });
              break;
            case 2:
              gsap.to(horizontalRef.current, { duration: 0.3, x: relativeX, ease: "linear" });
              timeline
                .to(horizontalRef.current, { duration: 0.3, width: titleRect.width, transformOrigin: "right center", ease: "back.out(1.1)" })
                .set(verticalRef.current, { x: relativeX + titleRect.width })
                .to(verticalRef.current, { duration: 0.7, height: 60, ease: "back.out(1.1)" }, "<");
              break;
            default:
              break;
          }
          break;
      }
    };

    // Función para animar la línea Opp (aplica solo en currentIndex 0)
    const animateOpp = () => {
      switch (transitionKey) {
        case "2-1":
          timelineOpp
            .to(verticalOppRef.current, { duration: 0.3, height: 0, ease: "linear" })
            .to(horizontalOppRef.current, { duration: 0.3, width: titleRectOpp.width, scaleX: 1, ease: "linear" })
            .to(horizontalOppRef.current, { duration: 0.7, x: relativeXOpp, ease: "back.out(1.1)" }, "<");
          break;
        case "0-2":
          timelineOpp
            .to(verticalOppRef.current, { duration: 0.3, height: 0, ease: "linear" })
            .to(horizontalOppRef.current, { duration: 0.3, x: relativeXOpp, ease: "linear" })
            .to(horizontalOppRef.current, { duration: 0.7, width: titleRectOpp.width, ease: "back.out(1.1)" })
            .set(verticalOppRef.current, { x: relativeXOpp }, "<")
            .to(verticalOppRef.current, { duration: 0.7, height: 60, ease: "back.out(1.1)" }, "<");
          break;
        case "2-0":
          timelineOpp
            .to(verticalOppRef.current, { duration: 0.3, height: 0, ease: "linear" })
            .to(horizontalOppRef.current, { duration: 0.3, x: relativeXOpp, ease: "linear" })
            .to(horizontalOppRef.current, { duration: 0.1, width: titleRectOpp.width, transformOrigin: "right center", ease: "back.out(1.1)" })
            .set(verticalOppRef.current, { x: relativeXOpp + titleRectOpp.width })
            .to(verticalOppRef.current, { duration: 0.3, height: 60, ease: "back.out(1.1)" }, "<");
          break;
        default:
          switch (currentIndex) {
            case 2:
              timelineOpp
                .to(horizontalOppRef.current, { duration: 0.3, x: relativeXOpp, ease: "linear" })
                .to(horizontalOppRef.current, { duration: 0.3, width: titleRectOpp.width, ease: "back.out(1.1)" })
                .set(verticalOppRef.current, { x: relativeXOpp }, "<")
                .to(verticalOppRef.current, { duration: 0.7, height: 60, ease: "back.out(1.1)" }, "<");
              break;
            case 1:
              gsap.to(verticalOppRef.current, { duration: 0.3, height: 0, ease: "linear" });
              timelineOpp
                .to(horizontalOppRef.current, { duration: 0.3, width: titleRectOpp.width, ease: "linear" })
                .to(horizontalOppRef.current, { duration: 0.7, x: relativeXOpp, ease: "back.out(1.1)" });
              break;
            case 0:
              gsap.to(horizontalOppRef.current, { duration: 0.3, x: relativeXOpp, ease: "linear" });
              timelineOpp
                .to(horizontalOppRef.current, { duration: 0.3, width: titleRectOpp.width, transformOrigin: "right center", ease: "back.out(1.1)" })
                .set(verticalOppRef.current, { x: relativeXOpp + titleRectOpp.width })
                .to(verticalOppRef.current, { duration: 0.7, height: 60, ease: "back.out(1.1)" }, "<");
              break;
            default:
              break;       
        }
        break;
      } 
      
    };

    animateMain();
    animateOpp();
    prevIndexRef.current = currentIndex;
  }, [currentIndex, windowSize]);

  const goToIndex = (index: React.SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.textCarousel}>
      <div className={styles.cornerBottomRight}>
        {/* Líneas animadas */}
        <div ref={horizontalRef} className={styles.animatedLineHorizontal} />
        <div ref={verticalRef} className={styles.animatedLineVertical} />
        <div ref={horizontalOppRef} className={styles.animatedLineHorizontalOpp} />
        <div ref={verticalOppRef} className={styles.animatedLineVerticalOpp} />

        <div className={styles.titles}>
          {titles.map((title, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) titleRefs.current[index] = el;
              }}
              className={`${styles.title} ${index === currentIndex ? styles.active : ""}`}
              onClick={() => goToIndex(index)}
            >
              {title}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {/* 4) Render condicional:
              - Si es string, usamos dangerouslySetInnerHTML
              - Si es un componente, lo mostramos directamente
          */}
          {typeof contents[currentIndex] === "string" ? (
            <div
              className={styles.contentDiv}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(contents[currentIndex] as string),
              }}
            />
          ) : (
            contents[currentIndex] // En este caso, <TechnologiesGrid />
          )}
        </div>
      </div>
    </div>
  );
};

export default TextCarousel;