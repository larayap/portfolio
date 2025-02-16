import Head from 'next/head';
import FuturisticLines from '@/components/FuturisticLines';
import Home from '@/components/Home';
import About from '@/components/About';

const Main: React.FC = () => {
  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Efecto de líneas futuristas animadas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ margin: 0, overflowX: 'hidden', background: 'black' }}>
        {/* Líneas futuristas como barra de navegación */}
        <section style={{ position: 'fixed' }}>
          <FuturisticLines />
        </section>

        {/* Primera Sección */}
        <section id="home" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <Home />
        </section>

        {/* Segunda Sección */}
        <section id="aboutme" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <About />
        </section>

        {/* Tercera Sección */}
        <section id="projects" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <h2>Proyecto</h2>
        </section>
        
        {/* Cuarta Sección */}
        <section id="contact" style={{ height: '100vh', background: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Contacto</h2>
        </section>
      </main>
    </>
  );
};

export default Main;
