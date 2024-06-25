import { Fragment } from "react";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import { deepCopy } from "@/app/page";
import { verifyJwtToken } from "@/utils/jwt";
import { getCollection, getDB } from "@/utils/database";

import BlogPage from "@/components/Blog/SingleBlog/BlogPage/BlogPage";

export async function generateMetadata({ params }) {
  const [Blogs, connection] = await getCollection("Blogs");
  const blog = await Blogs.findOne({ slug: params.slug });
  connection.close();
  return {
    title: blog?.title || "Blog",
  };
}

// populate the user details for the commenter and the reply commenter
async function populateUser(userId, db) {
  let user = null;
  if (db) {
    const userDoc = db.collection("Users");
    user = await userDoc.findOne({ _id: userId });
  } else {
    const [userDoc, connection] = await getCollection("Users");
    user = await userDoc.findOne({ _id: userId });
    connection.close();
  }
  if (!user) throw "User not found.";
  const { _id, name, username, image, avatar } = user;
  return { _id: _id.toString(), name, username, image, avatar };
}

// populate the comments array with the user details of the commenter and the reply commenter
async function populateComments(commentsArray, db) {
  if (!commentsArray || commentsArray.length === 0) return [];

  const commentsDoc = await db.collection("Comments");

  // get all comments from the comments array in the blog document and populate the commenter field
  const comments = await commentsDoc
    .find({
      _id: { $in: commentsArray },
    })
    .toArray();

  // get the user details for each commenter
  const populatedComments = await Promise.all(
    // get the user details for each commenter
    comments.map(async (comment) => {
      comment._id = String(comment._id);
      comment.blogId = String(comment.blogId);
      comment.likes = comment.likes.map((id) => String(id));

      // get the user details for the commenter
      const commenter = await populateUser(comment.commenter, db);

      // get the user details for each reply commenter
      // comment.replies = await Promise.all(
      //   comment.replies.map(async (reply) => {
      //     const commenter = populateUser(reply.commenter, db);
      //     return { ...reply, commenter };
      //   })
      // );
      return { ...comment, commenter };
    })
  );
  
  // return [
  //   {
  //     _id: "667a9e4695dd0c1856d4ceee",
  //     user: { _id: "" },
  //     likes: [],
  //     commenter: {
  //       _id: "667a948988a00a3dcc95d940",
  //       name: "Aryan",
  //       avatar: "/images/avatar/avatar2.png",
  //     },
  //     commentedAt: new Date().toISOString(),
  //     comment: "This seems like a great blog!",
  //     blogId: "",
  //   },
  // ];
  return populatedComments;
}

// fetch the blog details from the database
async function fetchBlog(slug, db) {
  "use server";
  let blog = null;
  if (db) {
    const blogsDoc = db.collection("Blogs");
    blog = await blogsDoc.findOne({ slug });
  } else {
    const [Blogs, connection] = await getCollection("Blogs");
    blog = await Blogs.findOne({ slug });
    connection.close();
  }
  if(!blog) throw notFound();
  return blog;
}

// add a comment to the blog
async function addComment(blogId, comment) {
  "use server";
  try {
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Please login to comment.");

    const [db, connection] = await getDB();
    const newComment = {
      commenter: new ObjectId(String(user._id)),
      likes: [],
      commentedAt: new Date().toISOString(),
      comment,
      replies: [],
      blogId: new ObjectId(String(blogId)),
    };
    const Comments = db.collection("Comments");
    const insertedComment = await Comments.insertOne(newComment);

    const Blogs = db.collection("Blogs");
    await Blogs.updateOne(
      { _id: new ObjectId(String(blogId)) },
      { $push: { comments: insertedComment.insertedId } }
    );
    connection.close();

    newComment._id = insertedComment.insertedId.toString();
    newComment.blogId = String(blogId);
    newComment.commenter = await populateUser(newComment.commenter);

    return {
      inserted: true,
      message: "Comment added successfully.",
      comment: newComment,
    };
  } catch (error) {
    return {
      inserted: false,
      message: error.message || "Something went wrong",
    };
  }
}

