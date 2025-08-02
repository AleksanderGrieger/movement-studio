import styles from "./AboutContent.module.css";

export const AboutContent = () => {
  return (
    <section className={styles.experienceContent}>
      <div className="container">
        <h2>Zespół Movement Studio</h2>
        <p className={styles.description}>
          Hania i Karolina - Założycielki Movement Studio. Pełne pasji,
          kreatywne i kochające taniec kobiety. Z miłości do tańca stworzyły
          przestrzeń dla dzieci, młodzieży i dorosłych. Pragną przekazać swoją
          wiedzę i umiejętności młodym talentom, zarazić entuzjazmem i rozbudzić
          miłość do tańca wśród społeczności Białogardu.
        </p>
      </div>
    </section>
  );
};
