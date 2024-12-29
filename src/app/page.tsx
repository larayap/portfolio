import Head from 'next/head';
import FuturisticLines from '@/components/FuturisticLines';
import About from '@/components/about';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Efecto de líneas futuristas animadas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ margin: 0, overflowX: 'hidden', background: 'black' }}>
        {/* Líneas futuristas como barra de navegación */}
        <section style={{ position: 'fixed', zIndex: 100 }}>
          <FuturisticLines />
        </section>

        {/* Primera Sección */}
        <section id="home" style={{ height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <About />
        </section>

        {/* Segunda Sección */}
        <section id="aboutme" style={{ height: '100vh', background: 'linear-gradient(to bottom, #1a1a1a, #333)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Acerca de Nosotros</h2>
        </section>

        {/* Tercera Sección */}
        <section id="contact" style={{ height: '100vh', background: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>Contacto</h2>
        </section>
      </main>
    </>
  );
};

export default Home;
