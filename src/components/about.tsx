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
  FaPython,
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
    { name: "Python", icon: <FaPython /> },
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
  const titles = ["Quien soy", "Experiencia", "Tecnologías"];
  const contents = [
    "<strong>¡Hola!</strong><br><br>Soy <strong>Luis Araya</strong>, un desarrollador Full Stack apasionado por crear soluciones digitales que marquen la diferencia. Mi enfoque combina la precisión técnica con la creatividad, transformando ideas complejas en experiencias de usuario intuitivas y elegantes.<br><br>Mi filosofía de desarrollo se centra en escribir código limpio, escalable y mantenible, siempre con el usuario final en mente. Disfruto especialmente de los desafíos técnicos que requieren pensar fuera de la caja y encontrar soluciones innovadoras.<br><br>Cuando no estoy programando, me sumerjo en el mundo de los videojuegos, una pasión que me ha enseñado la importancia del diseño centrado en el usuario, la iteración constante y la búsqueda de la excelencia. Creo firmemente que la tecnología tiene el poder de conectar personas y transformar realidades, y esa convicción me impulsa a dar lo mejor de mí en cada proyecto que desarrollo.",
    `
      <strong>
        <span class="company">AFP Modelo</span>
        <span class="job">Desarrollador Web (Ene 2024 - Presente)</span>
      </strong>
      <br>
      <p>
        En mi rol actual, participo en el desarrollo web con <strong>Vue, C# y PL/SQL</strong>, creando y manteniendo funcionalidades que optimizan la plataforma. Además, utilizo <strong>Python</strong> para tareas de automatización y soporte, lo que me permite mejorar procesos internos y agilizar la resolución de incidencias. Todo mi trabajo se orienta a la entrega eficiente de proyectos y tickets, gestionando versiones con GitLab.
      </p>
      <br>
      <ul>
        <li>Investigo y desarrollo nuevas funcionalidades que optimizan el rendimiento de la plataforma.</li>
        <li>Integro APIs RESTful para facilitar la comunicación entre diferentes partes del sistema.</li>
        <li>Automatizo procesos repetitivos para mejorar la efectividad y agilidad de los flujos internos.</li>
        <li>Soluciono bugs y advertencias del sistema reportados por los usuarios.</li>
        <li>Participo activamente en la migración de sistemas internos hacia plataformas web más modernas.</li>
        <li>Trabajo en equipo con distintas áreas bajo metodologías ágiles, reduciendo tiempos de entrega y mejorando la calidad del producto.</li>
      </ul>
      <br>
      <strong>
        <span class="company">Iplacex</span>
        <span class="job">Desarrollador de recursos web interactivos para la educación (Nov 2022 - Feb 2024)</span>
      </strong>
      <br>
      <p>
      Formé parte del equipo encargado de la transformación y adaptación estratégica de material educativo para la plataforma digital Rise, con el objetivo de crear experiencias de aprendizaje interactivas, dinámicas y atractivas.
      </p>
      <br>
      <ul>
        <li>Seleccioné y adapté material educativo para la plataforma digital Rise, asegurando la creación de experiencias de aprendizaje interactivas y atractivas.</li>
        <li>Optimicé la interfaz de la plataforma, logrando una experiencia de usuario fluida y envolvente.</li>
        <li>Colaboré con expertos en diseño instruccional para garantizar contenidos educativos de calidad y precisión.</li>
        <li>Me enfoqué en mantener altos estándares de innovación y calidad, revisando y mejorando cada aspecto del contenido.</li>
      </ul>
    `,
    <TechnologiesGrid key="technologies" />,
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 990);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  
  // Dentro de tu componente TextCarousel, declara un ref para el título mobile:
  const mobileTitleRef = useRef(null);

  useEffect(() => {
    if (mobileTitleRef.current) {
      gsap.fromTo(
        mobileTitleRef.current,
        { opacity: 0, x: -50, scale: 0.9 }, // inicia 100px a la izquierda
        { duration: 0.9, opacity: 1, x: 0, scale: 1, ease: "back.out(1.7)" }
      );
    }
  }, [currentIndex]);
  
  // Dentro de tu componente TextCarousel (versión mobile)
const containerRef = useRef(null);
const startX = useRef(0);
const deltaX = useRef(0);

const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  startX.current = e.touches[0].clientX;
};

const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
  deltaX.current = e.touches[0].clientX - startX.current;
};

const handleTouchEnd = () => {
  const threshold = 100; // Mínimo de pixeles para disparar el swipe
  if (deltaX.current < -threshold && currentIndex < titles.length - 1) {
    // Swipe hacia la izquierda: siguiente sección
    setCurrentIndex((prev) => prev + 1);
  } else if (deltaX.current > threshold && currentIndex > 0) {
    // Swipe hacia la derecha: sección anterior
    setCurrentIndex((prev) => prev - 1);
  }
  // Reiniciamos el delta para el próximo swipe
  deltaX.current = 0;
};


  if (isMobile) {
    return (
      <div className={styles.mobileCarouselWrapper}>
        {/* Header con título y flechas */}
        <div className={styles.mobileHeader}>
        {currentIndex > 0 && (
          <button
            className={styles.arrowButton}
            onClick={() =>
              setCurrentIndex((prev) => prev - 1)
            }
          >
            &#9664;
          </button>
        )}
          <div ref={mobileTitleRef} className={styles.mobileTitle}>
            {titles[currentIndex]}
          </div>
          {currentIndex < titles.length - 1 && (
            <button
              className={styles.arrowButton}
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev < titles.length - 1 ? prev + 1 : prev
                )
              }
            >
              &#9654;
            </button>
          )}
        </div>
        {/* Contenedor horizontal para el contenido */}
        <div
          className={styles.mobileContentContainer}
          // data-lenis-prevent
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {contents.map((content, index) => (
            <div
              key={index}
              className={`${styles.mobileSlide} ${
                index === currentIndex ? styles.activeSlide : ""
              }`}
            >
              {typeof content === "string" ? (
                <div
                  className={styles.contentDiv}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content),
                  }}
                />
              ) : (
                content
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  

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

        <div className={styles.content} /* data-lenis-prevent */>
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