"use client";

import Button from "@/components/UI/Button";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/texts";
import { Fragment } from "react";

const Error = ({error}) => {
  return <Fragment>
    <h1>{DEFAULT_ERROR_MESSAGE}</h1>
    <Button href="/" >Go to Home</Button>
  </Fragment>;
};

export default Error;
