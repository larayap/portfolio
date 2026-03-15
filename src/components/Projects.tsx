/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import projectsData from "../utils/projectsConfig.json";
import styles from "../styles/projects.module.css";
import { FaGithub, FaEye } from "react-icons/fa";
import { gsap } from "gsap";
import { throttle } from "../utils/performanceUtils";

type Project = {
  image: string;
  title: string;
  description?: string;
  technologies: string[];
  link: string;
  github?: string;
};

const projectsDataTyped = projectsData as Project[];

// Modal para mostrar la descripción completa del proyecto (accesible, teclado, foco, animaciones)
const DescriptionModal: React.FC<{
  project: Project;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}> = ({ project, onClose, closeButtonRef }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const descriptionId = "project-description-full";
  const titleId = "project-modal-title";
  const EXIT_DURATION_MS = 200;

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => onClose(), EXIT_DURATION_MS);
  }, [onClose, isClosing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;
      const focusable = contentRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [handleClose]
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusTimer = requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(focusTimer);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [closeButtonRef]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) handleClose();
  };

  return (
    <div
      ref={overlayRef}
      className={`${styles.modalOverlay} ${isClosing ? styles.modalOverlayClosing : ""}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div ref={contentRef} className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 id={titleId} className={styles.modalTitle}>
          {project.title}
        </h2>
        <p id={descriptionId} className={styles.modalDescription}>
          {project.description || "Proyecto destacado."}
        </p>
        {project.technologies.length > 0 && (
          <div className={styles.modalTechList} aria-label={`Tecnologías: ${project.technologies.join(", ")}`}>
            {project.technologies.map((tech) => (
              <span key={tech} className={styles.modalTechTag}>{tech}</span>
            ))}
          </div>
        )}
        {(project.link || project.github) && (
          <div className={styles.modalLinks}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalLink}
                aria-label={`Ver proyecto: ${project.title}`}
              >
                <FaEye aria-hidden /> Ver proyecto
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalLink}
                aria-label={`Repositorio de ${project.title} en GitHub`}
              >
                <FaGithub aria-hidden /> Código en GitHub
              </a>
            )}
          </div>
        )}
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.modalCloseButton}
          onClick={handleClose}
          aria-label="Cerrar descripción"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

// Configuración de los parámetros de animación (desktop)
const spacing = 270;           // Espaciado vertical entre cards de la misma columna
const initialOffset = 300;     // Desplazamiento inicial desde el tope del contenedor
const bottomMargin = 580;      // Altura reservada para la última card + margen bajo ella

// Componente de filtros
const CategoryFilters: React.FC<{ 
  selectedCategory: string; 
  onCategoryChange: (category: string) => void;
  categories: string[];
}> = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className={styles.filtersContainer}>
      <button
        type="button"
        className={`${styles.filterButton} ${selectedCategory === "Todas las tecnologías" ? styles.active : ""}`}
        onClick={() => onCategoryChange("Todas las tecnologías")}
        aria-pressed={selectedCategory === "Todas las tecnologías"}
        aria-label="Mostrar todos los proyectos"
      >
        Todas las tecnologías
      </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={`${styles.filterButton} ${selectedCategory === category ? styles.active : ""}`}
          onClick={() => onCategoryChange(category)}
          aria-pressed={selectedCategory === category}
          aria-label={`Filtrar proyectos por ${category}`}
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
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas las tecnologías");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  // Obtener todas las tecnologías únicas de todos los proyectos
  const categories = useMemo(() => {
    const allTechnologies = projectsDataTyped.flatMap(project => project.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)].sort();
    return uniqueTechnologies;
  }, []);

  // Filtrar proyectos por tecnología
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Todas las tecnologías") {
      return projectsDataTyped;
    }
    return projectsDataTyped.filter(project =>
      project.technologies.includes(selectedCategory)
    );
  }, [selectedCategory]);

  // Calcula la altura dinámica del contenedor con throttle
  useEffect(() => {
    const updateContainerHeight = () => {
      const newHeight = initialOffset + (filteredProjects.length - 1) * spacing + bottomMargin;
      setContainerHeight(newHeight);
    };

    updateContainerHeight();

    const throttledResize = throttle(updateContainerHeight, 150);
    window.addEventListener("resize", throttledResize);
    return () => window.removeEventListener("resize", throttledResize);
  }, [filteredProjects.length]);

  // Calcula el progreso del scroll relativo al contenedor con throttle
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!containerRef.current || containerHeight <= 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawProgress = (window.innerHeight - rect.top) / containerHeight;
      const progress = Number.isFinite(rawProgress) ? rawProgress : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    }, 16); // ~60fps

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [containerHeight]);

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
    scrollProgress < threshold
      ? scrollProgress * 0.9
      : 0.9 + Math.pow((scrollProgress - threshold) / (1 - threshold), 2) * 0.1;

  return (
    <div
      ref={containerRef}
      className={styles.projectsSection}
      style={{ height: `${containerHeight}px` }}
      data-testid="projects-section-desktop"
    >
      <div ref={titleRef} className={`${styles.titleContainer}`}>
        <h1 className={`${styles.title} ${titleVisible ? styles.visible : ""}`}>Proyectos</h1>
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>

      {/* Línea central con CSS transition para suavizado */}
      <div
        className={styles.centralLine}
        style={{
          transform: `scaleY(${Math.min(scaleValue, 1)})`,
          transition: 'transform 0.1s ease-out'
        }}
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
            data-testid="project-card"
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
                aria-label={`Ver proyecto: ${project.title}`}
              >
                <span>
                  Ver proyecto <FaEye aria-hidden />
                </span>
              </a>
            </div>
            <h2 className={styles.projectTitle}>
              {project.title}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubIcon}
                  aria-label={`Repositorio de ${project.title} en GitHub`}
                >
                  <FaGithub />
                </a>
              )}
            </h2>
            <p className={styles.projectDescription}>
              {project.description || "Proyecto destacado."}
            </p>
            <button
              type="button"
              className={styles.verMasButton}
              onClick={() => setModalProject(project)}
              aria-label={`Ver descripción completa de ${project.title}`}
            >
              Ver más
            </button>
            <div className={styles.projectTechList} aria-label={`Tecnologías usadas en ${project.title}`}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.projectTechTag}>{tech}</span>
              ))}
            </div>
          </div>
        );
      })}
      {modalProject && (
        <DescriptionModal
          project={modalProject}
          onClose={() => setModalProject(null)}
          closeButtonRef={modalCloseRef}
        />
      )}
    </div>
  );
};

// Componente para la versión mobile (para pantallas de 768px o menos)
// El título se muestra centrado verticalmente y los proyectos se listan en forma vertical.
const ProjectsSectionMobile: React.FC = () => {
  const projectBoxMobileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerMobileRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const [scrollProgressMobile, setScrollProgressMobile] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todas las tecnologías");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const allTechnologies = projectsDataTyped.flatMap(project => project.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)].sort();
    return uniqueTechnologies;
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "Todas las tecnologías") {
      return projectsDataTyped;
    }
    return projectsDataTyped.filter(project =>
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
                ease: "power2.out",
              });
            } else {
              gsap.to(box, {
                opacity: 0, // FIX: estaba en 1, causaba que no se ocultara
                y: -50,
                duration: 0.8,
                ease: "power2.in",
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

  // Listener para calcular el progreso de scroll en la sección mobile con throttle
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!containerMobileRef.current) return;
      const rect = containerMobileRef.current.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / rect.height;
      setScrollProgressMobile(Math.min(1, Math.max(0, progress)));
    }, 16);

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div ref={containerMobileRef} className={styles.projectsSectionMobile} data-testid="projects-section-mobile">
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
        style={{
          transform: `scaleY(${scrollProgressMobile})`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div className={styles.projectsList}>
        {filteredProjects.map((project, index) => (
          <div
            key={index}
            ref={(el) => { projectBoxMobileRefs.current[index] = el; }}
            className={styles.projectBoxMobile}
            style={{ opacity: 0, transform: "translateY(50px)" }}
            data-testid="project-card"
          >
            <div className={styles.imageContainerMobile}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.projectImageMobile}
                loading="lazy"
              />
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.imageOverlayMobile}
                aria-label={`Ver proyecto: ${project.title}`}
              >
                <span>
                  Ver proyecto <FaEye aria-hidden />
                </span>
              </a>
            </div>
            <h3 className={styles.projectTitleMobile}>
              {project.title}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Repositorio de ${project.title} en GitHub`}
                  className={styles.githubIconMobile}
                >
                  <FaGithub />
                </a>
              )}
            </h3>
            <p className={styles.projectDescriptionMobile}>
              {project.description || "Proyecto destacado."}
            </p>
            <button
              type="button"
              className={styles.verMasButtonMobile}
              onClick={() => setModalProject(project)}
              aria-label={`Ver descripción completa de ${project.title}`}
            >
              Ver más
            </button>
            <div className={styles.projectTechListMobile} aria-label={`Tecnologías usadas en ${project.title}`}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.projectTechTagMobile}>{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {modalProject && (
        <DescriptionModal
          project={modalProject}
          onClose={() => setModalProject(null)}
          closeButtonRef={modalCloseRef}
        />
      )}
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
