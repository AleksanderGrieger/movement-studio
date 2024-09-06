import Image from "next/image";
import FooterLogo from "@/public/assets/imagess/logo-color-circle.svg";
import Link from "next/link";

export const Footer = () => {
  const linkToInstagram = process.env.INSTAGRAM_LINK ?? "/";
  const linkToFacebook = process.env.FACEBOOK_LINK ?? "/";

  return (
    <footer>
      <div className="container">
        <div className="footer">
          <div>
            <Image id="footer-logo" src={FooterLogo} alt="logo footer" />
          </div>
          <div className="footer-info">
            <h4>SKONTAKTUJ SIĘ Z NAMI</h4>
            <a href="tel:0048577437237">+48 577 437 237</a>
            <a href="mailto:kontakt.movementstudio@gmail.com">
              kontakt.movementstudio@gmail.com
            </a>
          </div>
          <div className="social-media-links">
            <Link href={linkToInstagram} target="_blank">
              <div className="instagram-icon"></div>
            </Link>
            <Link href={linkToFacebook} target="_blank">
              <div className="facebook-icon"></div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
