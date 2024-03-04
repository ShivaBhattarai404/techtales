"use client"

import React, { forwardRef } from "react";
import classes from "./Input.module.css";

const Input = forwardRef((props, ref) => {
  const invalidtext = props.invalidtext ? ` (${props.invalidtext})` : "";
  return (
    <div
      className={`${props.className} ${classes.wrapper} ${
        props.invalidtext ? classes.invalid : ""
      }`}
      style={{ ...props.style }}
      onClick={props.onClick}
    >
      <label htmlFor={props.title}>
        {props.title}
        <span className={classes.invalidtext}>{invalidtext}</span>
      </label>
      {props.type === "textarea" ? (
        <textarea
          ref={ref}
          name={props.name}
          type="text"
          id={props.title}
          {...props}
          style={{}}
        >
          {props.children}
        </textarea>
      ) : (
        <input
          ref={ref}
          name={props.name}
          type={props.type || "text"}
          id={props.title}
          {...props}
          style={{}}
        />
      )}
    </div>
  );
});

export default Input;
