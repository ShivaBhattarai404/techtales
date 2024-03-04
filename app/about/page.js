import React, { Fragment } from "react";
import About from "@/components/About/About";
import FAQ from "@/components/FAQ/FaQ";

export const metadata = {
  title: "About Us",
};

const AboutPage = () => {
  return (
    <Fragment>
      <About />
      <FAQ />
    </Fragment>
  );
};

export default AboutPage;
