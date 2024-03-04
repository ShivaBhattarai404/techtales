"use client";

import { DEFAULT_ERROR_MESSAGE } from "@/constants/texts";

const Error = ({error}) => {
  return <h1>{DEFAULT_ERROR_MESSAGE} error: {JSON.stringify(error)}</h1>;
};

export default Error;
