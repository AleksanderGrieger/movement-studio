import { SpecialistCard, SpecialistCardProps } from "./SpecialistCard";
import styles from "./SpecialistsContent.module.scss";

interface SpecialistsContentProps {
  specialistCardsData: SpecialistCardProps[];
}

export const SpecialistsContent = ({
  specialistCardsData,
}: SpecialistsContentProps) => {
  return (
    <>
      <div className="container">
        <div className={styles.cardsWrapper}>
          {specialistCardsData.map((card) => (
            <SpecialistCard
              key={card.name}
              name={card.name}
              image={card.image}
              profession={card.profession}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </>
  );
};
