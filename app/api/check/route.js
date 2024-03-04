import { getCollection, getDB } from "@/utils/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  let email = url.searchParams.get("email");
  let username = url.searchParams.get("username");

  let dbConnection;
  try {
    const [db, connection] = await getDB();
    const Users = db.collection("Users");
    const Unverified_Users = db.collection("Unverified_Users");

    dbConnection = connection;
    let user = null;

    // if request has both email and username then find by both
    if (email && username) {
      email = email.toLowerCase();
      username = username.toLowerCase();
      user = await Users.findOne({ $or: [{ email }, { username }] });
      if (!user) {
        // if user is not on Users then search on Unverified_Users
        user = await Unverified_Users.findOne({ email, username });
      }
    }
    // if request has email then find by email
    else if (email) {
      email = email.toLowerCase();
      user = await Users.findOne({ email });
      if (!user) {
        // if user is not on Users then search on Unverified_Users
        user = await Unverified_Users.findOne({ email });
      }
    }
    // if request has username then find by username
    else if (username) {
      username = username.toLowerCase();
      user = await Users.findOne({ username });
      if (!user) {
        // if user is not on Users then search on Unverified_Users
        user = await Unverified_Users.findOne({ username });
      }
    }

    if (user) {
      connection.close();
      return NextResponse.json({ doExist: true }, { status: 409 });
    } else {
      connection.close();
      return NextResponse.json({ doExist: false }, { status: 200 });
    }
  } catch (error) {
    dbConnection.close();
    return NextResponse.json(
      {},
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
