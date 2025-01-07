import { OfferItemProps } from "../components/contents/OfferItem";
import MainOffer from "@/public/assets/imagess/offer-main-page.png";
import MainSchedule from "@/public/assets/imagess/schedule-main-page.png";
import MainPricelist from "@/public/assets/imagess/pricelist-main-page.png";
import MainAboutUs from "@/public/assets/imagess/about-us-main-page.png";
import MainContact from "@/public/assets/imagess/contact-main-page.png";
import ForKids from "@/public/assets/imagess/for-kids.png";
import AdultsSolo from "@/public/assets/imagess/adults-solo.png";
import AdultsCouples from "@/public/assets/imagess/adults-couples.png";
import LatinoDisco from "@/public/assets/imagess/latino-disco.png";
import FirstDance from "@/public/assets/imagess/first-dance.png";
import MaidenVortex from "@/public/assets/imagess/maiden-vortex.png";
import Birthday from "@/public/assets/imagess/birthday.png";
import { TextButton } from "../components/buttons/TextButton";
import { aboutUs, contact, offer, pricelist, schedule } from "./routing";
import { TableProps } from "../components/contents/Table";

export const contents: OfferItemProps[] = [
  {
    image: MainOffer,
    title: "OFERTA",
    description:
      "Tutaj zapoznasz się z naszą ofertą zajęć. Oferujemy zajęcia taneczne i ruchowe w godzinach popołudniowych od wtorku do czwartku.",
    imgOnLeft: false,
    extraContent: (
      <TextButton link={offer} classNames="link">
        Więcej
      </TextButton>
    ),
  },
  {
    image: MainSchedule,
    title: "GRAFIK",
    description:
      "Nie wiesz kiedy wybrać się na zajęcia? Tu znajdziesz pełny, godzinowy grafik zajęć, obowiazujący od października 2024r.",
    imgOnLeft: true,
    extraContent: (
      <TextButton link={schedule} classNames="link">
        Więcej
      </TextButton>
    ),
  },
  {
    image: MainPricelist,
    title: "CENNIK",
    description:
      "Tutaj sprawdzisz ceny m.in. karnetów czy pojedynczych wejściówek na zajęcia.",
    imgOnLeft: false,
    extraContent: (
      <TextButton link={pricelist} classNames="link">
        Więcej
      </TextButton>
    ),
  },
  {
    image: MainAboutUs,
    title: "O NAS",
    description:
      "Chcesz poznać nas bliżej? Tu znajdziesz informacje o właścicielkach oraz instruktorach studia.",
    imgOnLeft: true,
    extraContent: (
      <TextButton link={aboutUs} classNames="link">
        Więcej
      </TextButton>
    ),
  },
  {
    image: MainContact,
    title: "KONTAKT",
    description:
      "Masz pytania co do zajęć, grafiku czy po prostu chcesz dowiedzieć się więcej? Tutaj znajdują się różne możliwości kontaktu z naszym studiem.",
    imgOnLeft: false,
    extraContent: (
      <TextButton link={contact} classNames="link">
        Więcej
      </TextButton>
    ),
  },
];

