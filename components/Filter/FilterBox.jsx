"use client";

import React, { useState } from "react";
import classes from "./FilterBox.module.css";
import { IoIosArrowBack as ArrowBackIosIcon } from "react-icons/io";

const FilterBox = (props) => {
  const [click, setClick] = useState(false);
  const [item, setItem] = useState("All Blogs");

  const clickHandler = (option) => {
    setClick((click) => !click);
  };
  const changeHandler = (option) => {
    setItem(option);
    props.onChange(option);
  };

  return (
    <div className={classes.container} style={{ ...props.style }}>
      <span className={classes.title}>Filter</span>
      <div className={classes.filterBox} onClick={clickHandler}>
        <p>{item}</p>
        <div className={`${classes.arrow} ${click ? classes.click : ""}`}>
          <ArrowBackIosIcon />
        </div>
        <div className={`${classes.options} ${!click ? classes.click : ""}`}>
          <ul>
            <li onClick={changeHandler.bind(null, "All Blogs")}>All Blogs</li>
            <li onClick={changeHandler.bind(null, "Newest")}>
              Newest to Oldest
            </li>
            <li onClick={changeHandler.bind(null, "Oldest")}>
              Oldest to Newest
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterBox;
