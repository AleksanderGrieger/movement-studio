export interface TableProps {
  title: string;
  rows: RowItem[];
  dividerOnLeft?: boolean;
}

export interface RowItem {
  col1: string;
  col2: string;
}

export default function Table({
  title,
  rows,
  dividerOnLeft = false,
}: TableProps) {
  return (
    <div className="container container-padding-top-65 container-padding-bottom-30">
      <h2>{title}</h2>
      <div className="table">
        {rows.map((row, index) => {
          return (
            <div className="row" key={index}>
              <div
                className={
                  dividerOnLeft ? "six columns col1" : "eight columns col1"
                }
              >
                {row.col1}
              </div>
              <div
                className={
                  dividerOnLeft ? "vertical-divider left" : "vertical-divider"
                }
              ></div>
              <div
                className={
                  dividerOnLeft ? "six columns col2 left" : "four columns col2"
                }
              >
                {row.col2}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
