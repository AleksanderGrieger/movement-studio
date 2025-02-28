import Table from "@/src/components/contents/Table";
import { scheduleList } from "@/src/constants/content-objects";

export default function Schedule() {
  return (
    <>
      <div className="container container-padding-top-65">
        <h2>Zamiany nadchodzące w Marcu!</h2>
      </div>
      {scheduleList.map((pricelist, index) => (
        <Table
          key={index}
          title={pricelist.title}
          rows={pricelist.rows}
          dividerOnLeft={true}
        />
      ))}
    </>
  );
}
