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
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css/bundle";
import styles from "../styles/about.module.css";

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

const QuienSoy = () => (
  <div className={styles.contentDiv}>
    <strong>¡Hola!</strong>
    <br /><br />
    Soy <strong>Luis Araya</strong>, un desarrollador Full Stack apasionado por crear soluciones digitales que marquen la diferencia. Mi enfoque combina la precisión técnica con la creatividad, transformando ideas complejas en experiencias de usuario intuitivas y elegantes.
    <br /><br />
    Mi filosofía de desarrollo se centra en escribir código limpio, escalable y mantenible, siempre con el usuario final en mente. Disfruto especialmente de los desafíos técnicos que requieren pensar fuera de la caja y encontrar soluciones innovadoras.
    <br /><br />
    Cuando no estoy programando, me sumerjo en el mundo de los videojuegos, una pasión que me ha enseñado la importancia del diseño centrado en el usuario, la iteración constante y la búsqueda de la excelencia. Creo firmemente que la tecnología tiene el poder de conectar personas y transformar realidades, y esa convicción me impulsa a dar lo mejor de mí en cada proyecto que desarrollo.
  </div>
);

const Experiencia = () => (
  <div className={styles.contentDiv}>
    <strong>
      <span className="company">AFP Modelo</span>
      <span className="job">Desarrollador Web (Ene 2024 - Presente)</span>
    </strong>
    <br />
    <p>
      En mi rol actual, participo en el desarrollo web con <strong>Vue, C# y PL/SQL</strong>, creando y manteniendo funcionalidades que optimizan la plataforma. Además, utilizo <strong>Python</strong> para tareas de automatización y soporte, lo que me permite mejorar procesos internos y agilizar la resolución de incidencias. Todo mi trabajo se orienta a la entrega eficiente de proyectos y tickets, gestionando versiones con GitLab.
    </p>
    <br />
    <ul>
      <li>Investigo y desarrollo nuevas funcionalidades que optimizan el rendimiento de la plataforma.</li>
      <li>Integro APIs RESTful para facilitar la comunicación entre diferentes partes del sistema.</li>
      <li>Automatizo procesos repetitivos para mejorar la efectividad y agilidad de los flujos internos.</li>
      <li>Soluciono bugs y advertencias del sistema reportados por los usuarios.</li>
      <li>Participo activamente en la migración de sistemas internos hacia plataformas web más modernas.</li>
      <li>Trabajo en equipo con distintas áreas bajo metodologías ágiles, reduciendo tiempos de entrega y mejorando la calidad del producto.</li>
    </ul>
    <br />
    <strong>
      <span className="company">Iplacex</span>
      <span className="job">Desarrollador de recursos web interactivos para la educación (Nov 2022 - Feb 2024)</span>
    </strong>
    <br />
    <p>
      Formé parte del equipo encargado de la transformación y adaptación estratégica de material educativo para la plataforma digital Rise, con el objetivo de crear experiencias de aprendizaje interactivas, dinámicas y atractivas.
    </p>
    <br />
    <ul>
      <li>Seleccioné y adapté material educativo para la plataforma digital Rise, asegurando la creación de experiencias de aprendizaje interactivas y atractivas.</li>
      <li>Optimicé la interfaz de la plataforma, logrando una experiencia de usuario fluida y envolvente.</li>
      <li>Colaboré con expertos en diseño instruccional para garantizar contenidos educativos de calidad y precisión.</li>
      <li>Me enfoqué en mantener altos estándares de innovación y calidad, revisando y mejorando cada aspecto del contenido.</li>
    </ul>
  </div>
);

const TextCarousel = () => {
  const titles = ["Quien soy", "Experiencia", "Tecnologías"];
  const contents = [
    <QuienSoy key="quien-soy" />,
    <Experiencia key="experiencia" />,
    <TechnologiesGrid key="tecnologias" />,
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

  useEffect(() => {
    titleRefs.current = titleRefs.current.slice(0, titles.length);
  }, [titles.length]);

  useEffect(() => {
    if (!horizontalRef.current || !verticalRef.current) return;

    gsap.killTweensOf(horizontalRef.current);
    gsap.killTweensOf(verticalRef.current);
    gsap.killTweensOf(horizontalOppRef.current);
    gsap.killTweensOf(verticalOppRef.current);

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

    const timeline = gsap.timeline();
    const timelineOpp = gsap.timeline();
    const prevIndex = prevIndexRef.current;

    const transitionKey = `${prevIndex}-${currentIndex}`;

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

  const mobileTitleRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (mobileTitleRef.current && isMobile) {
      gsap.fromTo(
        mobileTitleRef.current,
        { opacity: 0, y: -15 },
        { duration: 0.8, opacity: 1, y: 0, ease: "power2.out" }
      );
    }
  }, [currentIndex, isMobile]);

  useEffect(() => {
    if (!isMobile || !topLineRef.current || !bottomLineRef.current) return;

    gsap.fromTo(
      topLineRef.current,
      { scaleX: 0, transformOrigin: "center" },
      { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
    );

    gsap.fromTo(
      bottomLineRef.current,
      { scaleX: 0, transformOrigin: "center" },
      { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
    );
  }, [currentIndex, isMobile]);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentIndex(swiper.activeIndex);
  };

  if (isMobile) {
    return (
      <div className={styles.mobileCarouselWrapper}>
        <div ref={topLineRef} className={styles.topLine} />

        <div className={styles.mobileHeader}>
          <div ref={mobileTitleRef} className={styles.mobileTitle}>
            {titles[currentIndex]}
          </div>
        </div>

        <div className={styles.mobileContentContainer}>
          <Swiper
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            modules={[Pagination, A11y]}
            pagination={{
              clickable: true,
              el: '.custom-pagination',
            }}
            className={styles.swiperContainer}
          >
            {contents.map((content, index) => (
              <SwiperSlide key={index} className={styles.swiperSlide}>
                <div className={styles.mobileSlide}>
                  {content}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={`custom-pagination ${styles.customPagination}`}></div>
        <div ref={bottomLineRef} className={styles.bottomLine} />
      </div>
    );
  }

  return (
    <div className={styles.textCarousel}>
      <div className={styles.cornerBottomRight}>
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
          {contents[currentIndex]}
        </div>
      </div>
    </div>
  );
};

export default TextCarousel;