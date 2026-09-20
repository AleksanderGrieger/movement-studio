import { specialistCards } from "@/src/constants/content-objects";
import { SpecialistCard } from "./SpecialistCard";
import styles from "./SpecialistsContent.module.scss";

export const SpecialistsContent = () => {
  return (
    <>
      <div className="container">
        <div className={styles.cardsWrapper}>
          {specialistCards.map((card) => (
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
