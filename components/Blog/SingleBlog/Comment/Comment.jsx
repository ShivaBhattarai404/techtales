import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import { TbDotsVertical } from "react-icons/tb";
import { FaHeart, FaRegHeart, FaReply } from "react-icons/fa";

import classes from "./Comment.module.css";
import { CommentInput } from "../CommentBody/CommentBody";
import { dateFormatter } from "@/utils/formatter";
import { NOTIFICATION_DURATION } from "@/constants/duration";
import Notification from "@/components/Notification/Notification";

const Comment = ({
  _id,
  user,
  likes,
  commenter,
  commentedAt,
  comment,
  blogId,
  addCommentLike,
  deleteComment,
}) => {
  const [showReplyTextarea, setShowReplyTextarea] = useState(false);
  const [showDialogbox, setShowDialogbox] = useState(false);
  const [commentLikes, setCommentLikes] = useState(likes.length || 0);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert("");
    }, NOTIFICATION_DURATION);
    return () => clearTimeout(timer);
  }, [alert]);

  const isCommentLiked = likes.some((like) => like === user._id);
  const [commentLiked, setCommentLiked] = useState(isCommentLiked);

  const isCommenter = user && user._id === commenter._id;

  const handleCommentLike = async () => {
    setCommentLiked((prevState) => !prevState);
    
    if(!user) return setAlert("Please login to like a comment");
    try {
      const { liked, changed } = await addCommentLike(_id, blogId);
      if (liked) {
        setCommentLiked(true);
        setCommentLikes((prevState) => prevState + 1);
      }
      if (!liked && changed) {
        setCommentLiked(false);
        setCommentLikes((prevState) => prevState - 1);
      }
    } catch (error) {
      setAlert("Something went wrong, please try again");
    }
  };

  return (
    <Fragment>
      {alert && <Notification message={alert} onClose={()=>setAlert("")} />}
      <div className={classes.wrapper}>
        {/* like button */}
        <div className={classes.likeIcon} onClick={handleCommentLike}>
          {commentLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{commentLikes}</span>
        </div>

        {/* commenter */}
        <div className={classes.user}>
          <Image src={commenter.avatar} alt="profile" width={50} height={50} />
          <span>{commenter.name}</span>
          <div className={classes.time}>{dateFormatter(commentedAt)}</div>
        </div>

        {/* show delete option only for the commenter */}
        {isCommenter && (
          <div
            className={classes.dots}
            onClick={() => setShowDialogbox((prevState) => !prevState)}
          >
            <TbDotsVertical />
          </div>
        )}
        <ul
          className={classes.dialogbox}
          style={{ scale: showDialogbox ? "1" : "0" }}
        >
          {/* <li>Edit</li> */}
          <li
            onClick={() => {
              setShowDialogbox(false);
              deleteComment(_id, blogId);
            }}
          >
            Delete
          </li>
        </ul>

        {/* <div
          className={classes.replyText}
          onClick={() => setShowReplyTextarea((prevState) => !prevState)}
        >
          <FaReply />
          Reply
        </div> */}
        <div className={classes.comment}>{comment}</div>
      </div>

      {showReplyTextarea && (
        <div className={classes.reply}>
          <CommentInput
            replyTo={commenter.name}
            commentId={_id}
            onSave={setShowReplyTextarea.bind(null, false)}
            onCancel={setShowReplyTextarea.bind(null, false)}
            active={true}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Comment;
