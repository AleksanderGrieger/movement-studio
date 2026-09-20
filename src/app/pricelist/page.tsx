import Table from "@/src/components/contents/Table/Table";
import { pricelists } from "@/lib/content/content-objects";

export default function Pricelist() {
  return (
    <>
      {pricelists.map((pricelist, index) => (
        <Table key={index} title={pricelist.title} rows={pricelist.rows} />
      ))}
    </>
  );
}
