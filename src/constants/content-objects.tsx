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
import FioPoster1 from "@/public/assets/imagess/project-fio-poster-1.png";
import FioPoster2 from "@/public/assets/imagess/project-fio-poster-2.png";
import SpolecznikPoster1 from "@/public/assets/imagess/project-spolecznik-poster-1.png";
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
      "Nie wiesz kiedy wybrać się na zajęcia? Tu znajdziesz pełny, godzinowy grafik zajęć na sezon 2025 / 2026 r.",
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
      {
        highlight: "Ladies Style:",
        description:
          "Zajęcia stworzone z myślą o kobietach, które pragną wyrazić siebie poprzez ruch oraz pragną nauczyć się różnych stylów tańca. Latino, jazz, commercial oraz elementy tańca klasycznego i współczesnego - to doskonała okazja do połączenia tańca z zabawą.",
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
    title: "Cennink Białogard",
    rows: [
      {
        col1: "ZAJĘCIA DLA DZIECI BIAŁOGARD",
        col2: "CENA",
        highlighted: true,
      },
      {
        col1: "Taniec towarzyski nabór (1x 45min w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Taniec towarzyski gr sportowa (2x 1h 15min w tyg)",
        col2: "300 zł",
      },
      {
        col1: "Nabór latino solo kids (1x 45 min w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Latino solo kids gr sportowa (2x 1h w tyg)",
        col2: "280 zł",
      },
      {
        col1: "Nabór taniec współczesny (1x 45min w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Taniec współczesny gr sportowa (2x 1h w tyg)",
        col2: "280 zł",
      },
      {
        col1: "Sport kids (dla dzieci uczęszczających na zajęcia stałe - 10 zł za jedne zajęcia)",
        col2: "140 zł",
      },
    ],
  },
  {
    rows: [
      {
        col1: "ZAJĘCIA DLA DOROSŁYCH BIAŁOGARD",
        col2: "CENA",
        highlighted: true,
      },
      {
        col1: "Latino solo (1x 1h w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Ladies style (1x 1h w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Power dance (1x 1h w tyg)",
        col2: "140 zł",
      },
    ],
  },
  {
    rows: [
      {
        col1: "INNE",
        col2: "CENA",
        highlighted: true,
      },
      {
        col1: "Lekcje indywidualne (zawodnicy) 45 min",
        col2: "130 zł",
      },
      {
        col1: "Pierwszy taniec (45 min)",
        col2: "150 zł",
      },
      {
        col1: "Pierwszy taniec pakiet (5x 45 min)",
        col2: "700 zł",
      },
    ],
  },
  {
    title: "Cennink Kołobrzeg",
    rows: [
      {
        col1: "ZAJĘCIA DLA DZIECI KOŁOBRZEG",
        col2: "CENA",
        highlighted: true,
      },
      {
        col1: "Nabór taniec współczesny (1x 45 min w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Taniec współczesny 7-12 lat gr sportowa (2x 1h w tyg, klasyka 1x 45min w tyg, 2x 1h w miesiącu impro, 2x 1h w miesiącu akrobatyka)",
        col2: "300 zł",
      },
      {
        col1: "Akrobatyka (2x 1h w miesiącu)",
        col2: "120 zł",
      },
      {
        col1: "Taniec współczesny gr sport (1x 2h w tyg motoryka, 1x 2h w tyg technika, 1x 45min w tyg klasyka, 2x 1h w miesiącu impro, 2x 1h w miesiącu akrobatyka)",
        col2: "400 zł",
      },
      {
        col1: "Nabór latino solo kids (1x 45 min w tyg)",
        col2: "140 zł",
      },
    ],
  },
  {
    rows: [
      {
        col1: "ZAJĘCIA DLA DOROSŁYCH KOŁOBRZEG",
        col2: "CENA",
        highlighted: true,
      },
      {
        col1: "Latino solo basic (1x 1h w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Latino solo masters (1x 1h w tyg)",
        col2: "140 zł",
      },
      {
        col1: "Ladies style (1x 1h w tyg)",
        col2: "140 zł",
      },
    ],
  },
  {
    rows: [
      {
        col1: "INNE",
        col2: "CENA",
        highlighted: true,
      },
      {
        col1: "Lekcje indywidualne (zawodnicy) 45 min",
        col2: "130 zł",
      },
      {
        col1: "Pierwszy taniec (45 min)",
        col2: "150 zł",
      },
      {
        col1: "Pierwszy taniec pakiet (5x 45 min)",
        col2: "700 zł",
      },
    ],
  },
];