export const offers: OfferItemProps[] = [
  {
    image: ForKids,
    title: "Dla Dzieci",
    imgOnLeft: false,
    list: [
      {
        highlight: "Dance Mix:",
        description:
          "Zajęcia taneczno-umuzykalniające dla najmłodszych. Dedykowane dzieciom w wieku 3-6 lat.",
      },
      {
        highlight: "Taniec Towarzyski:",
        description:
          "Zajęcia z tańca towarzyskiego w parach obejmują naukę tańców standardowych i latynoamerykańskich. Grupa z nastawieniem na udział w profesjonalnych turniejach tańca.",
      },
      {
        highlight: "Zajęcia Latino Solo Kids:",
        description:
          "Zajęcia dedykowane są solistom, nauka tańców takich jak salsa, bachata czy jive. Grupa z nastawieniem na udział w profesjonalnych turniejach tańca.",
      },
      {
        highlight: "Podstawy Baletu:",
        description:
          "Zajęcia dla dzieci chcących nauczyć się podstaw baletu, jak również jako uzupełnienie treningu innych form tańca.",
      },
      {
        highlight: "Sport Kids:",
        description:
          "Zajęcia sportowe jako uzupełnienie treningu oraz dla wszystkich dzieci w celu rozwoju koordynacji ruchowej, równowagi oraz poprawy ogólnej kondycji fizycznej.",
      },
      {
        highlight: "Teen Movement:",
        description:
          "Zbliża się szkolna dyskoteka, bal ósmoklasisty, połowinki, studniówka? A może chcesz po prostu spędzić miło czas z rówieśnikami i nauczyć się tańczyć. Poznasz tu podstawy tańców latino oraz tańca użytkowego, dzięki którym poczujesz się swobodnie na parkiecie i przetańczysz całą noc.",
      },
      {
        highlight: "Baby Movement:",
        description:
          "Wyjątkowe zajęcia dla rodziców z dziećmi w wieku 6m do 18m. Zajęcia prowadzone w bliskim kontakcie z rodzicem, czyli w chuście lub nosidle. Wyjątkowy czas spędzony razem z dzieckim, a za razem trening taneczny dla rodzica.",
      },
    ],
  },
  {
    image: AdultsSolo,
    title: "Dla Dorosłych",
    imgOnLeft: true,
    list: [
      {
        highlight: "Latino Solo:",
        description:
          "Zajęcia dla wszystkich solistów, osób, które marzą o nauce tańców latynoamerykańskich: samba, chacha, rumba, paso doble oraz jive i karaibskich: salsa, bachata i merengue. Zarówno dla kobiet jak i mężczyzn.",
      },
      {
        highlight: "Sexy Dnce:",
        description:
          "Sexy Dance to mieszanka najgorętszych i najbardziej zmysłowych tanecznych stylów, która ukierunkowana jest na wydobywanie z kobiety wdzięku bez względu na wiek i doświadczenie taneczne.",
      },
      {
        highlight: "Body workout + stretching:",
        description:
          " Czyli trening funkcjonalny i rozciąganie, wzmacnianie całego ciała, połączone z treningiem kardio, prowadzone przez fizjoterapeutę i wykwalifikowanego trenera przygotowania motorycznego.",
      },
      {
        highlight: "Power Dance:",
        description:
          "Trening w rytm muzyki, czyli spalamy kalorie tańcząc. Taneczne kardio z elementami fitnessu, ćwiczeń wzmacniających i rozciągających.",
      },
      {
        highlight: "Disco Folk:",
        description:
          "Zajęcia w formie krótkich, prostych choreografii do najpopularniejszych utworów polskiej muzyki rozrywkowej w połączeniu z elementami folkloru i nie tylko.",
      },
    ],
  },
  {
    image: AdultsCouples,
    title: "Dla Par",
    imgOnLeft: false,
    list: [
      {
        highlight: "Taniec Towarzyski:",
        description:
          "Zajęcia dla fanów „Taniec z Gwiazdami” i marzących żeby tańczyć tak jak uczestnicy. Jak również dla osób chcących aktywnie spędzić czas wspólnie w prze lub poznać wspaniałych ludzi chcących podzielić się pasją. Podczas kursu będą tańce standardowe takie jak elegancki walc czy temperamentne tango, ale nie zabraknie też tańców latynoamerykańskich jak cha cha czy zmysłowa rumba.",
      },
      {
        highlight: "Taniec Użytkowy:",
        description:
          "Idealny kurs dla osób szykujących się na wesele lub inne tego typu wydarzenie. Dzięki naszemu programowi żadna impreza nie będzie Wam straszna, a parkiet będzie należał tylko do Was.",
      },
    ],
  },
  {
    image: FirstDance,
    title: "Pierwszy Taniec",
    description:
      "Specjalnie na potrzeby przyszłych Par Młodych stworzyliśmy możliwości nauki tańca przed ślubem. Profesjonalna i doświadczona kadra pomoże Państwu w ułożeniu i dopracowaniu choreografii pierwszego tańca. Pomożemy dobrać taniec odpowiedni do Państwa preferencji i możliwości, przygotujemy pełną oprawę tańca z wejściem na parkiet, ukłonem, zakończeniem tańca oraz dopasujemy choreografię do układu sali weselnej.",
    imgOnLeft: true,
  },
  {
    image: Birthday,
    title: "URODZINKI",
    description:
      "Wyjątkowe urodzinki taneczno-sportowe lub taneczno-artystyczne obejmują:",
    imgOnLeft: false,
    list: [
      {
        highlight: "Animatora zabaw:",
        description: "taniec, konkursy i zabawy",
      },
      {
        highlight: "Dekorację stołu:",
        description: "naczynia jednorazowe, obrusy, serwetki",
      },
      {
        highlight: "Dekoracje sali:",
        description: "balony, girlandy",
      },
      {
        description: "Wspólne odśpiewanie uroczystego STO LAT,",
      },
      {
        description: "Wykonanie pamiątki oraz zdjęcia",
      },
      {
        highlight: "Cena:",
        description: "Pakiet 10 osób: 700 zł. Każda kolejna osoba: 40 zł",
      },
    ],
  },
  {
    image: MaidenVortex,
    title: "WIECZÓR PANIEŃSKI",
    description: "W ofercie wieczoru panieńskiego:",
    imgOnLeft: true,
    list: [
      {
        description: "Sala na wyłączność (ok. 2 godziny)",
      },
      {
        description:
          "Wybrane warsztaty taneczne - tworzenie wspólnej choreografii tanecznej do wyboru high heels, sexy dance, bachata, salsa, rumba… jesteśmy otwarci na Wasze propozycje",
      },
      {
        description: "Powitalna lampka Prosecco",
      },
      {
        description: "Możliwość nawiązania współpracy z fotografem",
      },
      {
        highlight: "Cena:",
        description: "Pakiet do 10 osób: 600 zł. Każda kolejna osoba: 40 zł",
      },
    ],
  },
  {
    image: LatinoDisco,
    title: "LATINOTEKA",
    description:
      "Impreza w rytmach latino, na parkiecie króluje salsa, bachata, samba i rumba. Daty latinoteki podawane są z miesięcznym wyprzedzeniem. Wstęp na latinoteke jest płatny - 30 zł/os.",
    imgOnLeft: false,
  },
  {
    image: LatinoDisco, //todo - change foto
    title: "WYNAJEM SALI",
    description:
      "Oferujemy wynajem sali na kursy, szkolenia, imprezy okolicznościowe. Obiekt posiada 2 szatnie z toaletami, salę oraz loże. Cena ustalana indywidualnie.",
    imgOnLeft: true,
  },
];

