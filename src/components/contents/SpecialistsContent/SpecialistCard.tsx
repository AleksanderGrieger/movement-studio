import styles from "./SpecialistCard.module.css";

interface SpecialistCardProps {
  name: string;
  profession: string;
  description: string;
}

export const SpecialistCard = ({
  name,
  profession,
  description,
}: SpecialistCardProps) => {
  return (
    <div className={styles.specialistCard}>
      <div className={styles.infoContainer}>
        <span className={styles.name}>{name}</span>
        <span className={styles.profession}>{profession}</span>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};