export const scheduleList: TableProps[] = [
  {
    title: "BIAŁOGARD - SEZON 2025/26",
    rows: [],
  },
  {
    title: "Poniedziałek",
    rows: [
      {
        col1: "16:15",
        col2: "Nabór taniec towarzyski",
      },
      {
        col1: "17:00",
        col2: "Latino solo kids (gr sportowa)",
      },
      {
        col1: "18:00",
        col2: "Taniec towarzyski (gr sportowa)",
      },
      {
        col1: "19:15",
        col2: "Taniec współczesny (gr sportowa)",
      },
      {
        col1: "20:15",
        col2: "Latino solo dorośli",
      },
    ],
  },
  {
    title: "Wtorek",
    rows: [
      {
        col1: "18:00",
        col2: "Ladies style dorośli",
      },
    ],
  },
  {
    title: "Środa",
    rows: [
      {
        col1: "16:15",
        col2: "Nabór taniec współczesny",
      },
      {
        col1: "17:00",
        col2: "Taniec współczesny (gr sportowa)",
      },
      {
        col1: "18:00",
        col2: "Sport kids",
      },
      {
        col1: "19:00",
        col2: "Power Dance dorośli",
      },
    ],
  },
  {
    title: "Czwartek",
    rows: [
      {
        col1: "16:15",
        col2: "Nabór latino solo kids",
      },
      {
        col1: "17:00",
        col2: "Latino solo kids (gr sportowa)",
      },
      {
        col1: "18:00",
        col2: "Taniec towarzyski (gr sportowa)",
      },
    ],
  },
  {
    title:
      "KOŁOBRZEG - SEZON 2025/26 -  ul. Mazowiecka 29, klatka B. Wejście od strony ul. Wielkopolskiej",
    rows: [],
  },
  {
    title: "Wtorek",
    rows: [
      {
        col1: "16:30",
        col2: "Nabór latino solo kids",
      },
      {
        col1: "17:15",
        col2: "Latino solo Masters dorośli",
      },
      {
        col1: "18:15",
        col2: "Modern / Jazz 7-12 lat",
      },
      {
        col1: "19:15",
        col2: "Trening motoryczny (gr sportowa)",
      },
    ],
  },
  {
    title: "Środa",
    rows: [
      {
        col1: "18:00",
        col2: "Ladies style podstawowy",
      },
      {
        col1: "19:00",
        col2: "Akrobatyka - 2 razy w miesiącu w SP7",
      },
      {
        col1: "19:00",
        col2: "Impro (gr sportowa) - 2 razy w miesiącu (wszystkie grupy tanec współczesny)",
      },
      {
        col1: "20:15",
        col2: "Latino solo Basic dorośli",
      },
    ],
  },
  {
    title: "Czwartek",
    rows: [
      {
        col1: "16:30",
        col2: "Nabór tanec współczesny",
      },
      {
        col1: "17:15",
        col2: "Modern / Jazz 7-12 lat",
      },
      {
        col1: "18:15",
        col2: "Klasyka (gr sportowa)",
      },
      {
        col1: "19:00",
        col2: "Technika modern / jazz (gr sportowa)",
      },
    ],
  },
];

export const fioProgram: OfferItemProps[] = [
  {
    image: FioPoster1,
    title: "Program - FIO",
    description:
      ",,Roztańczony Białogard - zajęcia taneczno- sportowe’’ Rządowy Program Fundusz Inicjatyw Obywatelskich NOWE FIO na lata 2021-2030",
    imgOnLeft: false,
    list: [
      {
        description:
          "Nieodpłatne warsztaty taneczno-sportowe #RoztańczonyBiałogard",
      },
      {
        description:
          "Projekt 'Roztańczony Białogard - zajęcia taneczno-sportowe' jest skierowany do dzieci, młodzieży i dorosłych (w tym seniorów) z terenu powiatu białogardzkiego.",
      },
      {
        description:
          "Sfinansowano ze środków Narodowego Instytutu Wolności - Centrum Rozwoju Społeczeństwa Obywatelskiego w ramach Rządowego Programu Fundusz Inicjatyw Obywatelskich NOWEFIO na lata 2021-2030.",
      },
    ],
  },
  {
    image: FioPoster2,
    title: "",
    imgOnLeft: true,
    list: [
      {
        description:
          "Głównym celem projektu jest zachęcenie mieszkańców powiatu, w szczególności dzieci, do aktywności fizycznej, integracja w grupie rówieśniczej, pokazanie możliwości aktywnego spędzania czasu wolnego oraz rozwijania pasji.",
      },
      {
        description:
          "W ramach projektu przeprowadzone będą nieodpłatne zajęcia taneczno-sportowe dla dzieci, młodzieży i dorosłych.",
      },
      {
        description:
          "Zajęcia poprowadzą dwie trenerki tańca, tancerki z najwyższą międzynarodową klasą taneczną S.",
      },
    ],
  },
];

