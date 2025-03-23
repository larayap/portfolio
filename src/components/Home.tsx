"use client";

import { motion } from "framer-motion";
import styles from "../styles/home.module.css"; // Importa el archivo CSS
import img from '../app/me.webp'; // Importa la imagen

const Home: React.FC = () => {
  return (
    <div className={styles.container}> {/* Aplica la clase container */}
      {/* Animación del texto */}
      <div className={styles.background}></div>
      <motion.div
        initial={{ opacity: 0 }} // Empieza fuera de la pantalla
        animate={{ x: 0, opacity: 1 }} // Termina en su posición original
        transition={{ duration: 2 }} // Duración de 1 segundo
        className={styles.textContainer} // Aplica la clase textContainer
      > 
        <h2 className={styles.open}>Hola! Yo soy...</h2>
        <h1 className={styles.header}>{' < Luis Araya />'}</h1>
        <h2 className={styles.subheader}>Desarrollador Fullstack</h2>
        <p className={styles.text}>...creando un impacto real con cada línea de código</p>
      </motion.div>

      {/* Animación de la imagen */}
      <motion.img
        src={img.src} // Reemplaza por la ruta de tu imagen
        alt="imagen"
        initial={{ opacity: 0 }} // Empieza fuera de la pantalla por la derecha
        animate={{ opacity: 1 }} // Termina en su posición original
        transition={{ duration: 2 }} // Duración de 1 segundo
        className={styles.image} // Aplica la clase image
      />
    </div>
  );
}

export default Home;