export const pricelists: TableProps[] = [
  {
    title: "Zajęcia dla dzieci",
    rows: [
      {
        col1: "Taniec towarzyski początkujący (2x 60min w tyg / 8x w miesiącu)",
        col2: "40 zł / 280 zł",
      },
      {
        col1: "Teen Movement (2x 60min w tyg / 8x w miesiącu)",
        col2: "40 zł / 280 zł",
      },
      {
        col1: "Latino solo kids (45 min / 4x w miesiącu)",
        col2: "35 zł / 120 zł",
      },
      {
        col1: "Podstawy baletu (60min / 4x w miesiącu)",
        col2: "40 zł / 140 zł",
      },
      {
        col1: "Dance mix 3+ (45 min / 4x w miesiącu)",
        col2: "30 zł / 100 zł",
      },
      {
        col1: "Sport kids (60 min / 4x w miesiącu)",
        col2: "40 zł / 140 zł",
      },
      {
        col1: "Baby Movement",
        col2: "35 zł / 30 min",
      },
    ],
  },
  {
    title: "Zajęcia dla dorosłych solo",
    rows: [
      {
        col1: "Latino solo (60 min / 4x w miesiącu)",
        col2: "40 zł / 140 zł",
      },
      {
        col1: "Body workout + stretching (60min / 4x w miesiącu)",
        col2: "40 zł / 140zł",
      },
      {
        col1: "Sexy dance (60 min / 4x w miesiącu)",
        col2: "40 zł / 140 zł",
      },
      {
        col1: "Power dance (60 min / 4x w miesiącu)",
        col2: "40 zł / 140zł",
      },
    ],
  },
  {
    title: "Zajęcia dla dorosłych pary",
    rows: [
      {
        col1: "Towarzyski pary (8 x 60 min)",
        col2: "280 zł",
      },
      {
        col1: "Taniec użytkowy",
        col2: "280 zł",
      },
    ],
  },
  {
    title: "Dodatkowo",
    rows: [
      {
        col1: "Pierwszy taniec",
        col2: "150 zł / 45 min",
      },
      {
        col1: "Pakiet pierwszy taniec",
        col2: "700 zł / 5 x 45 min",
      },
      {
        col1: "Lekcje indywidualne (45min)",
        col2: "130 zł",
      },
      {
        col1: "Latinoteka",
        col2: "30 zł",
      },
      {
        col1: "Urodzinki (2h, 10 osób)",
        col2: "700 zł i każde kolejne dziecko 40 zł",
      },
      {
        col1: "Pojedyncze wejście",
        col2: "35 zl / 45 min  |  40 zł / 60 min",
      },
      {
        col1: "Pakiet VIP imienny - nieograniczona ilość wejść w miesiącu, na zajęcia solo. ",
        col2: "300 zł / miesięcznie",
      },
    ],
  },
];

export const scheduleList: TableProps[] = [
  {
    title: "WTOREK",
    rows: [
      {
        col1: "15:30",
        col2: "Baby Movement (30 min)",
      },
      {
        col1: "16:15",
        col2: "Towarzyski dzieci",
      },
      {
        col1: "17:15",
        col2: "Taniec współczesny dzieci",
      },
      {
        col1: "18:00",
        col2: "Kurs taniec towarzyski pary dorośli - nabór",
      },
      {
        col1: "19:00",
        col2: "Latino solo dorośli",
      },
    ],
  },
  {
    title: "ŚRODA",
    rows: [
      {
        col1: "16:15",
        col2: "Dance mix 3+ lat (30 min)",
      },
      {
        col1: "17:00",
        col2: "Sport kids",
      },
      {
        col1: "18:00",
        col2: "Body workout + stretching", // (75 min)",
      },
      {
        col1: "19:00",
        col2: "Power Dance",
      },
    ],
  },
  {
    title: "CZWARTEK",
    rows: [
      {
        col1: "16:15",
        col2: "Towarzyski dzieci",
      },
      {
        col1: "17:15",
        col2: "Latino solo kids",
      },
      {
        col1: "18:00",
        // col2: "Pary użytkowy dorośli",
        col2: "Teen Movement",
      },
      {
        col1: "19:00",
        col2: "Sexy dance",
      },
    ],
  },
  {
    title: "SOBOTA w Kołobrzegu",
    rows: [
      {
        col1: "10:00",
        col2: "Baby Movement",
      },
      {
        col1: "10:30",
        col2: "Senior Movement",
      },
      {
        col1: "11:15",
        col2: "Latino solo kids",
      },
    ],
  },
];
