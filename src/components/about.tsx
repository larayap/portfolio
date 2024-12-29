"use client";

import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "20px",
        width: "50%",
      }}
    >
      {/* Animación del texto */}
      <motion.div
        initial={{ x: -150, opacity: 0 }} // Empieza fuera de la pantalla
        animate={{ x: 0, opacity: 1 }} // Termina en su posición original
        transition={{ duration: 2 }} // Duración de 1 segundo
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
        }}
      > 
        <h2>Flama</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae veniam quam harum! Earum, voluptas! Autem atque quia, excepturi quidem dicta amet illum? Ipsum fuga nobis explicabo aperiam impedit suscipit officiis.
        Repellendus eos doloremque laboriosam quibusdam non delectus optio, sequi dicta veniam voluptas? Vitae in neque dicta iste ut voluptatibus eveniet totam facilis, error quidem veritatis unde iusto dolor, laborum iure?
        Doloremque provident nemo assumenda porro? Dicta nulla deleniti placeat labore reprehenderit magni voluptate doloremque eveniet nemo aliquam quas quibusdam ad suscipit molestias sequi exercitationem dignissimos repellat, officia culpa ea omnis?.</p>
      </motion.div>

      {/* Animación de la imagen */}
      <motion.img
        src="https://img.freepik.com/fotos-premium/radiant-cosmic-guardian-imagen-perfil-epica-que-combina-estilos-pop-manga-anime-w-brillante_983420-10092.jpg" // Reemplaza por la ruta de tu imagen
        alt="imagen"
        initial={{ x: 150, opacity: 0 }} // Empieza fuera de la pantalla por la derecha
        animate={{ x: 0, opacity: 1 }} // Termina en su posición original
        transition={{ duration: 2 }} // Duración de 1 segundo
        style={{
          width: "300px",
          height: "auto",
          borderRadius: "10px", // Opcional, para bordes redondeados
        }}
      />
    </div>
  );
}

export default About;