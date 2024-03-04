import { decodeJwtToken, generateJwt } from "@/utils/jwt";
import EmailVerifyPage from "./component";
import { getDB } from "@/utils/database";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const metadata = {
  title: "Verify Email",
};

async function verifySignupToken(jwtToken) {
  "use server";
  // decode jwt token
  if (!jwtToken) return notFound();
  const token = await decodeJwtToken(jwtToken);

  // if token is invalid or expired show 404 page
  if (!token) {
    return notFound();
  }

  // extract email
  const email = token.email;
  const otp = token.otp;
  const expiresIn = new Date(token.expiresIn);
  const currentTime = new Date();

  // if token expired throw error as invalid token
  if (currentTime > expiresIn) {
    throw new Error("EXPIRED_TOKEN");
  }

  // check for that email in database
  const [db, connection] = await getDB();
  const Unverified_Users = db.collection("Unverified_Users");
  const Users = db.collection("Users");
  const user = await Unverified_Users.findOne({ email });

  // if the provided email doesnot exists in unverfied_users collection redirect them to home
  // because user has been already verified
  if (!user) {
    return redirect("/");
  }
  // if email is valid but otp is not correct throw error
  if (user.otp !== otp) {
    throw new Error("INCORRECT_OTP");
  }

  // if code reach here means everything is correct
  // delete User from unverified
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

  // set cookies for login and token for user verification and login status
  const newToken = await generateJwt(
    {
      _id: insertedUser._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
    "7d"
  );

  return newToken;
}

async function setTokenCookie(token) {
  "use server";
  cookies().set({
    name: "token",
    value: token,
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  });
}

const page = async ({ params: { token } }) => {
  const title = "Your Email has been Verified";
  const description =
    "Shiva, to complete the account creation on Techtales, we need to verify your email ID";
  const btnText = "GO TO HOME PAGE";

  const resToken = await verifySignupToken(token);

  return (
    <EmailVerifyPage
      title={title}
      description={description}
      btnText={btnText}
      cb={setTokenCookie.bind(null, resToken)}
    />
  );
};

export default page;
