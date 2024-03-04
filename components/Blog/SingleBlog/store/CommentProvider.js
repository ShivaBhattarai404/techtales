import { useEffect, useState } from "react";
import CommentContext from "./comment-context";

const DUMMY_COMMENTS = [
  {
    commenter: {
      name: "Janaki",
      image: "",
    },
    likes: 256,
    commentedAt: "1 month ago",
    comment: `Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.`,
    replies: [
      {
        commenter: {
          name: "Hari",
          image: "",
        },
        likes: 14,
        commentedAt: "2 days ago",
        comment:
          "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
      },
      {
        commenter: {
          name: "Juna",
          image: "",
        },
        likes: 14,
        commentedAt: "2 days ago",
        comment: `Each project serves a different purpose and has its own community.
            Even though I've used Firebase & Supabase, each platform has unique features that make them distinct.
            For instance, Buildship is different from these (for scraping or workflow using APIs).`,
      },
    ],
  },
  {
    commenter: {
      name: "Juna",
      image: "",
    },
    likes: 14,
    commentedAt: "2 days ago",
    comment:
      "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
    replies: [],
  },
];

const getComments = () => {
  // fetch comments from backend
  return DUMMY_COMMENTS;
};

const CommentProvider = (props) => {
  useEffect(() => {
    // fetch comment from backend
    const fetchedComments = getComments();
    setComments(fetchedComments);

    return () => {};
  }, []);
  const [comments, setComments] = useState([]);

  // function to add a new comment
  const addComment = (comment) => {
    // send this data to database
    setComments((prevComments) => [comment, ...prevComments]);
  };

  // function to add a new reply
  const addReply = (comment, i) => {
    // send this data to database
    setComments((comments) => {
      const updatedComments = JSON.parse(JSON.stringify(comments));
      updatedComments[i].replies.push(comment);
      return updatedComments;
    });
  };

  const addCommentLike = (id) => {
    // add like to this comment
    console.log("added likes to " + id);
  };
  return (
    <CommentContext.Provider
      value={{
        comments,
        addComment,
        addReply,
        addCommentLike,
      }}
    >
      {props.children}
    </CommentContext.Provider>
  );
};

export default CommentProvider;
