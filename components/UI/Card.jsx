"use client"
import classes from "./Card.module.css";
import { useRouter } from "next/navigation";

const Card = (props) => {
  const router = useRouter();

  const clickHandler = (e) => {
    if(props.href) {
      router.push(props.href);
    }
    props.onClick?.(e);
  };

  return (
    <div
      className={`${classes.card} ${props.className ? props.className : ""} ${
        props.animation ? classes.animated : ""
      }`}
      style={{ ...props.style }}
      onClick={clickHandler}
    >
      {props.children}
    </div>
  );
};

export default Card;
