import { EMAIL_REGEX } from "@/constants/validation";
import { getDB } from "@/utils/database";
import { generateJwt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const email = body.email || "";
  const otp = body.otp;

  if (email.length === 0 || !email.match(EMAIL_REGEX)) {
    return NextResponse.json({}, { status: 422, statusText: "Invalid Email" });
  }
  try {
    const [db, connection] = await getDB();
    const Users = db.collection("Users");
    const Unverified_Users = db.collection("Unverified_Users");

    const user = await Unverified_Users.findOne({ email });
    if (!user) {
      connection.close();
      return NextResponse.json(
        {},
        { status: 422, statusText: "Invalid email" }
      );
    }
    if (+user.otp !== +otp) {
      connection.close();
      return NextResponse.json(
        {},
        { status: 401, statusText: "Incorrect otp" }
      );
    }
    // otp is only valid for 5 minutes after they are created
    const expiryTime =
      new Date(user.lastGeneratedOtpIn).getTime() + 1000 * 60 * 5;
    const current = new Date().getTime();
    if (current > expiryTime) {
      connection.close();
      return NextResponse.json({}, { status: 410, statusText: "Otp Expired" });
    }

    // if token is valid and correct then move account from unverifed to verified
    const verifiedUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      password: user.password,
    };
    const insertedUser = await Users.insertOne(verifiedUser);
    await Unverified_Users.deleteOne({ _id: user._id });
    connection.close();

    // generate jwt token for user verification
    const token = await generateJwt(
      {
        _id: insertedUser.insertedId,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      },
      "7d"
    );
    // set cookies for login and token for user verification and login status
    cookies().set({
      name: "token",
      value: token,
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ msg: "User verified" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {},
      { status: error.status || 500, statusText: "server error" }
    );
  }
}
