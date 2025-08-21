import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import styles from "./OfferItem.module.css";

interface OfferListItem {
  highlight?: string;
  description: string;
}

export interface OfferItemProps {
  image: StaticImageData;
  title: string;
  description?: string;
  imgOnLeft: boolean;
  list?: OfferListItem[];
  extraContent?: ReactNode;
}

export const OfferItem = ({
  image,
  title,
  description,
  imgOnLeft,
  list,
  extraContent,
}: OfferItemProps) => {
  return (
    <div className="container container-padding-top-65">
      <div
        className={`${styles.offerItemWrapper} ${
          !imgOnLeft && styles.rowReverse
        }`}
      >
        <div className={styles.imageWrapper}>
          <Image src={image} alt={`${title} image`} />
        </div>
        <div className={styles.textContainer}>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
          {list && (
            <ul>
              {list.map((item, index) => {
                return (
                  <li key={index}>
                    <span>{item.highlight}</span> {item.description}
                  </li>
                );
              })}
            </ul>
          )}
          {extraContent && extraContent}
        </div>
      </div>
    </div>
  );
};
