/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/contact.module.css";

const ContactSection = () => {
  const formRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Activamos la animación cuando el formulario entra en la vista
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }
    return () => observer.disconnect();
  }, []);

  interface ContactFormData {
    email: string;
    subject: string;
    message: string;
  }

  interface ExtendedForm extends HTMLFormElement {
    email: { value: string };
    subject: { value: string };
    message: { value: string };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const target = e.target as ExtendedForm;
    const formData: ContactFormData = {
      email: target.email.value,
      subject: target.subject.value,
      message: target.message.value,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_SEND}/sendEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Mensaje enviado correctamente.");
        target.reset();
      } else {
        setStatus("Hubo un error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario", error);
      setStatus("Hubo un error al enviar el mensaje.");
    }
  };

  return (
    <div className={styles.contactSection}>
      <div
        ref={formRef}
        className={`${styles.contactBox} ${visible ? styles.visible : ""}`}
      >
        {/* Elementos de borde en cada esquina */}
        <span className={styles.cornerTopLeft}></span>
        <span className={styles.cornerTopRight}></span>
        <span className={styles.cornerBottomLeft}></span>
        <span className={styles.cornerBottomRight}></span>

        <h1 className={styles.title}>Contacto</h1>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Tu correo</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Asunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Asunto"
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroupFull}>
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tu mensaje"
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.submitButton}>
            Enviar
          </button>
          {status && <p>{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactSection;
