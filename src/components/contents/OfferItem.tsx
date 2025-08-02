import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

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
        className={
          imgOnLeft ? "source-of-format" : "source-of-format row-reverse"
        }
      >
        <div className="why-us-img">
          <Image
            id="source-of-formats-in-services"
            src={image}
            alt="source of formats in services section image"
          />
        </div>
        <div className="why-us-text-container">
          <h2 className="why-us-header">{title}</h2>
          {description && (
            <p className="source-of-format-text">{description}</p>
          )}
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
