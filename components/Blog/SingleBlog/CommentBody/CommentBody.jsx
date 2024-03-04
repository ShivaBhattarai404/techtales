import { Fragment, useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Button from "@/components/UI/Button";
import classes from "./CommentBody.module.css";

import Comment from "../Comment/Comment";
import Input from "@/components/UI/Input";
import Notification from "@/components/Notification/Notification";
import { NOTIFICATION_DURATION } from "@/constants/duration";

// component to add my comment
export function CommentInput({ onSave, user }) {
  const formSubmitHandler = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    onSave(comment);
    event.target.comment.value = "";
  };
  return (
    <div className={classes.selfCommentWrapper} onSubmit={formSubmitHandler}>
      <form className={classes.form}>
        <img src={user.avatar || "/images/profileImage.jpg"} alt="shark" />
        <Input
          type="textarea"
          title="Your Comment"
          name="comment"
          placeholder="Add your comment"
          className={`${classes.textarea} ${classes.active}`}
        />
        <Button className={classes.commentBtn}>Comment</Button>
      </form>
    </div>
  );
}

// Whole Comment component
function CommentBody({
  blogId,
  user,
  // rename comments as props comments to prevent clash
  comments: propsComments,
  addComment,
  addReply,
  setCommentCount,
  deleteComment,
  addCommentLike,
}) {
  const [comments, setComments] = useState(
    JSON.parse(JSON.stringify(propsComments))
  );
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  // remove notification after some seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, NOTIFICATION_DURATION);
    return () => {
      clearTimeout(timer);
    };
  }, [error]);
  // remove alert after some seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert("");
    }, NOTIFICATION_DURATION);
    return () => {
      clearTimeout(timer);
    };
  }, [alert]);

  // add comment handler
  const commentAddHandler = async (comment) => {
    if (comment.length === 0) return setError("Comment cannot be empty.");
    setError("");
    setLoading(true);
    const response = await addComment(blogId, comment);
    setLoading(false);
    if (!response.inserted) {
      setError(response.message);
    } else {
      setCommentCount((prevCount) => prevCount + 1);
      setComments((prevComments) => {
        return [...prevComments, response.comment];
      });
    }
  };

  const commentDeleteHandler = async (_id, blogId) => {
    setLoading(true);
    const response = await deleteComment(_id, blogId);
    setLoading(false);

    if (!response.deleted) {
      setError(response.message);
    } else {
      setCommentCount((prevCount) => prevCount - 1);
      setComments((prevComments) => {
        return prevComments.filter((comment) => comment._id !== _id);
      });
      setAlert("Comment deleted successfully.");
    }
  };
  return (
    <div className={classes.commentBody} id="commentSection">
      {error && (
        <Notification
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}

      {alert && (
        <Notification
          message={alert}
          type="success"
          onClose={setAlert.bind(null, "")}
        />
      )}

      <h1>Comments ({comments.length})</h1>

      {user && <CommentInput onSave={commentAddHandler} user={user} />}

      {!loading && comments.map((comment) => (
        <Fragment key={comment._id}>
          <Comment
            _id={comment._id}
            user={user}
            likes={comment.likes}
            commenter={comment.commenter}
            commentedAt={comment.commentedAt}
            comment={comment.comment}
            blogId={comment.blogId}
            addCommentLike={addCommentLike}
            deleteComment={commentDeleteHandler}
          />
          {comment.replies.map((reply, index) => (
            <div className={classes.replies} key={index}>
              <Comment
                _id={reply._id}
                likes={reply.likes}
                commenter={reply.commenter}
                commentedAt={reply.commentedAt}
                comment={reply.comment}
                blogId={comment.blogId}
                deleteComment={commentDeleteHandler}
              />
            </div>
          ))}
        </Fragment>
      ))}
      {loading && (
        <SkeletonTheme baseColor="#bbb" highlightColor="#ddd" borderRadius={15}>
          {new Array(3).fill().map((_, index) => (
            <Skeleton
              key={index}
              height={120}
              style={{ marginBottom: "1em" }}
            />
          ))}
        </SkeletonTheme>
      )}
    </div>
  );
}

export default CommentBody;
