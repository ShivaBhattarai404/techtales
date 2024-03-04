import Login from "@/components/Auth/Login";
import { cookies } from "next/headers";
import { getCollection } from "@/utils/database";
import { generateJwt } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import { EMAIL_REGEX } from "@/constants/validation";

export const metadata = {
  title: "Login",
};

async function loginHandler(credientials) {
  "use server";
  // check if email and password are present
  const email = credientials.email;
  const password = credientials.password;

  if (!email || !password) {
    return { login: false, error: "Email and password are required" };
  }

  // check if email is valid using regex
  if (!email.match(EMAIL_REGEX)) {
    return { login: false, error: "Invalid email" };
  }

  // check for password length
  if (password.length < 6) {
    return {
      login: false,
      error: "Password must be at least 8 characters long",
    };
  }

  // if valid, check if email exists in database
  const [usersCollection, connection] = await getCollection("Users");
  const user = await usersCollection.findOne({ email });
  // close connection
  connection.close();
  if (!user) {
    return { login: false, error: "Incorrect email" };
  }

  // Check if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    // if not, return error
    return { login: false, error: "Incorrect password" };
  }

  // if correct, set cookies for login and token for user verification and login status
  const token = await generateJwt(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
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

  // return login status
  return { login: true };
}

export default async function () {
  return <Login login={loginHandler} />;
}
