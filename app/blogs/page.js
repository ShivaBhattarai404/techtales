import React, { Fragment } from "react";
import { fetchAllBlogs } from "../page";
import AllBlogsComponent from "./all-blogs";
import { getDB } from "@/utils/database";

export const metadata = {
  title: "All Blogs",
};

const Blogs = async () => {
  const [db, connection] = await getDB();
  const blogs = await fetchAllBlogs(0, db);
  connection.close();

  return (
    <Fragment>
      <AllBlogsComponent blogs={blogs} />
    </Fragment>
  );
};

export default Blogs;
