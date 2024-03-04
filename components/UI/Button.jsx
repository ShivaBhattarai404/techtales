"use client";

import React from "react";

import classes from "./Button.module.css";
import { useRouter } from "next/navigation";

const Button = (props) => {
  const router = useRouter();
  const variant = props.variant || "primary";
  const type = props.type || "submit";
  /*
  list of variants
  primary
  text
  outline
  contained
  */

  const btnClickHandler = (e) => {
    if(type !== "submit"){
      e.preventDefault();
    }

    if (props.href) {
      router.push(props.href);
    }
    else if (props.onClick) {
      props.onClick(e);
    }
  };

  let btnClass = `${classes.btn} ${props.className} ${
    variant && variant.includes("disabled") && classes.disabled
  } ${
    !variant
      ? classes.primary
      : variant.includes("text")
      ? classes.text
      : variant.includes("outlined")
      ? classes.outlined
      : variant.includes("tagBox")
      ? classes.tagBox
      : variant.includes("tag")
      ? classes.tag
      : variant.includes("cta")
      ? classes.cta
      : variant.includes("cancel")
      ? classes.cancel
      : classes.primary
  }`;

  if(props.hoverEffect){
    btnClass += ` ${classes.hover}`;
  }
  return (
    <button
      style={{ ...props.style }}
      className={btnClass}
      onClick={btnClickHandler}
      type={type}
    >
      {props.children}
    </button>
  );
};

export default Button;
