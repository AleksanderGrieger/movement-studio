import Table from "@/src/components/contents/Table";
import { scheduleList } from "@/src/constants/content-objects";

export default function Schedule() {
  return (
    <>
      {scheduleList.map((schedule, index) => (
        <Table
          key={index}
          title={schedule.title}
          rows={schedule.rows}
          dividerOnLeft={true}
        />
      ))}
    </>
  );
}
