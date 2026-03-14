"use client";

import Head from 'next/head';
import dynamic from "next/dynamic";
import Home from '@/components/Home';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from 'react';
import Lenis from 'lenis'
import img from '../app/me.webp';

const FuturisticLines = dynamic(() => import('@/components/FuturisticLines'), {
  ssr: false,
});

const FuturisticLinesMobile = dynamic(() => import('@/components/FuturisticLinesMobile'), {
  ssr: false,
});

const About = dynamic(() => import('@/components/AboutMe'), {
  ssr: false,
});

// Componente Loader con animación de spinner
const Loader = () => {
  return (
    <div className="loader">
      <div className="loaderContent">
        <h1 className="loaderTitle">Luis Araya</h1>
        <div className="loaderSubtitle">Desarrollador Full Stack</div>
        <div className="spinnerContainer">
          <div className="spinner"></div>
        </div>
        <div className="loadingText">Cargando...</div>
      </div>
    </div>
  );
};

const Main: React.FC = () => {
  // Estado para saber si ya cargó la página
  const [isLoaded, setIsLoaded] = useState(false);
  // Estado para verificar que el CSS esté listo
  const [cssReady, setCssReady] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const pre = new Image();
    pre.src = img.src;
  }, []);

  useEffect(() => {
    // Verificar que el CSS esté cargado
    const checkCssReady = () => {
      // Verificar que los estilos estén disponibles
      const testElement = document.createElement('div');
      testElement.className = 'loader';
      document.body.appendChild(testElement);
      
      // Si podemos obtener los estilos computados, el CSS está listo
      const styles = window.getComputedStyle(testElement);
      const backgroundColor = styles.backgroundColor;
      
      document.body.removeChild(testElement);
      
      // Si el color de fondo es el esperado, el CSS está listo
      if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        setCssReady(true);
      } else {
        // Reintentar en 50ms
        setTimeout(checkCssReady, 50);
      }
    };

    // Verificar CSS inmediatamente
    checkCssReady();
  }, []);

  useEffect(() => {
    // Solo verificar la carga completa cuando el CSS esté listo
    if (!cssReady) return;

    // Función para verificar que todo esté listo
    const checkEverythingReady = () => {
      // Verificar que el CSS esté cargado
      const stylesLoaded = document.styleSheets.length > 0;
      
      // Verificar que las fuentes estén cargadas (si está disponible)
      const fontsReady = document.fonts ? document.fonts.status === 'loaded' : true;
      
      if (stylesLoaded && fontsReady) {
        // Esperar un poco más para asegurar que todo esté completamente cargado
        setTimeout(() => {
          setIsLoaded(true);
        }, 500);
      } else {
        // Reintentar en 100ms
        setTimeout(checkEverythingReady, 100);
      }
    };

    // Si el documento ya está listo, verificar
    if (document.readyState === "complete") {
      checkEverythingReady();
    } else {
      // Escuchamos el evento load
      window.addEventListener("load", checkEverythingReady);
      return () => {
        window.removeEventListener("load", checkEverythingReady);
      };
    }
  }, [cssReady]);

  useEffect(() => {
    // Inicializa Lenis para un scroll global suave
    const lenis = new Lenis({
      duration: 0.5, // Reducido de 1.2 a 0.5 segundos para una respuesta más rápida
      easing: (t) => 1 - Math.pow(1 - t, 2), // Easing cuadrático ease-out, que acelera rápido y se suaviza al final
      allowNestedScroll: true,
      prevent: (node) => node.matches('[data-lenis-prevent]')
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  
  // Si la página aún no está cargada o el CSS no está listo, mostramos el loader
  if (!isLoaded || !cssReady) {
    return <Loader />;
  }

  const NavbarWrapper = () => {

    return (
      <>
        {isMobile ? (
          <>
            <FuturisticLinesMobile />
            <MobileNavbar />
          </>
        ) : (
          <FuturisticLines />
        )}
      </>
    );
  };
  
  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Efecto de líneas futuristas animadas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="preload" as="image" href={img.src} />
      </Head>
      <main style={{ margin: 0, overflowX: 'hidden'}}>
        {/* Líneas futuristas como barra de navegación */}
        <section style={{ position: 'fixed', zIndex: 999}}>
          <NavbarWrapper />
        </section>

        {/* Primera Sección */}
        <section id="home" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <Home />
        </section>

        {/* Segunda Sección */}
        <section 
          id="aboutme" 
          style={{ 
            height: '100vh', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 100, 
            minHeight: isMobile ? '0' : '600px',
            paddingTop: isMobile ? '65px' : '0',
            paddingBottom: isMobile ? '35px' : '0',
          }}
        >
          <About />
        </section>

        {/* Tercera Sección */}
        <section id="projects" style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, paddingTop: isMobile ? '60px' : '0' }}>
          <Projects />
        </section>
        
        {/* Cuarta Sección */}
        <section id="contact" style={{ position: "relative", height: '100vh', minHeight: '725px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Contact />
          <Footer />
        </section>
      </main>
    </>
  );
};

export default Main;
