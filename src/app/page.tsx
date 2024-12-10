import Head from 'next/head';
import FuturisticLines from '@/components/FuturisticLines';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Líneas Futuristas</title>
        <meta name="description" content="Efecto de líneas futuristas animadas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main style={{ margin: 0, overflow: 'hidden', background: 'black', height: '100vh' }}>
        <FuturisticLines />
      </main>
    </>
  );
};

export default Home;
