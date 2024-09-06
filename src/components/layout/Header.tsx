// "use client";

// import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

export const Header = () => {
  //   const [sticky, setSticky] = useState("");
  //   useEffect(() => {
  //     window.addEventListener("scroll", isSticky);
  //     return () => {
  //       window.removeEventListener("scroll", isSticky);
  //     };
  //   }, []);

  //   const header = document.getElementById("myHeader");
  //   // var sticky = header.offsetTop;

  //   const isSticky = () => {
  //     // const scrollTop =
  //     //   document.body.scrollTop > 115 || document.documentElement.scrollTop > 115;
  //     // const stickyClass = scrollTop ? "is-sticky" : "";
  //     const scrollTop = window.scrollY;
  //     const stickyClass = scrollTop >= 0 ? "is-sticky" : "";
  //     let xd = document.getElementById("landing");
  //     console.log("offsetTop:", header?.offsetTop);
  // // header?.style.height = scrollTop;
  //     setSticky(stickyClass);
  //   };

  return (
    // <header id="landing" className={sticky}>
    <header id="landing">
      <div className="container">
        <Navbar />
      </div>
    </header>
  );
};
