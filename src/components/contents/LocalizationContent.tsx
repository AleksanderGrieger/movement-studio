"use client";

import { useEffect, useState } from "react";

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
      <section id="section-localization-info">
        <div id="localization-info">
          <div id="localization-left">
            <h2 className="contact-header">
              Zapraszamy do <br /> kontaktu
            </h2>
            <div className="base-info">
              <span className="info-name">Movement Studio</span>
              <span className="info info-localization">
                ul. Kochanowskiego 30
              </span>
              <span className="info info-localization">78-200 Białogard</span>
              <span className="info info-localization">Zachodniopomorskie</span>
              <span className="info info-hours">
                Wt - Śr &nbsp; 16:00 - 21:00
              </span>
              <span className="info info-hours">Pt &nbsp; 16:00 - 19:00</span>
              {isOpen ? (
                <span className="info open">Otwarte</span>
              ) : (
                <span className="info closed">Zamknięte</span>
              )}
            </div>
          </div>
          <div id="localization-right">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2344.4418370314265!2d15.9879377!3d54.012682299999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47004b091c81c699%3A0x45b614452e11519d!2sMovement%20Studio!5e0!3m2!1spl!2spl!4v1725317833784!5m2!1spl!2spl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "invert(90%)" }}
              //   style={{ filter: "grayscale(100%) invert(100%) contrast(100%)" }}
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};
