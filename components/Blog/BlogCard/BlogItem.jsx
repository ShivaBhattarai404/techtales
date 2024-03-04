import React from "react";
import Card from "../../UI/Card";
import classes from "./BlogItem.module.css";
import Button from "../../UI/Button";
import Link from "next/link";
import Image from "next/image";

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

const BlogItem = (props) => {
  const { title, description, thumbnail, tags, writer, createdAt, slug } = props;

  return (
    <Card className={`${classes.blog} ${props.className}`} animation={true} style={{...props.style}}  >
      <Link href={`/blogs/${slug}`}>
        <div className={classes.blogImageWrapper}>
          <Image src={thumbnail} width={500} height={500} alt="Blog" />
        </div>
        <div className={classes.tagBox}>
          {tags &&
            tags.map((tag, index) => (
              <Button key={index} variant="tag">
                {tag}
              </Button>
            ))}
        </div>
        <h1 className={classes.title}>{title}</h1>
        <p className={classes.description}>{description}</p>
        <div className={classes.userBox}>
          <Image
            src={writer?.avatar || "/images/user.png"}
            alt="User Profile Image"
            width={100}
            height={100}
          />
          <span className={classes.userBox__userName}>{writer?.name}</span>
          <span className={classes.userBox__postingDate}>
            {formatDate(createdAt)}
          </span>
        </div>
      </Link>
    </Card>
  );
};

export default BlogItem;
