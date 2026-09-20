"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/imagess/logo-color.svg";
import FooterLogo from "@/public/assets/imagess/logo-black.svg";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
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
import { SocialMediaLinks } from "../../shared/SocialMediaLinks/SocialMediaLinks";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileNavEnabled, setMobileNavEnabled] = useState(false);

  const getActiveClass = (path: string): string => {
    return pathname === path ? styles.active : "";
  };

  const toggleMobileNavbar = () => {
    setMobileNavEnabled(!isMobileNavEnabled);
  };

  return (
    <nav className={`row ${styles.nav}`}>
      <div className={`three columns ${styles.logoColumn}`}>
        <Link href={home} className={styles.logoLink}>
          <Image
            className={styles.logo}
            src={Logo}
            alt="Logo in navigation bar"
            priority
          />
        </Link>
        <div className={styles.mobileMenuButton} onClick={toggleMobileNavbar}>
          <GiHamburgerMenu />
        </div>
      </div>
      <div
        className={`six columns ${styles.navLinks} ${
          isMobileNavEnabled ? styles.mobileActive : ""
        }`}
      >
        <div className={styles.navMobileHeader}>
          <Link href={home}>
            <Image
              className={styles.logo}
              src={FooterLogo}
              alt="Logo in navigation bar"
              priority
            />
          </Link>
          <div className={styles.mobileMenuButton} onClick={toggleMobileNavbar}>
            <IoClose />
          </div>
        </div>
        <ul className={styles.linkList}>
          <li>
            <Link href={offer} className={getActiveClass(offer)}>
              Oferta
            </Link>
          </li>
          <li>
            <Link href={schedule} className={getActiveClass(schedule)}>
              Grafik
            </Link>
          </li>
          <li>
            <Link href={pricelist} className={getActiveClass(pricelist)}>
              Cennik
            </Link>
          </li>
          <li>
            <Link href={aboutUs} className={getActiveClass(aboutUs)}>
              O nas
            </Link>
          </li>
          <li>
            <Link href={contact} className={getActiveClass(contact)}>
              Kontakt
            </Link>
          </li>
          <li>
            <Link href={programs} className={getActiveClass(programs)}>
              Programy
            </Link>
          </li>
        </ul>
      </div>
      <div
        className={`three columns ${styles.navButtonsColumn} ${
          isMobileNavEnabled ? styles.mobileActiveNavButtons : ""
        }`}
      >
        <SocialMediaLinks
          className={`${styles.navButtons} ${
            isMobileNavEnabled ? styles.mobileActiveButtons : ""
          }`}
        />
      </div>
    </nav>
  );
};
