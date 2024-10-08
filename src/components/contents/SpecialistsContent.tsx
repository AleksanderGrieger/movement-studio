import { SpecialistCard } from "./SpecialistCard";

export const SpecialistsContent = () => {
  return (
    // todo poprosic o same zdjecia - nie grafiki i fajnie jakby Karolina tez miala na bialym tle
    <>
      <div className="container container-specialists">
        <div className="specialists-cards">
          <SpecialistCard
            id="Karolina"
            name="Karolina Bobryk-Kopcińska"
            department="ZAWODOWA TANCERKA"
          >
            <p className="specialist-card-description">
              Tancerka międzynarodowej klasy tanecznej ‚S’ w tańcach
              latynoamerykańskich. Mistrzyni Polski w formacji tanecznej,
              półfinalistka Mistrzostw Świata formacji, wielokrotna Mistrzyni
              Pomorza. Od wielu lat trenerka i instruktorka tańca,
              specjalizująca się w tańcach latynoamerykańskich oraz karaibskich.
              Wytrenowała Mistrzynie Polski, Świata i Europy Federacji WADF. Z
              wykształcenia magister fizjoterapii specjalizująca się w terapii
              wad w postawie ciała oraz skoliozy oraz terapeutka integracji
              sensorycznej.
            </p>
          </SpecialistCard>
          <SpecialistCard
            id="Hanna"
            name="Hanna Maciejewska"
            department="ZAWODOWA TANCERKA"
          >
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
        </div>
      </div>
      <div className="container container-specialists">
        <div className="specialists-cards">
          <SpecialistCard
            id="Milena"
            name="Milena Chomicz"
            department="ZAWODOWA TANCERKA"
          >
            <p className="specialist-card-description">
              Instruktor i Choreograf tańca ludowego oraz tańca
              charakterystycznego. Tancerka z 26 letnim stażem tanecznym.
              Wychowanka Zespołu Tanecznego „Algi” w Kołobrzegu, w którym
              tańczyła 15 lat oraz wyjeżdżała przez 10 lat w trasy koncertowe do
              Danii. W ‚Algach’ zdobywała swoje doświadczenie oraz uczyła
              kolejne pokolenia tancerzy. Prowadząca zajęcia z dziećmi,
              młodzieżą oraz dorosłymi. Od 15 lat przygotowuje również polonezy
              studniówkowe w szkołach średnich. Kocha taniec ludowy, to jej
              życiowa pasja, miłością darzy też taniec współczesny, towarzyski
              oraz high heels
            </p>
          </SpecialistCard>
          <SpecialistCard
            id="Magdalena"
            name="Magdalena Łopucka"
            department="ZAWODOWA TANCERKA"
          >
            <p className="specialist-card-description">
              Tancerka z 25 letnim stażem. Z wykształcenia choreograf tańca,
              nauczyciel i trener odżywiania. W swojej karierze wyszkoliła już
              kilka pokoleń polskich tancerzy, którzy prężnie rozwijają swoje
              umiejętności na arenie światowej. Wielokrotnie uznawana na
              szczeblach ogólnopolskich i międzynarodowych, lecz to zadowolenie
              tancerzy na sali treningowej cieszy ją najbardziej. Specjalizuje
              się w wielu technikach tańca, w szczególności w tańcu
              współczesnym, salsie, bachacie i autorskim projekcie POWER DANCE -
              czyli połączeniu tańca z elementami fitnessowymi, który nie tylko
              zadowoli miłośników energicznych choreografii, ale również tych,
              którzy chcą spalać kalorie i wymodelować sylwetkę.
            </p>
          </SpecialistCard>
        </div>
      </div>
    </>
  );
};
