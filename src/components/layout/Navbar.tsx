"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/imagess/logo-color.svg";
import FooterLogo from "@/public/assets/imagess/logo-black.svg";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { useState } from "react";
import {
  home,
  pricelist,
  schedule,
  offer,
  aboutUs,
  contact,
  programs,
} from "@/src/constants/routing";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileNavEnabled, setMobileNavEnabled] = useState(false);
  const linkToInstagram = process.env.INSTAGRAM_LINK ?? "/";
  const linkToFacebook = process.env.FACEBOOK_LINK ?? "/";

  const changeColorIfActive = (path: string): string => {
    return pathname === path ? "active" : "";
  };

  const toggleMobileNavbar = () => {
    setMobileNavEnabled(!isMobileNavEnabled);
  };

  return (
    <nav className="row">
      <div className="three columns">
        <Link href={home}>
          <Image
            className="logo"
            src={Logo}
            alt="Logo in navigation bar"
            priority
          />
        </Link>
        <div className="mobile-menu-button" onClick={toggleMobileNavbar}>
          <GiHamburgerMenu></GiHamburgerMenu>
        </div>
      </div>
      <div
        className={
          isMobileNavEnabled
            ? "six columns nav-links mobile-active"
            : "six columns nav-links"
        }
      >
        <div className="nav-mobile-header">
          <Link href={home}>
            <Image
              className="logo"
              src={FooterLogo}
              alt="Logo in navigation bar"
              priority
            />
          </Link>
          <div className="mobile-menu-button" onClick={toggleMobileNavbar}>
            <CloseIcon></CloseIcon>
          </div>
        </div>
        <ul className="list-vertical">
          <li>
            <Link href={offer} className={changeColorIfActive(offer)}>
              Oferta
            </Link>
          </li>
          <li>
            <Link href={schedule} className={changeColorIfActive(schedule)}>
              Grafik
            </Link>
          </li>
          <li>
            <Link href={pricelist} className={changeColorIfActive(pricelist)}>
              Cennik
            </Link>
          </li>
          <li>
            <Link href={aboutUs} className={changeColorIfActive(aboutUs)}>
              O nas
            </Link>
          </li>
          <li>
            <Link href={contact} className={changeColorIfActive(contact)}>
              Kontakt
            </Link>
          </li>
          <li>
            <Link href={programs} className={changeColorIfActive(programs)}>
              Programy
            </Link>
          </li>
        </ul>
      </div>
      <div className="three columns">
        <div
          className={
            isMobileNavEnabled ? "nav-buttons mobile-active" : "nav-buttons"
          }
        >
          <Link href={linkToInstagram} target="_blank">
            <div className="instagram-icon"></div>
          </Link>
          <Link href={linkToFacebook} target="_blank">
            <div className="facebook-icon"></div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
