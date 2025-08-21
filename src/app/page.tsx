import { OfferItem } from "../components/contents/OfferItem/OfferItem";
import { contents } from "../constants/content-objects";

export default function Home() {
  return (
    <>
      <div className="container">
        {contents.map((content, index) => (
          <>
            <OfferItem
              key={index}
              image={content.image}
              imgOnLeft={content.imgOnLeft}
              title={content.title}
              description={content.description}
              list={content.list}
              extraContent={content.extraContent}
            />
          </>
        ))}
      </div>
    </>
  );
}
