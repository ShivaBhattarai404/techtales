"use client";

import React, { Fragment, useEffect, useState } from "react";

import Suscribe from "@/components/UI/Suscribe";
import BlogItem from "@/components/Blog/BlogCard/BlogItem";
import FilterBox from "@/components/Filter/FilterBox";
import classes from "./all-blogs.module.css";

const BlogList = (props) => {
  const [blogs, setBlogs] = useState(JSON.parse(JSON.stringify(props.blogs)));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery === "")
      return setBlogs(JSON.parse(JSON.stringify(props.blogs)));

    const searchedBlogs = blogs.filter((blog) => {
      return blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setBlogs(searchedBlogs);
  }, [searchQuery]);

  function filterBlogs(option) {
    const newBlogs = JSON.parse(JSON.stringify(props.blogs));
    if (option === "Newest") {
      newBlogs.sort((aBlog, bBlog) => {
        return (
          new Date(aBlog.createdAt).getTime() -
          new Date(bBlog.createdAt).getTime()
        );
      });
    } else if (option === "Oldest") {
      newBlogs.sort((aBlog, bBlog) => {
        return (
          new Date(bBlog.createdAt).getTime() -
          new Date(aBlog.createdAt).getTime()
        );
      });
    }
    setBlogs(newBlogs);
  }
  return (
    <Fragment>
      <h1 className={classes.heading}>All Blogs</h1>
      <Suscribe
        title="Clear"
        placeholder="Search..."
        style={{ margin: "auto" }}
        onSubmit={() => setSearchQuery("")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        btnStyle={{
          width: "8em",
          height: "2.5em",
          fontSize: "1.2em",
          padding: "0.5em",
        }}
      />

      <FilterBox onChange={filterBlogs} />
      <div className={classes.wrapper}>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogItem key={blog._id} {...blog} className={classes.blog} />
          ))
        ) : (
          <h1 className={classes.notFound}>No Blogs Found</h1>
        )}
      </div>
    </Fragment>
  );
};

export default BlogList;
