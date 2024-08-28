import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface HeaderProps {
  className?: string;
  children?: ReactNode;
}

export const Header = ({ className, children }: HeaderProps) => {
  return (
    <header id="landing" className={className}>
      <div className="container">
        <Navbar />
        {/* {children} */}
      </div>
    </header>
  );
};
