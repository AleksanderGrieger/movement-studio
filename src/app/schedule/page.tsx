import Table from "@/src/components/contents/Table";
import { scheduleList } from "@/src/constants/content-objects";

export default function Schedule() {
  return (
    <>
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
