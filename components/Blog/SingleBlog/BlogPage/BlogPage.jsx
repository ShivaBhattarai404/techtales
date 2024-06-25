"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import classes from "./BlogPage.module.css";
import UserBox from "../../../UI/UserBox";
import LikeAndCommentBox from "../LikeAndCommentBox/LikeAndCommentBox";
import CommentBody from "../CommentBody/CommentBody";

const BlogPage = (props) => {
  const {
    _id,
    user,
    title,
    thumbnail,
    description,
    content,
    tags,
    createdAt,
    writer,
    likes,
    addLike,
    isLiked,
    isFavorite,
    addToFavorite,
    addReply,
    comments,
    addComment,
    deleteComment,
    addCommentLike,
  } = props;

  // managing comment count here because it is not changing in the CommentBody component
  const [commentCount, setCommentCount] = useState(comments.length);

  return (
    <Fragment>
      <section className={classes.blogWrapper}>
        <div className={classes.intro}>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className={classes.header}>
          <UserBox
            className={classes.header__userBox}
            writer={writer}
            createdAt={createdAt}
          />
        </div>
        <div className={classes.body}>
          {/* replaced strong tag with p.caption */}
          {/* replaced img tag with Next Image */}
          <Markdown
            children={content}
            rehypePlugins={[rehypeRaw]}
            components={{
              img({ alt, src }) {
                return <Image src={src} alt={alt} width={1000} height={1000} />;
              },
              strong(props) {
                return <em className={classes.caption}>{props.children}</em>;
              },
              a(props) {
                return (
                  <Link
                    href={props.href}
                    className={classes.link}
                    target="_blank"
                  >
                    {props.children}
                  </Link>
                );
              },
            }}
          />

          <LikeAndCommentBox
            likes={likes}
            isLiked={isLiked}
            addLike={addLike.bind(null, _id)}
            comments={commentCount}
            isFavorite={isFavorite}
            addToFavorite={addToFavorite.bind(null, _id)}
          />
        </div>
        <CommentBody
          user={user}
          blogId={_id}
          comments={comments}
          addComment={addComment}
          setCommentCount={setCommentCount}
          addReply={addReply}
          deleteComment={deleteComment}
          addCommentLike={addCommentLike}
        />
      </section>
    </Fragment>
  );
};

export default BlogPage;
