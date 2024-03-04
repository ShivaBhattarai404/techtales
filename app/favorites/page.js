import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

import { verifyJwtToken } from "@/utils/jwt";
import { getDB } from "@/utils/database";

import { BsHeartFill } from "react-icons/bs";

import BlogItem from "@/components/Blog/BlogCard/BlogItem";
import Button from "@/components/UI/Button";
import { deepCopy } from "../page";
import { Fragment } from "react";

export const metadata = {
  title: "Favorites",
};

async function getFavoritesBlog() {
  const storedCookies = cookies();

  const decodedToken = await verifyJwtToken(storedCookies.get("token")?.value);

  // If the token is valid, the user is logged in
  if (!decodedToken) {
    return [];
  }
  const userId = decodedToken._id;
  if (!userId) {
    return [];
  }
  const [db, connection] = await getDB();
  const Users = db.collection("Users");
  // Find the user
  const user = await Users.findOne({ _id: new ObjectId(`${userId}`) });
  // If the user is not found, return null
  if (!user) {
    return [];
  }
  const favorites = user.favorites; // Array of blog ids
  // If the user has no favorites, return null
  if (favorites.length === 0) {
    return [];
  }
  const Blogs = db.collection("Blogs");
  const blogs = await Blogs.find({ _id: { $in: favorites } }).toArray();
  
  await Promise.all(
    blogs.map(async (blog) => {
      const user = await Users.findOne({ _id: blog.writer });
      blog.writer = user;
    })
  );

  connection.close();
  return deepCopy(blogs);
}

async function page() {
  const favorites = await getFavoritesBlog();

  // If the user has no favorites, display this message
  let content = (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "#b4bbff",
          borderRadius: "50%",
          width: "25em",
          height: "25em",
          margin: "2em auto",
          position: "relative",
        }}
      >
        <BsHeartFill
          style={{
            display: "block",
            margin: "auto",
            fontSize: "13em",
            color: "#f8f9ff",
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <h1>No favorites yet!</h1>
      <p
        style={{
          color: "var(--color-gray)",
          fontSize: "1.3em",
          marginTop: "0.5em",
        }}
      >
        Like a blog you see? Save them here to your favorites.
      </p>
      <Button
        href="/blogs"
        style={{ margin: "1em auto 5em", backgroundColor: "#6f7eff" }}
      >
        Explore Blogs
      </Button>
    </div>
  );

  // If the user has favorites, display them
  if (favorites.length > 0) {
    content = (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          margin: "2em auto",
        }}
      >
        {favorites.map((blog, index) => (
          <BlogItem key={index} {...blog} />
        ))}
      </div>
    );
  }
  return (
    <Fragment>
      <h1
        style={{
          width: "fit-content",
          margin: "3em auto 0em",
          fontSize: "2.5em",
          color: "var(--color-primary)",
          wordSpacing: "10px",
        }}
      >
        Saved Blogs
      </h1>
      {content}
    </Fragment>
  );
}

export default page;
