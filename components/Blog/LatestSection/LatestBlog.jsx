import React from "react";
import classes from "./LatestBlog.module.css";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import Image from "next/image";

const LatestBlog = ({ blogs }) => {
  return (
    <section className={classes.section} id="latestBlogSection">
      <h1>Latest Blog</h1>

      {blogs.map(({ slug, title, thumbnail, description, tags }, index) => (
        <Card
          key={index}
          className={`${classes.blogCard} ${classes[`blog${index}`]}`}
          href={`/${slug}`}
          animation={true}
        >
          <Image src={thumbnail} alt={title} width={400} height={400} />
          <div className={classes.blog_info}>
            <div className={classes.tags}>
              {tags &&
                tags.map((tag) => (
                  <Button key={tag} variant="tag">
                    {tag}
                  </Button>
                ))}
            </div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </Card>
      ))}
    </section>
  );
};

export default LatestBlog;
