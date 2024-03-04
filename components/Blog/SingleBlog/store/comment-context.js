import { createContext } from "react";

const CommentContext = createContext({
    likes: 0,
    comments: [],
    save: 0,
    addToSave: ()=>{},
    addLikes: (blogId)=>{},
    addComment: (comment)=>{},
    addReply: (comment, id)=>{},
    addCommentLike: (id)=>{},
})

export default CommentContext;