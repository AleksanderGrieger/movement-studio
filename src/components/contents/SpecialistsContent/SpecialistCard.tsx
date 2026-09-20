import { StaticImageData } from "next/image";
import styles from "./SpecialistCard.module.scss";
import { CSSProperties } from "react";

export interface SpecialistCardProps {
  name: string;
  image: StaticImageData;
  profession: string;
  description: string;
}

export const SpecialistCard = ({
  name,
  image,
  profession,
  description,
}: SpecialistCardProps) => {
  const cardStyle = {
    "--specialist-img": `url(${image.src})`,
  } as CSSProperties;

  return (
    <div className={styles.specialistCard} style={cardStyle}>
      <div className={styles.infoContainer}>
        <span className={styles.name}>{name}</span>
        <span className={styles.profession}>{profession}</span>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
