"use client";

import { useEffect, useState } from "react";

import classes from "./LikeAndCommentBox.module.css";

import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { NOTIFICATION_DURATION } from "@/constants/duration";
import Notification from "@/components/Notification/Notification";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/texts";

function LikeAndCommentBox(props) {
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const [addToFavLoading, setAddToFavLoading] = useState(false);
  const [likes, setLikes] = useState(props.likes);
  const [isHeartRed, setIsHeartRed] = useState(props.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(props.isFavorite || false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert("");
    }, NOTIFICATION_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [alert]);

  const commentBtnClickHandler = () => {
    const commentSection = document.getElementById("commentSection");
    const position = commentSection.offsetTop - 100;
    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  const handleAddToFavorite = async () => {
    setIsBookmarked(prevState => !prevState)
    try {
      if (addToFavLoading) return;
      setAddToFavLoading(true);
      const { changed, added, message } = await props.addToFavorite();
      if (changed && added) setIsBookmarked(true);
      if (changed && !added) setIsBookmarked(false);
      setAlert(message);
    } catch (error) {
      setAlert(DEFAULT_ERROR_MESSAGE);
    } finally {
      setAddToFavLoading(false);
    }
  };

  const handleAddLike = async () => {
    setLikes((like) => {
      return isHeartRed ? like-1 : likes+1;
    });
    setIsHeartRed((prevState) => {
      return !prevState;
    });
    try {
      // If the loading is true, it means the previous request is not completed yet, so return
      if (loading) return;
      // Set the loading to true to prevent multiple requests at the same time
      setLoading(true);
      // Call the addLike function from the parent component
      const { changed, liked, message, likesCount } = await props.addLike();
      // If the response.likes is true, it means the like is added, so increment the likes count
      // Otherwise, decrement the likes count
      if (liked) {
        setIsHeartRed(true);
        setLikes(likesCount);
      } else if (changed && !liked) {
        setIsHeartRed(false);
        setLikes(likesCount);
      }
      // Set the alert message
      setAlert(message);
    } catch (error) {
      setAlert(DEFAULT_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      {alert && (
        <Notification
          message={alert}
          type="success"
          onClose={setAlert.bind(null, "")}
        />
      )}

      <div
        className={`${classes.icon} ${classes.likeBtn}`}
        onClick={() => {
          setAlert("");
          handleAddLike();
        }}
      >
        {isHeartRed && <FaHeart className={classes.liked} />}
        {!isHeartRed && <FaRegHeart />}
        <span>{likes}</span>
      </div>

      <div
        className={`${classes.icon} ${classes.commentBtn}`}
        onClick={commentBtnClickHandler}
      >
        <FaRegComment />
        <span>{props.comments}</span>
      </div>

      <div
        className={`${classes.icon} ${classes.saveBtn}`}
        onClick={() => {
          setAlert("");
          handleAddToFavorite();
        }}
      >
        {isBookmarked && <FaBookmark className={classes.saved} />}
        {!isBookmarked && <FaRegBookmark />}
      </div>
    </div>
  );
}

export default LikeAndCommentBox;
