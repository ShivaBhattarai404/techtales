import { notFound, redirect } from "next/navigation";
import { hashSync } from "bcryptjs";

import { decodeJwtToken } from "@/utils/jwt";

import EmailVerifyPage from "../../verify/[token]/component";

import classes from "./component.module.css";
import expiredImage from "@/public/images/expired.svg";
import ResetPassword from "./component";
import { getCollection, getDB } from "@/utils/database";
import successImage from "@/public/images/success.png";
import { createHash } from "@/utils/auth";

export const metadata = {
  title: "Reset password",
};

async function resetPassword(email, token, password, confirmPassword) {
  "use server";

  const [db, connection] = await getDB();
  const Blacklist = db.collection("Blacklist");
  const blacklistedToken = await Blacklist.findOne({ token });
  if (blacklistedToken)
    return {
      done: false,
      error: "Link Expired",
    };

  if (!password || !confirmPassword) {
    return {
      done: false,
      error: "Password and confirm password are required",
    };
  }
  if (password.length < 8 || confirmPassword.length < 8) {
    return {
      done: false,
      error: "Password must be at least 8 characters",
    };
  }
  if (password !== confirmPassword) {
    return {
      done: false,
      error: "Password and confirm password do not match",
    };
  }
  //   update password in database
  const Users = db.collection("Users");
  const hashedPassword = await createHash(password);
  await Users.updateOne({ email }, { $set: { password: hashedPassword } });

  //   add token to blacklist
  await Blacklist.insertOne({ token, createdAt: new Date().toISOString() });
  connection.close();

  return { done: true };
}

const page = async ({ params: { token } }) => {
  const decodedToken = await decodeJwtToken(token);
  //   if token is invalid, redirect to 404 page
  if (!decodedToken) {
    return notFound();
  }

  //   if token is expired, show expired page
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const isTokenExpired = decodedToken.exp < currentTime;

  if (isTokenExpired) {
    return (
      <div className={classes.margin}>
        <EmailVerifyPage
          title="Link expired"
          description="The link you are trying to use has expired. Please request a new link
          to reset your password."
          btnText="Go to forgot password"
          href="/forgot-password"
          image={expiredImage}
        />
      </div>
    );
  }

  //  check if token is blacklisted
  const [Blacklist, connection] = await getCollection("Blacklist");
  const blacklistedToken = await Blacklist.findOne({ token });
  connection.close();
  if (blacklistedToken) {
    return (
      <div className={classes.margin}>
        <EmailVerifyPage
          title="Password reset successful"
          description="Your password has been reset successfully. You can now login with your new password."
          btnText="Go to login"
          href="/login"
          image={successImage}
        />
      </div>
    );
  }

  return (
    <ResetPassword
      reset={resetPassword.bind(null, decodedToken.email, token)}
    />
  );
};

export default page;
