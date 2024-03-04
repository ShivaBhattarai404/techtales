import { NextResponse } from "next/server";

import { getCollection, getDB } from "@/utils/database";
import { generateJwt } from "@/utils/jwt";
import { sendVerificationEmail } from "@/utils/email";
import { EMAIL_REGEX } from "@/constants/validation";
import { createHash, generateOTP } from "@/utils/auth";
import { AVATAR_COLLECTION } from "@/constants/texts";

// function to check if email already exists
async function checkEmailExistance(email) {
  const [db, connection] = await getDB();
  const Users = db.collection("Users");
  const Unverified_Users = db.collection("Unverified_Users");

  const user = await Users.findOne({ email });
  const user1 = await Unverified_Users.findOne({ email });

  connection.close();
  return Boolean(user) || Boolean(user1);
}

// function to check if username already exists
async function checkUsernameExistance(username) {
  const [db, connection] = await getDB();
  const Users = db.collection("Users");
  const Unverified_Users = db.collection("Unverified_Users");

  const user = await Users.findOne({ username });
  const user1 = await Unverified_Users.findOne({ username });

  connection.close();
  return Boolean(user) || Boolean(user1);
}

// function to validate all user provided data
async function validate({ name, username, email, password }) {
  const isNameValid = name.length !== 0;
  const isUsernameEmpty = username.length !== 0;
  const doesUsernameExists = await checkUsernameExistance(username);
  const isEmailValid = String(email).match(EMAIL_REGEX);
  const doesEmailExists = await checkEmailExistance(email);
  const isPasswordValid = String(password).length >= 6;

  const errors = [];
  if (!isNameValid) errors.push("Name should not be empty");
  if (!isUsernameEmpty) errors.push("Username should not be empty");
  if (doesUsernameExists) errors.push("Username already exists");
  if (!isEmailValid) errors.push("Email should be valid");
  if (doesEmailExists) errors.push("Email already exists");
  if (!isPasswordValid) errors.push("Password should be 6 characters long");

  const isGivenDataValid = errors.length === 0;
  return { result: isGivenDataValid, errors };
}



export async function PUT(req) {
  const body = await req.json();

  const name = String(body.name.value);
  const username = String(body.username.value).toLocaleLowerCase();
  const email = String(body.email.value).toLowerCase().toLocaleLowerCase();
  const password = body.password.value;
  const hashedPassword = await createHash(body.password.value);
  const otp = await generateOTP();

  // set otp generated time
  const currentTime = new Date();
  const lastGeneratedOtpIn = currentTime.toISOString();
  const expiresIn = new Date(
    new Date().setMinutes(currentTime.getMinutes() + 5)
  ).toISOString();

  // validating input provided by client side
  const validationResult = await validate({ name, username, email, password });

  // choose avatar for user
  const totalAvatars = AVATAR_COLLECTION.length;
  const avatar = `/images/avatar/${AVATAR_COLLECTION[Math.floor(Math.random() * totalAvatars)]}`;
  // formatting input provided by client side
  const userData = {
    name,
    username,
    email,
    avatar,
    password: hashedPassword,
    otp,
    lastGeneratedOtpIn,
  };

  if (!validationResult.result) {
    // sending 422 reponse if inputs are not valid
    return NextResponse.json(
      { errors: validationResult.errors },
      { status: 422, statusText: "Invalid data" }
    );
  }

  // generate json token for email verfication
  const verificationToken = await generateJwt(
    {
      email,
      otp,
      expiresIn,
    },
    "5m"
  );

  // if program reaches here that means data are correct now inserting it into database
  const [Users, connection] = await getCollection("Unverified_Users");
  const insertedUser = await Users.insertOne(userData);

  // send email to user and store otp to database
  await sendVerificationEmail({ jwt: verificationToken, to: email, otp });

  connection.close();
  //   send back reponse to the client
  return NextResponse.json(
    { msg: "User creation successfull", user: { name, email, username, avatar } },
    { status: 201 }
  );
}
