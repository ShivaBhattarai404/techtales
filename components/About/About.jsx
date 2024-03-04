import Image from "next/image";
import Button from "../UI/Button";

import classes from "./About.module.css";

// import profilePic from "@/public/images/my-closeup-pic.jpg";
import profilePic from "@/public/images/cropped_image.png";

import {
  FaLinkedin as LinkedIn,
  FaFacebook as Facebook,
  FaTwitter as Twitter,
} from "react-icons/fa";
import Link from "next/link";

const About = () => {
  return (
    <section className={classes.section}>
      <div className={classes.detail}>
        <h1>
          Hello, I'm <b>Shiva Bhattarai</b>
        </h1>
        <span>Admin of TechTales</span>
        <p>
          Welcome to TechTales! We're a team of tech lovers who enjoy sharing
          stories about the exciting world of technology. Our goal is to keep
          you informed and entertained with easy-to-understand articles,
          reviews, and discussions about the latest gadgets and innovations.
          Whether you're a tech enthusiast or just curious about what's new,
          we're here to make technology fun and accessible for everyone. Welcome
          to TechTales - where every story is a journey into the world of
          possibilities.
        </p>
        <Button href="/contact">GET IN TOUCH</Button>
        <div className={classes.iconBox}>
          <Link href="https://www.facebook.com/shiva.bhattarai.9235" target="_blank">
            <span className={classes.icon}>
              <Facebook />
            </span>
          </Link>

          <Link href="https://www.x.com/shiva_404" target="_blank">
            <span className={classes.icon}>
              <Twitter />
            </span>
          </Link>

          <Link href="https://www.linkedin.com/in/shiva-bhattarai-b77981263" target="_blank">
            <span className={classes.icon}>
              <LinkedIn />
            </span>
          </Link>
        </div>
      </div>
      <div className={classes.imgWrapper}>
        <Image
          src={profilePic}
          alt="Shiva Bhattarai"
          placeholder="blur"
          height={400}
          width={400}
          style={{ borderRadius: "50%" }}
        />
      </div>
    </section>
  );
};

export default About;
