"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import logo from "@/public/images/logo.png";

import NavButtons from "./NavButtons";

import classes from "./NavBar.module.css";
import { NOTIFICATION_DURATION } from "@/constants/duration";
import Notification from "../Notification/Notification";

const NavBar = ({ isLoggedIn, user }) => {
  const [navClick, setNavClick] = useState(false);
  const [alert, setAlert] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert("");
    }, NOTIFICATION_DURATION);
    return () => clearTimeout(timer);
  }, [alert]);

  const menuClickHandler = () => {
    setNavClick((prevState) => !prevState);
  };

  const logoutHandler = async () => {
    setNavClick(false);
    setAlert("Logging out...");
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setAlert("Something went wrong. Please try again later.");
      } else {
        router.replace("/login");
        return router.refresh();
      }
    } catch (error) {
      throw new Error("Something went wrong. Please try again later.");
    }
  };

  return (
    <nav className={classes.navigation}>
      {alert && <Notification message={alert} onClose={() => setAlert("")} />}
      {/* logo */}
      <div className={classes.logo}>
        <Link href="/">
          <Image src={logo} alt="Logo" width={150} height={100} />
        </Link>
      </div>

      {/* menu hamburger btn */}
      <div className={classes.menuBtn} onClick={menuClickHandler}>
        <span
          style={{
            transform: `${
              navClick
                ? "translateY(4px) rotate(-45deg)"
                : "translateY(0px) rotate(0deg)"
            }`,
          }}
        ></span>
        <span style={{ scale: `${navClick ? "0" : "1"}` }}></span>
        <span
          style={{
            transform: `${
              navClick
                ? "translateY(-12px) rotate(40deg)"
                : "translateY(0px) rotate(0deg)"
            }`,
          }}
        ></span>
      </div>

      {/* navLinks */}
      <div
        className={`${classes.navLinks} ${navClick ? classes.mobileNav : ""}`}
      >
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blogs">All Blogs</Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link href="/favorites">Favorites</Link>
            </li>
          )}
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
          {isLoggedIn && <li className={classes.logoutLink} onClick={logoutHandler}>Log out</li>}
        </ul>

        {/* nav buttons */}
        <NavButtons isLoggedIn={isLoggedIn} user={user} />
      </div>
    </nav>
  );
};

export default NavBar;
