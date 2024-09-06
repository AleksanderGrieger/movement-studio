import Table from "@/src/components/contents/Table";
import { pricelists } from "@/src/constants/content-objects";

export default function Pricelist() {
  return (
    <>
      {pricelists.map((pricelist, index) => (
        <Table key={index} title={pricelist.title} rows={pricelist.rows} />
      ))}
    </>
  );
}
