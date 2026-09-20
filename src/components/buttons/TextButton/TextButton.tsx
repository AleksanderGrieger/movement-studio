import Link from "next/link";
import { ReactNode } from "react";
import styles from "./TextButton.module.scss";

interface TextButtonProps {
  link: string;
  children?: ReactNode;
}

export const TextButton = ({ children, link }: TextButtonProps) => {
  return (
    <Link className={styles.link} href={link}>
      {children}
    </Link>
  );
};
