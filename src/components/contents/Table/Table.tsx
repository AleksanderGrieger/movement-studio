import styles from "./Table.module.scss";

export interface TableProps {
  title?: string;
  rows: RowItem[];
  dividerOnLeft?: boolean;
}

export interface RowItem {
  col1: string;
  col2: string;
  highlighted?: boolean;
}

export default function Table({
  title,
  rows,
  dividerOnLeft = false,
}: TableProps) {
  return (
    <div className={`container ${styles.wrapper}`}>
      {title && <h2>{title}</h2>}
      <div className={styles.table}>
        {rows.map((row, index) => (
          <div
            className={`row ${row.highlighted ? styles.highlightedRow : ""}`}
            key={index}
          >
            <div
              className={dividerOnLeft ? "six columns" : "eight columns"}
            >
              {row.col1}
            </div>
            <div
              className={`${styles.verticalDivider} ${
                dividerOnLeft ? styles.dividerLeft : ""
              }`}
            />
            <div
              className={`${styles.col2} ${
                dividerOnLeft
                  ? `six columns ${styles.col2Left}`
                  : "four columns"
              }`}
            >
              {row.col2}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
