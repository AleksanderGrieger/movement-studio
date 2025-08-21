import { OfferItem } from "@/src/components/contents/OfferItem/OfferItem";
import Table from "@/src/components/contents/Table";
import {
  fioProgram,
  fioProgramsSchedule,
  spolecznikProgram,
  spolecznikProgramsSchedule,
} from "@/src/constants/content-objects";

export default function Programs() {
  return (
    <>
      {fioProgram.map((program, index) => (
        <OfferItem
          key={index}
          image={program.image}
          imgOnLeft={program.imgOnLeft}
          title={program.title}
          description={program.description}
          list={program.list}
        />
      ))}
      {fioProgramsSchedule.map((schedule, index) => (
        <Table
          key={index}
          title={schedule.title}
          rows={schedule.rows}
          dividerOnLeft={true}
        />
      ))}
      <div className="container">
        <h3>
          Zajęcia odbędą się w siedzibie szkoły tańca Movement Studio w
          Białogardzie, ul. Kochanowskiego 30
        </h3>
      </div>
      {spolecznikProgram.map((program, index) => (
        <OfferItem
          key={index}
          image={program.image}
          imgOnLeft={program.imgOnLeft}
          title={program.title}
          description={program.description}
          list={program.list}
        />
      ))}
      {spolecznikProgramsSchedule.map((schedule, index) => (
        <Table
          key={index}
          title={schedule.title}
          rows={schedule.rows}
          dividerOnLeft={true}
        />
      ))}
      <div className="container">
        <h3>
          Warsztaty odbędą się w siedzibie Stowarzyszenia Movement Studio w
          Białogardzie, przy ul. Kochanowskiego 30.
        </h3>
      </div>
    </>
  );
}