async function deleteComment(commentId, blogId) {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Unauthorized");

    const [db, connection] = await getDB();
    const Comments = db.collection("Comments");
    const deleteResponse = await Comments.deleteOne({
      $and: [
        { _id: new ObjectId(String(commentId)) },
        { commenter: new ObjectId(String(user._id)) },
      ],
    });
    // if the comment is not deleted, return an error message
    if (deleteResponse.deletedCount === 0) {
      connection.close();
      throw "You are not authorized to delete this comment.";
    }
    // if the comment is deleted, remove the comment from the blog document
    const Blogs = db.collection("Blogs");
    await Blogs.updateOne(
      { _id: new ObjectId(String(blogId)) },
      { $pull: { comments: new ObjectId(String(commentId)) } }
    );
    connection.close();
    return {
      deleted: true,
      message: "Comment deleted successfully.",
      commentId,
    };
  } catch (error) {
    return { deleted: false, message: error.message || "Something went wrong" };
  }
}

// add a like to the comment
const addCommentLike = async (commentId) => {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Login to like the comment");

    const [db, connection] = await getDB();
    const Comments = db.collection("Comments");
    const comment = await Comments.findOne({
      _id: new ObjectId(String(commentId)),
    });
    if (!comment) throw new Error("Comment not found");

    const isLiked = comment.likes.some(
      (like) => like.toString() === user._id.toString()
    );

    if (isLiked) {
      // if the user has already liked the comment, remove the like
      await Comments.updateOne(
        { _id: new ObjectId(String(commentId)) },
        { $pull: { likes: new ObjectId(String(user._id)) } }
      );
      connection.close();
      return { changed: true, liked: false, message: "Like removed" };
    } else {
      // if the user has not liked the comment, add the like
      await Comments.updateOne(
        { _id: new ObjectId(String(commentId)) },
        { $push: { likes: new ObjectId(String(user._id)) } }
      );
      connection.close();
      return { changed: true, liked: true, message: "Liked" };
    }
  } catch (error) {
    return {
      changed: false,
      liked: false,
      message: error.message || "Something went wrong",
    };
  } finally {
    revalidatePath(`/blogs/favorites`);
  }
};

const addReply = async (commentId, reply) => {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Unauthorized");

    const [db, connection] = await getDB();
    const Comments = db.collection("Comments");
    const newReply = {
      commenter: new ObjectId(String(user._id)),
      reply,
      repliedAt: new Date().toISOString(),
    };
    const insertedReply = await Comments.updateOne(
      { _id: new ObjectId(String(commentId)) },
      { $push: { replies: newReply } }
    );
    connection.close();

    newReply.commenter = await populateUser(newReply.commenter);

    return {
      inserted: true,
      message: "Reply added successfully.",
      reply: newReply,
    };
  } catch (error) {
    return {
      inserted: false,
      message: error.message || "Something went wrong",
    };
  } finally {
    revalidatePath(`/blogs/favorites`);
  }
};

// add the blog to the user's favorite list
const addToFavorite = async (blogId) => {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Login to add to favorites");

    const [db, connection] = await getDB();
    const Users = db.collection("Users");
    const userDoc = await Users.findOne({
      _id: new ObjectId(String(user._id)),
    });
    if (!userDoc) throw new Error("User not found");

    // check if the blog is already in the user's favorite list
    const favorites = userDoc.favorites;
    const isFavorite = favorites.some(
      (favorite) => favorite.toString() === blogId
    );

    if (isFavorite) {
      // if the blog is already in the user's favorite list, remove it
      await Users.updateOne(
        { _id: new ObjectId(String(user._id)) },
        { $pull: { favorites: new ObjectId(String(blogId)) } }
      );
      connection.close();
      return { changed: true, added: false, message: "Removed from favorites" };
    } else {
      // if the blog is not in the user's favorite list, add it
      await Users.updateOne(
        { _id: new ObjectId(String(user._id)) },
        { $push: { favorites: new ObjectId(String(blogId)) } }
      );
      connection.close();
      return { changed: true, added: true, message: "Added to favorites" };
    }
  } catch (error) {
    return {
      changed: false,
      added: false,
      message: error.message || "Something went wrong",
    };
  }
};

