"use client";

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbFileCv } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/mobileNavbar.module.css";

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className={styles.mobileNavbar}>
      <div className={styles.navLeft}>
        {/* Icono de CV en la esquina superior izquierda */}
        <a href="/CV - Luis Araya.pdf" download="CV-Luis-Araya.pdf" className={styles.cvLink} aria-label="Descargar CV">
          <TbFileCv size={40} />
        </a>
      </div>
      <div className={styles.navRight}>
        {/* Botón de menú (hamburguesa) en la esquina superior derecha */}
        <button className={styles.menuButton} onClick={toggleMenu}>
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FaTimes size={32} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <FaBars size={32} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      {/* Menú desplegable */}
      {menuOpen && (
        <div className={styles.menuOverlay}>
          <ul className={styles.menuList}>
            <li>
              <a href="#home" onClick={toggleMenu}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#aboutme" onClick={toggleMenu}>
                Sobre mí
              </a>
            </li>
            <li>
              <a href="#projects" onClick={toggleMenu}>
                Proyectos
              </a>
            </li>
            <li>
              <a href="#contact" onClick={toggleMenu}>
                Contacto
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;