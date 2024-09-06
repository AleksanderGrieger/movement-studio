import Link from "next/link";
import {ReactNode} from "react";

interface TextButtonProps {
    link: string,
    classNames: string,
    children?: ReactNode,
}

export const TextButton = ({children ,link, classNames}: TextButtonProps) => {
    return (
        <Link className={classNames} href={link}>{children}</Link>
    )
}