const isBlogInFavorite = async (blogId) => {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Unauthorized");

    const [db, connection] = await getDB();
    const Users = db.collection("Users");
    const userDoc = await Users.findOne({
      _id: new ObjectId(String(user._id)),
    });
    if (!userDoc) throw new Error("User not found");

    // check if the blog is already in the user's favorite list
    const favorites = userDoc.favorites;
    const isFavorite = favorites.some(
      (favorite) => favorite.toString() === blogId
    );
    connection.close();
    return isFavorite;
  } catch (error) {
    return false;
  }
};

const addLike = async (blogId) => {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Login to like the blog");

    const [db, connection] = await getDB();
    const Blogs = db.collection("Blogs");
    const blog = await Blogs.findOne({ _id: new ObjectId(String(blogId)) });
    if (!blog) throw new Error("Blog not found");

    const currentLikes = blog.likes.length || 0;
    const isLiked = blog.likes.some(
      (like) => like.toString() === user._id.toString()
    );

    if (isLiked) {
      // if the user has already liked the blog, remove the like
      await Blogs.updateOne(
        { _id: new ObjectId(String(blogId)) },
        { $pull: { likes: new ObjectId(String(user._id)) } }
      );
      connection.close();

      return {
        changed: true,
        liked: false,
        likesCount: currentLikes - 1,
        message: "Like removed",
      };
    } else {
      // if the user has not liked the blog, add the like
      await Blogs.updateOne(
        { _id: new ObjectId(String(blogId)) },
        { $push: { likes: new ObjectId(String(user._id)) } }
      );
      connection.close();

      return {
        changed: true,
        liked: true,
        likesCount: currentLikes + 1,
        message: "Liked",
      };
    }
  } catch (error) {
    return {
      changed: false,
      liked: false,
      message: error.message || "Something went wrong",
    };
  }
};

const isBlogLiked = async (blogId) => {
  "use server";
  try {
    // check the user is logged in
    const token = cookies().get("token")?.value;
    const user = await verifyJwtToken(token);
    if (!user) throw new Error("Unauthorized");

    const [db, connection] = await getDB();
    const Blogs = db.collection("Blogs");
    const blog = await Blogs.findOne({ _id: new ObjectId(String(blogId)) });
    if (!blog) throw new Error("Blog not found");

    const isLiked = blog.likes.some(
      (like) => like.toString() === user._id.toString()
    );
    connection.close();
    return isLiked;
  } catch (error) {
    return false;
  }
};

const Blog = async ({ params }) => {
  const token = cookies().get("token")?.value;
  // console.time("fetch");
  const user = await verifyJwtToken(token);

  const [db, connection] = await getDB();

  const slug = params.slug;
  const blog = await fetchBlog(slug, db);
  if (!blog) {
    return notFound();
  }
  const writer = await populateUser(blog.writer, db);
  const comments = await populateComments(blog.comments, db);

  connection.close();
  // console.timeEnd("fetch");

  return (
    <Fragment>
      <BlogPage
        _id={blog._id.toString()}
        slug={slug}
        user={user}
        title={blog.title}
        thumbnail={blog.thumbnail}
        content={blog.content}
        description={blog.description}
        tags={blog.tags}
        createdAt={blog.createdAt}
        writer={writer}
        likes={blog.likes?.length || 0}
        addLike={addLike}
        comments={comments}
        addComment={addComment}
        addCommentLike={addCommentLike}
        deleteComment={deleteComment}
        addReply={addReply}
        isLiked={await isBlogLiked(blog._id.toString())}
        addToFavorite={addToFavorite}
        isFavorite={await isBlogInFavorite(blog._id.toString())}
      />
    </Fragment>
  );
};

export default Blog;
