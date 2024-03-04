"use client";

import classes from "./Intro.module.css";
import introImage from "@/public/images/IntroImage.png";
import Image from "next/image";
import Button from "../UI/Button";

const Intro = () => {
  const btnClickHandler = () => {
    const latestBlogSection = document.getElementById("latestBlogSection");
    latestBlogSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={classes.intro}>
      <div className={classes.introContent}>
        <h1 className={classes.introTitle}>
          Welcome to <span>Tech Tales</span>
        </h1>
        <p className={classes.introDescription}>
          Dive into the world of technology and innovation with our insightful,
          engaging blog posts that explore the latest trends, tips, and stories
          from the tech industry.
        </p>
        <Button className={classes.introBtn} onClick={btnClickHandler}>
          Explore Blogs
        </Button>
      </div>
      <Image
        src={introImage}
        width={400}
        height={300}
        alt="A girl sitting on a desk with a laptop and a coffee cup"
        className={classes.introImage}
      />
    </section>
  );
};

export default Intro;
