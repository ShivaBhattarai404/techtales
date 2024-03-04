import React from "react";

import logo from "@/public/images/logo.png";

import classes from "./Footer.module.css";
import Suscribe from "../UI/Suscribe";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer__head}>
        <Image src={logo} alt="logo" width={250} height={100} />
        <p>
          Welcome to TechTales, your premier destination for staying updated on
          the latest trends, insights, and stories from the dynamic world of
          technology. Delve into our curated collection of articles, reviews,
          and analyses, designed to inform and inspire. Join our community of
          tech enthusiasts and innovators as we embark on a journey of discovery
          together.
        </p>
        {/* <Suscribe /> */}
      </div>

      <div className={classes.footer__links}>
        <div>
          <span>Pages</span>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/">All Blogs</Link>
        </div>
        <div>
          <span>Forms</span>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
        <div>
          <span>Requests</span>
          <Link href="/request-to-verify">Verify Email</Link>
          <Link href="/forgot-password">Forgot Password</Link>
        </div>
      </div>
      <div className={classes.footer__bottom}>
        <div>
          <Link href="/">Terms & Condition</Link>
          <Link href="/">Privacy Policy</Link>
        </div>
        <span>
          Copyright 2023 © Techtales | Created by Shiva - Powered by React
        </span>
      </div>
    </footer>
  );
};

export default Footer;
