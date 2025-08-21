/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import projectsData from "../utils/projectsConfig.json";
import styles from "../styles/projects.module.css";
import { FaGithub, FaEye } from "react-icons/fa";
import { gsap } from "gsap";

// Configuración de los parámetros de animación
const spacing = 200;           // Espaciado entre cada proyecto (en px)
const initialOffset = 300;     // Desplazamiento inicial desde el tope del contenedor
const bottomMargin = 300;      // Espacio inferior para que el último proyecto se vea bien

// Componente de filtros
const CategoryFilters: React.FC<{ 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void;
  categories: string[];
}> = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className={styles.filtersContainer}>
      <button
        className={`${styles.filterButton} ${selectedCategory === "Todas las tecnologías" ? styles.active : ""}`}
        onClick={() => onCategoryChange("Todas las tecnologías")}
      >
        Todas las tecnologías
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const ProjectsSectionDesktop: React.FC = () => {
  const titleRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas las tecnologías");

  // Obtener todas las tecnologías únicas de todos los proyectos
  const categories = useMemo(() => {
    const allTechnologies = projectsData.flatMap(project => project.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)].sort();
    return uniqueTechnologies;
  }, []);

  // Filtrar proyectos por tecnología
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Todas las tecnologías") {
      return projectsData;
    }
    return projectsData.filter(project => 
      project.technologies.includes(selectedCategory)
    );
  }, [selectedCategory]);

  // Calcula la altura dinámica del contenedor
  useEffect(() => {
    const updateContainerHeight = () => {
      const newHeight = initialOffset + (filteredProjects.length - 1) * spacing + bottomMargin
      setContainerHeight(newHeight);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => window.removeEventListener("resize", updateContainerHeight);
  }, [filteredProjects.length]);

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
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>
      {/* La línea central se escala en Y directamente según scrollProgress */}
      <div
        className={styles.centralLine}
        style={{ transform: `scaleY(${Math.min(scaleValue, 1)})` }}
      />
      {filteredProjects.map((project, index) => {
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
                loading="lazy"
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
            <h1 className={styles.projectTitle}>
              {project.title}
              {/* Icono de GitHub a la derecha del título */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubIcon}
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
              )}
            </h1>
            <p className={styles.projectTech}>
              {project.technologies.join(", ")}
            </p>
{/*             <div className={styles.projectCategory}>
              {project.category}
            </div> */}
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
  const [selectedCategory, setSelectedCategory] = useState("Todas las tecnologías");

  // Obtener todas las tecnologías únicas de todos los proyectos
  const categories = useMemo(() => {
    const allTechnologies = projectsData.flatMap(project => project.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)].sort();
    return uniqueTechnologies;
  }, []);

  // Filtrar proyectos por tecnología
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Todas las tecnologías") {
      return projectsData;
    }
    return projectsData.filter(project => 
      project.technologies.includes(selectedCategory)
    );
  }, [selectedCategory]);

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
  }, [filteredProjects]);

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
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>
      <div
        className={styles.centralLineMobile}
        style={{ transform: `scaleY(${scrollProgressMobile})` }}
      />
      <div className={styles.projectsList}>
        {filteredProjects.map((project, index) => (
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
                  aria-label="GitHub"
                  className={styles.githubIconMobile}
                >
                  <FaGithub />
                </a>
              )}
            </h3>
            <p className={styles.projectTechMobile}>
              {project.technologies.join(", ")}
            </p>
           {/*  <div className={styles.projectCategoryMobile}>
              {project.category}
            </div> */}
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
