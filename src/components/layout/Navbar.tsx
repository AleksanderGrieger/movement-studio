"use client";

import Link from "next/link";
import Image from "next/image";
// import Logo from "@/public/assets/images/logo-nav.svg";
// import FooterLogo from "@/public/assets/images/logo-footer.svg";
import Logo from "../../../public/vercel.svg";
import FooterLogo from "../../../public/vercel.svg";
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
} from "@/constants/routing";

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileNavEnabled, setMobileNavEnabled] = useState(false);
  const [isDropdownEnabled, setDropdownEnabled] = useState(false);

  const changeColorIfActive = (path: string): string => {
    return pathname === `/${path}/` ? "active" : "";
  };

  const toggleMobileNavbar = () => {
    setMobileNavEnabled(!isMobileNavEnabled);
  };

  const toggleDropdown = (isEnabled: boolean) => {
    setDropdownEnabled(isEnabled);
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
          <li
            onMouseOver={() => toggleDropdown(true)}
            onMouseOut={() => toggleDropdown(false)}
          >
            {/* <Link
              href={services}
              className={`nav-services ${changeColorIfActive(services)}`}
            >
              {t("services")}
            </Link> */}
            {/* <div
              className={`services-dropdown ${
                isDropdownEnabled ? "dropdown-active" : ""
              }`}
            >
              <div className="services-dropdown-inner">
                <ul>
                  <li>
                    <Link
                      href={furnitureComponents}
                      className={changeColorIfActive(furnitureComponents)}
                    >
                      {t("furnitureComponents")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={furnitureBodies3D}
                      className={changeColorIfActive(furnitureBodies3D)}
                    >
                      {t("furnitureBodies3D")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}
          </li>
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
        </ul>
      </div>
      <div className="three columns">
        <div className="nav-buttons">
          <Link
            href={contact}
            //   className={changeColorIfActive(contact)}
            className="button"
          >
            K
          </Link>
          {/* <LocaleSwitcher /> */}
          {/* <Link href={contact} className="button button-sign button-signup">
            {contact}
          </Link> */}
        </div>
      </div>
    </nav>
  );
};
