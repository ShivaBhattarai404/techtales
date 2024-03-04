"use client";

import Button from "./Button";

import classes from "./Suscribe.module.css";

const Suscribe = (props) => {
  function submitHandler(e) {
    e.preventDefault();
    if(props.disabled) return;
    const email = e.target.newsLetteremail.value;
    props.onSubmit?.(email);
    e.target.newsLetteremail.value = "";
  }
  return (
    <form
      className={classes.suscribe}
      style={{ ...props.style }}
      onSubmit={submitHandler}
      noValidate
    >
      <input
        type={props.type || "text"}
        placeholder={props.placeholder || "Enter Your Email"}
        name="newsLetteremail"
        value={props.value}
        onChange={props.onChange}
      />
      <Button variant="contained" style={{...props.btnStyle}} className={classes.btn} >{props.title || "Suscribe"}</Button>
    </form>
  );
};

export default Suscribe;
