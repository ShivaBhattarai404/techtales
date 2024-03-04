"use client";

import React, { useState } from "react";
import classes from "./FaQItem.module.css";
import { FaPlus as AddIcon } from "react-icons/fa6";

const FaQItem = ({ question, answer }) => {
  const [click, setClick] = useState(false);

  return (
    <div
      className={`${classes.container} ${click && classes.show}`}
      onClick={() => setClick((click) => !click)}
    >
      <h2 className={classes.qs}>{question}</h2>
      <div className={`${classes.icon} ${click && classes.icon_rotate}`}>
        <AddIcon />
      </div>
      <div className={classes.ans}>{answer}</div>
    </div>
  );
};

export default FaQItem;
