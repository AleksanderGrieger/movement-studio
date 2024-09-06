import { OfferItem } from "@/src/components/contents/OfferItem";
import { offers } from "@/src/constants/content-objects";

export default function Offer() {
  return (
    <>
      {offers.map((offer, index) => (
        <OfferItem
          key={index}
          image={offer.image}
          imgOnLeft={offer.imgOnLeft}
          title={offer.title}
          description={offer.description}
          list={offer.list}
        />
      ))}
    </>
  );
}
