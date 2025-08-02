"use client";

import { useEffect, useState } from "react";
import styles from "./LocalizationContent.module.css";

export const LocalizationContent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkIfIsOpen = () => {
    let d = new Date();
    let hours = d.getHours();
    let day = d.getDay();

    return (
      day >= 2 &&
      hours >= 16 &&
      ((day < 5 && hours < 21) || (day == 5 && hours < 19))
    );
  };

  useEffect(() => {
    setIsOpen(checkIfIsOpen());
  }, [isOpen]);

  return (
    <>
      <div className={styles.localizationWrapper}>
        <div className={styles.localizationInnerWrapper}>
          <div className={styles.localizationInfo}>
            <h2 className={styles.contactHeader}>
              Zapraszamy do <br /> kontaktu
            </h2>
            <div className={styles.baseInfo}>
              <span className={styles.name}>Movement Studio</span>
              <span>ul. Kochanowskiego 30</span>
              <span>78-200 Białogard</span>
              <span>Zachodniopomorskie</span>
              <span>Wt - Śr &nbsp; 16:00 - 21:00</span>
              <span>Pt &nbsp; 16:00 - 19:00</span>
              <span className={styles.highlight}>
                {isOpen ? "Otwarte" : "Zamknięte"}
              </span>
            </div>
          </div>
          <div className={styles.localizationMap}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2344.4418370314265!2d15.9879377!3d54.012682299999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47004b091c81c699%3A0x45b614452e11519d!2sMovement%20Studio!5e0!3m2!1spl!2spl!4v1725317833784!5m2!1spl!2spl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "invert(90%)" }}
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};
