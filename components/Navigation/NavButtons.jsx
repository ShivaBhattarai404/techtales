import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "../UI/Button";
import classes from "./NavButtons.module.css";
import Notification from "../Notification/Notification";
import { NOTIFICATION_DURATION } from "@/constants/duration";

import { IoMdLogOut } from "react-icons/io";

const formatName = (name) => {
  const nameArr = name.split(" ");
  const formattedNameArr = nameArr.map((word) => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });
  return formattedNameArr.join(" ");
};

const NavButtons = ({ isLoggedIn, user }) => {
  const [error, setError] = useState("");
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, NOTIFICATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const logoutHandler = async () => {
    setShowLogout(false);
    setError("Logging out...");
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response);
        setError("Something went wrong. Please try again later.");
      } else {
        router.replace("/login");
        return router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  if (isLoggedIn) {
    return (
      <Fragment>
        {error && <Notification message={error} />}
        <div className={classes.user} onClick={()=>setShowLogout(i => !i)}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={30}
            height={30}
            className={classes.avatar}
          />
          <h1>{formatName(user.name)}</h1>
        </div>

        <ul
          className={`${classes.dialogbox} ${showLogout ? classes.active : ""}`}
        >
          <li onClick={logoutHandler} className={classes.logoutBtn}>
            <IoMdLogOut />
            Log Out
          </li>
        </ul>
      </Fragment>
    );
  }
  return (
    <div className={classes.wrapper} >
      <Button variant="text" href="/login">
        Log In
      </Button>
      <Button variant="primary" href="/signup">
        Sign Up
      </Button>
    </div>
  );
};

export default NavButtons;
