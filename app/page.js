import { Fragment } from "react";
import { cookies } from "next/headers";

import { getUserByToken } from "@/utils/auth";
import { getCollection, getDB } from "@/utils/database";

import AllBlogs from "@/components/Blog/AllBlogs";
import LatestBlog from "@/components/Blog/LatestSection/LatestBlog";
import FaQ from "@/components/FAQ/FaQ";
import Intro from "@/components/Intro/Intro";
import HeroHeader from "@/components/HeroHeader/HeroHeader";

export const metadata = {
  title: "Home",
};

// function to deep copy an object
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
// function to fetch all blogs from the database
export async function fetchAllBlogs(limit = 0, db) {
  "use server";
  const BlogsDoc = db.collection("Blogs");
  const UserDoc = db.collection("Users");
  const blogs = await BlogsDoc.find().limit(limit).toArray();
  await Promise.all(
    blogs.map(async (blog) => {
      const user = await UserDoc.findOne({ _id: blog.writer });
      blog.writer = user;
    })
  );

  return deepCopy(blogs);
}
// function to fetch featured blogs from the database
async function fetchFeaturedBlogs(db) {
  "use server";
  let blogs = [];
  if(db){
    const BlogsDoc = db.collection("Blogs");
    blogs = await BlogsDoc.find({ featured: true }).limit(4).toArray();
  }else {
    const [Blogs, connection] = await getCollection("Blogs");
    blogs = await Blogs.find({ featured: true }).limit(4).toArray();
    connection.close();
  }
  return blogs;
}

const getLoggedInUser = async () => {
  const storedCookies = cookies();
  const token = storedCookies.get("token")?.value;

  // check if the token is valid
  if (!token) {
    return null;
  }
  const user = await getUserByToken(token);
  return user;
};

// Home component
export default async function Home() {
  const blogLimit = 8;

  const [db, connection] = await getDB();
  const blogs = await fetchAllBlogs(blogLimit, db);
  const featuredBlogs = await fetchFeaturedBlogs(db);
  const user = await getLoggedInUser();
  connection.close();

  return (
    <Fragment>
      <Intro />
      <LatestBlog blogs={featuredBlogs} />
      <AllBlogs blogs={blogs} />
      <FaQ />

      {!user && <HeroHeader />}
    </Fragment>
  );
}