export const fioProgramsSchedule: TableProps[] = [
  {
    title: "02.07.2025 - ŚRODA",
    rows: [
      {
        col1: "17:00 - 18:00",
        col2: "Dla seniorów",
      },
      {
        col1: "18:00-19:00",
        col2: "Dla dorosłych - Ladies style",
      },
      {
        col1: "19:00-20:00",
        col2: "Dla dorosłych - Power dance",
      },
    ],
  },
  {
    title: "25-26.08.2025 - PONIEDZIAŁEK i WTOREK",
    rows: [
      {
        col1: "9:00 - 9:30",
        col2: "Dla dzieci w wieku przedszkolnym - Mix taneczny",
      },
      {
        col1: "9:30 - 12:00",
        col2: "Dla dzieci w wieku szkolnym - Taniec towarzyski, taniec współczesny, zajęcia sportowe",
      },
      {
        col1: "19:00 - 20:00",
        col2: "Dla dorosłych - Power dance",
      },
    ],
  },
];

export const spolecznikProgram: OfferItemProps[] = [
  {
    image: SpolecznikPoster1,
    title: "Program - Społecznik",
    description:
      ",,Roztańczony Białogard - warsztaty taneczno- sportowe’’ SPOŁECZNIK NA 5! PROGRAM WSPIERANIA INICJATYW ODDOLNYCH NA LATA 2025-2029",
    imgOnLeft: false,
    list: [
      {
        description:
          "Nieodpłatne warsztaty taneczno-sportowe #RoztańczonyBiałogard",
      },
      {
        description:
          "Projekt ,,Roztańczony Białogard - warsztaty taneczno- sportowe’’ skierowany jest do dzieci i młodzieży uczących się w szkołach podstawowych i przedszkolach na terenie powiatu białogardzkiego.",
      },
      {
        description:
          "Głównym celem projektu jest zachęcenie dzieci i młodzieży do aktywności fizycznej, integracja w grupie rówieśników, pokazanie możliwości aktywnego spędzania czasu wolnego oraz rozwijania pasji.",
      },
      {
        description:
          "W ramach projektu przeprowadzone zostanę nieodpłatne warsztaty taneczno-sportowe dla dzieci i młodzieży ze szkół podstawowych i przedszkoli.",
      },
      {
        description:
          "Zajęcia poprowadzą dwie trenerki tańca, tancerki z najwyższą międzynarodową klasą taneczną S.",
      },
      {
        description:
          ",,Program zainicjowany przez Marszałka Województwa Zachodniopomorskiego’’ #PomorzeZachodnie #PomorzeZachodnieNews @PomorzeZachodnie @PomorzeZachodnieNews @SpołecznikNa5! #KARRSA #SpołecznikNa5! @KARRSA",
      },
    ],
  },
];

export const spolecznikProgramsSchedule: TableProps[] = [
  {
    title: "27-29.08.2025 - ŚRODA - PIĄTEK",
    rows: [
      {
        col1: "9:00 - 9:30",
        col2: "Dla dzieci w wieku przedszkolnym - Mix taneczny",
      },
      {
        col1: "9:30 - 12:00",
        col2: "Dla dzieci w wieku szkolnym - Taniec towarzyski, taniec współczesny, zajęcia sportowe",
      },
    ],
  },
  {
    title: "12-14.09.2025 - PIĄTEK - NIEDZIELA",
    rows: [
      {
        col1: "9:00 - 9:30",
        col2: "Dla dzieci w wieku przedszkolnym - Mix taneczny",
      },
      {
        col1: "9:30 - 12:00",
        col2: "Dla dzieci w wieku szkolnym - Taniec towarzyski, taniec współczesny, zajęcia sportowe",
      },
    ],
  },
];
