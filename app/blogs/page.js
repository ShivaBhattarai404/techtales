import React, { Fragment } from "react";
import { fetchAllBlogs } from "../page";
import AllBlogsComponent from "./all-blogs";

export const metadata = {
  title: "All Blogs",
};

const Blogs = async () => {
  const blogs = await fetchAllBlogs();

  return (
    <Fragment>
      <AllBlogsComponent blogs={blogs} />
    </Fragment>
  );
};

export default Blogs;
