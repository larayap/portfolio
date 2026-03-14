"use client";

import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { TbFileCv } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBorder from "./AnimatedBorder";
import styles from "../styles/mobileNavbar.module.css";

const MobileNavbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cvTrigger, setCvTrigger] = useState(true);
  const [menuTrigger, setMenuTrigger] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    // Trigger animación del botón menú
    setMenuTrigger(prev => !prev);
  };

  // Variantes de animación para items del menú
  const menuItemVariants = {
    closed: { opacity: 0, x: 50 },
    open: { opacity: 1, x: 0 }
  };

  const containerVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const navItems = [
    { label: "Inicio", href: "#home" },
    { label: "Sobre mí", href: "#aboutme" },
    { label: "Proyectos", href: "#projects" },
    { label: "Contacto", href: "#contact" }
  ];

  return (
    <nav className={styles.mobileNavbar}>
      {/* Fondo con glassmorphism */}
      <motion.div
        className={styles.navBackground}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />

      {/* Línea decorativa superior */}
      <motion.div
        className={styles.decorativeLine}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      />

      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <motion.div
            className={styles.cvContainer}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatedBorder trigger={cvTrigger}>
              <motion.a
                href="/CV - Luis Araya.pdf"
                download="CV-Luis-Araya.pdf"
                className={styles.cvLink}
                aria-label="Descargar CV"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCvTrigger(prev => !prev)}
              >
                <TbFileCv size={28} />
              </motion.a>
            </AnimatedBorder>
          </motion.div>
        </div>

        <div className={styles.navRight}>
          <AnimatedBorder trigger={menuTrigger}>
            <motion.button
              className={styles.menuButton}
              onClick={toggleMenu}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaTimes size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaBars size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className={styles.menuText}>Menú</span>
            </motion.button>
          </AnimatedBorder>
        </div>
      </div>

      {/* Menú desplegable con animaciones mejoradas */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.menuOverlay}
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <ul className={styles.menuList}>
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  variants={menuItemVariants}
                  whileHover={{
                    x: 10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <a href={item.href} onClick={toggleMenu}>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.08 }}
                    >
                      {item.label}
                    </motion.span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MobileNavbar;