import { SpecialistCard } from "./SpecialistCard";

export const SpecialistsContent = () => {
  return (
    // todo poprosic o same zdjecia - nie grafiki i fajnie jakby Karolina tez miala na bialym tle
    <div className="container container-specialists">
      {/* <h2 className="specialists-header">Zespół naszych specjalistów</h2> */}
      <div className="specialists-cards">
        <SpecialistCard
          name="Karolina Bobryk-Kopcińska"
          department="ZAWODOWA TANCERKA"
        >
          <p className="specialist-card-description">
            Tancerka międzynarodowej klasy tanecznej ‚S’ w tańcach
            latynoamerykańskich. Mistrzyni Polski w formacji tanecznej,
            półfinalistka Mistrzostw Świata formacji, wielokrotna Mistrzyni
            Pomorza. Od wielu lat trenerka i instruktorka tańca, specjalizująca
            się w tańcach latynoamerykańskich oraz karaibskich. Wytrenowała
            Mistrzynie Polski, Świata i Europy Federacji WADF. Z wykształcenia
            magister fizjoterapii specjalizująca się w terapii wad w postawie
            ciała oraz skoliozy oraz terapeutka integracji sensorycznej.
          </p>
        </SpecialistCard>
        <SpecialistCard name="Hanna Maciejewska" department="ZAWODOWA TANCERKA">
          <p className="specialist-card-description">
            Tancerka najwyższej międzynarodowej klasy tanecznej ‚S’ w tańcach
            standardowych i latynoamerykańskich. Mistrzyni Polski w tańcach
            standardowych na Otwartych Mistrzostwach Polski, II Vicemistrzyni
            Polski w 10 tańcach, wielokrotna finalistka Mistrzostw Polski,
            półfinalistka Pucharu Europy w 10 tańcach. Magister wychowania
            fizycznego oraz oligofrenopedagog. Instruktor sportu tanecznego,
            trener personalny oraz trener osób z niepełnosprawnościami.
          </p>
        </SpecialistCard>
        <SpecialistCard name="Milena Chomicz" department="ZAWODOWA TANCERKA">
          <p className="specialist-card-description">
            Instruktor i Choreograf tańca ludowego oraz tańca
            charakterystycznego. Tancerka z 26 letnim stażem tanecznym.
            Wychowanka Zespołu Tanecznego „Algi” w Kołobrzegu, w którym tańczyła
            15 lat oraz wyjeżdżała przez 10 lat w trasy koncertowe do Danii. W
            ‚Algach’ zdobywała swoje doświadczenie oraz uczyła kolejne pokolenia
            tancerzy. Prowadząca zajęcia z dziećmi, młodzieżą oraz dorosłymi. Od
            15 lat przygotowuje również polonezy studniówkowe w szkołach
            średnich. Kocha taniec ludowy, to jej życiowa pasja, miłością darzy
            też taniec współczesny, towarzyski oraz high heels
          </p>
        </SpecialistCard>
      </div>
    </div>
  );
};
