import React from "react";
import classes from "./AllBlog.module.css";
import Button from "../UI/Button";
import BlogItem from "./BlogCard/BlogItem";
import { FaArrowRight as ArrowForwardIcon } from "react-icons/fa";

const AllBlogs = ({blogs}) => {
  return (
    <section className={classes.section}>
      <h1 className={classes.title}>All Blogs</h1>
      {/* <div className={classes.tagBox}>
        <Button variant="Primary">ALL</Button>
        <Button variant="text">tag1</Button>
        <Button variant="text">tag2</Button>
        <Button variant="text">tag3</Button>
        <Button variant="text">tag4</Button>
      </div> */}
      <div className={classes.blogWrapper}>
        {blogs.map((blog) => (
          <BlogItem
            key={blog.slug}
            className={classes.blog}
            slug={blog.slug}
            title={blog.title}
            thumbnail={blog.thumbnail}
            description={blog.description}
            tags={blog.tags}
            user={blog.user}
            writer={blog.writer}
            createdAt={blog.createdAt}
          />
        ))}
      </div>
      <Button variant="cta" className={classes.cta__loadMore} href="/blogs">
        <span>View All Blogs</span>
        <ArrowForwardIcon />{" "}
      </Button>
    </section>
  );
};

export default AllBlogs;
