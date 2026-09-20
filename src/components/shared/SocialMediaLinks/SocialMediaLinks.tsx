import Link from "next/link";
import styles from "./SocialMediaLinks.module.scss";

interface SocialMediaLinksProps {
  className?: string;
}

export const SocialMediaLinks = ({ className }: SocialMediaLinksProps) => {
  const linkToInstagram = process.env.INSTAGRAM_LINK ?? "/";
  const linkToFacebook = process.env.FACEBOOK_LINK ?? "/";

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <Link href={linkToInstagram} target="_blank">
        <div className={styles.instagramIcon} />
      </Link>
      <Link href={linkToFacebook} target="_blank">
        <div className={styles.facebookIcon} />
      </Link>
    </div>
  );
};
