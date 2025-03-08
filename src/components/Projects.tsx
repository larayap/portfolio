/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef } from "react";
import projectsData from "../utils/projectsConfig.json";
import styles from "../styles/projects.module.css";
import { FaGithub, FaEye } from "react-icons/fa";
import { gsap } from "gsap";

// Configuración de los parámetros de animación
const spacing = 200;           // Espaciado entre cada proyecto (en px)
const initialOffset = 300;     // Desplazamiento inicial desde el tope del contenedor
const bottomMargin = 300;      // Espacio inferior para que el último proyecto se vea bien

const ProjectsSectionDesktop: React.FC = () => {
  const titleRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);

  // Calcula la altura dinámica del contenedor
  useEffect(() => {
    const updateContainerHeight = () => {
      const newHeight = initialOffset + (projectsData.length - 1) * spacing + bottomMargin
      setContainerHeight(newHeight);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  // Calcula el progreso del scroll relativo al contenedor
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || containerHeight === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / containerHeight;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerHeight]);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setSmoothProgress(prev => prev + (scrollProgress - prev) * 0.1);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollProgress]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Si el elemento está intersectando, se hace visible; de lo contrario, se oculta.
          setTitleVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

// Definimos un umbral a partir del cual se transiciona
const threshold = 0.95;
const scaleValue =
  smoothProgress < threshold
    ? smoothProgress * 0.9
    : 0.9 + Math.pow((smoothProgress - threshold) / (1 - threshold), 2) * 0.1;
  return (
    <div
      ref={containerRef}
      className={styles.projectsSection}
      style={{ height: `${containerHeight}px` }}
    >
      <div
        ref={titleRef}
        className={`${styles.titleContainer}`}
      >
        <h1 className={`${styles.title} ${titleVisible ? styles.visible : ""}`} >Proyectos</h1>
      </div>
      {/* La línea central se escala en Y directamente según scrollProgress */}
      <div
        className={styles.centralLine}
        style={{ transform: `scaleY(${Math.min(scaleValue, 1)})` }}
      />
      {projectsData.map((project, index) => {
        // Se posiciona cada proyecto a partir del offset inicial y el espaciado definido
        const projectTop = initialOffset + index * spacing;
        // Se calcula el trigger aplicando un factor para retrasar la aparición
        const projectTrigger = projectTop / containerHeight;
        const delay = 0.2
        const isVisible = scrollProgress >= Math.min(1, projectTrigger + delay);
        // Alterna la posición lateral
        const side = index % 2 === 0 ? "left" : "right";

        return (
          <div
            key={index}
            className={`${styles.projectBox} ${isVisible ? styles.visible : ""} ${styles[side]}`}
            style={{ top: `${projectTop}px` }}
          >
            <div className={styles.imageContainer}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.projectImage}
              />
              {/* Overlay que aparece al hacer hover en la imagen */}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.imageOverlay}
              >
                <span>Ver</span>
                <FaEye style={{ marginLeft: "5px" }} />
              </a>
            </div>
            <h3 className={styles.projectTitle}>
              {project.title}
              {/* Icono de GitHub a la derecha del título */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubIcon}
                >
                  <FaGithub />
                </a>
              )}
            </h3>
            <p className={styles.projectTech}>
              {project.technologies.join(", ")}
            </p>
          </div>
        );
      })}
    </div>
  );
};

// Componente para la versión mobile (para pantallas de 768px o menos)
// El título se muestra centrado verticalmente y los proyectos se listan en forma vertical.
const ProjectsSectionMobile: React.FC = () => {
  const projectBoxMobileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerMobileRef = useRef<HTMLDivElement>(null);
  const [scrollProgressMobile, setScrollProgressMobile] = useState(0);

  // Observadores para animar cada caja de proyecto
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    projectBoxMobileRefs.current.forEach((box) => {
      if (box) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              gsap.to(box, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power1.out",
              });
            } else {
              gsap.to(box, {
                opacity: 1,
                y: -50,
                duration: 0.8,
                ease: "power1.in",
              });
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(box);
        observers.push(observer);
      }
    });
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Listener para calcular el progreso de scroll en la sección mobile
  useEffect(() => {
    const handleScroll = () => {
      if (!containerMobileRef.current) return;
      const rect = containerMobileRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / rect.height;
      setScrollProgressMobile(Math.min(1, Math.max(0, progress)));
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div ref={containerMobileRef} className={styles.projectsSectionMobile}>
      <div className={styles.titleContainerMobile}>
        <h1 className={styles.titleMobile}>Proyectos</h1>
      </div>
      <div
        className={styles.centralLineMobile}
        style={{ transform: `scaleY(${scrollProgressMobile})` }}
      />
      <div className={styles.projectsList}>
        {projectsData.map((project, index) => (
          <div
            key={index}
            ref={(el) => { projectBoxMobileRefs.current[index] = el; }}
            className={styles.projectBoxMobile}
            style={{ opacity: 0, transform: "translateY(50px)" }}
          >
            <div className={styles.imageContainerMobile}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.projectImageMobile}
              />
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.imageOverlayMobile}
              >
                <span>Ver</span>
                <FaEye style={{ marginLeft: "5px" }} />
              </a>
            </div>
            <h3 className={styles.projectTitleMobile}>
              {project.title}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubIconMobile}
                >
                  <FaGithub />
                </a>
              )}
            </h3>
            <p className={styles.projectTechMobile}>
              {project.technologies.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <ProjectsSectionMobile /> : <ProjectsSectionDesktop />;
};

export default ProjectsSection;
