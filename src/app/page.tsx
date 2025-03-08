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

const FuturisticLines = dynamic(() => import('@/components/FuturisticLines'), {
  ssr: false,
});

const About = dynamic(() => import('@/components/About'), {
  ssr: false,
});

const Main: React.FC = () => {
  

  useEffect(() => {
    // Inicializa Lenis para un scroll global suave
    const lenis = new Lenis({
      duration: 0.5, // Reducido de 1.2 a 0.5 segundos para una respuesta más rápida
      easing: (t) => 1 - Math.pow(1 - t, 2), // Easing cuadrático ease-out, que acelera rápido y se suaviza al final
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

  const NavbarWrapper = () => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 1100);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return isMobile ? <MobileNavbar /> : <FuturisticLines />;
  };
  
  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Efecto de líneas futuristas animadas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ margin: 0, overflowX: 'hidden', background: 'black' }}>
        {/* Líneas futuristas como barra de navegación */}
        <section style={{ position: 'fixed', zIndex: 999}}>
          <NavbarWrapper />
        </section>

        {/* Primera Sección */}
        <section id="home" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <Home />
        </section>

        {/* Segunda Sección */}
        <section id="aboutme" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, minHeight: '650px' }}>
          <About />
        </section>

        {/* Tercera Sección */}
        <section id="projects" style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <Projects />
        </section>
        
        {/* Cuarta Sección */}
        <section id="contact" style={{ position: "relative", height: '100vh', background: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Contact />
          <Footer />
        </section>
      </main>
    </>
  );
};

export default Main;
