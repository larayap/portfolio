import React, { useEffect, useState } from 'react';
import styles from '../styles/FooterText.module.css';
import { AiFillLinkedin, AiFillGithub, AiOutlineMail } from 'react-icons/ai';

const FooterText: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1100);
    };

    handleResize(); // comprobación inicial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className={styles.footerContainer}>
      {isSmallScreen && (
        <div className={styles.icons}>
          <a
            href="https://www.linkedin.com/in/luis-alberto-araya-pardo-38308518/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillLinkedin />
          </a>
          <a
            href="https://github.com/Flacamasu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiFillGithub />
          </a>
          <a
            href="mailto:l.arayapardo.dev@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AiOutlineMail  />
          </a>
        </div>
      )}
      <p className={styles.footerText}>
        © Copyright 2025. Luis Araya
      </p>
    </div>
  );
};

export default FooterText;