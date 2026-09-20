import Image from "next/image";
import FooterLogo from "@/public/assets/imagess/logo-color-circle.svg";
import { SocialMediaLinks } from "../../shared/SocialMediaLinks/SocialMediaLinks";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerContent}>
          <div>
            <Image
              className={styles.footerLogo}
              src={FooterLogo}
              alt="logo footer"
            />
          </div>
          <div className={styles.footerInfo}>
            <h4>SKONTAKTUJ SIĘ Z NAMI</h4>
            <a href="tel:0048577437237">+48 577 437 237</a>
            <a href="mailto:kontakt.movementstudio@gmail.com">
              kontakt.movementstudio@gmail.com
            </a>
          </div>
          <SocialMediaLinks className={styles.socialLinks} />
        </div>
      </div>
    </footer>
  );
};
