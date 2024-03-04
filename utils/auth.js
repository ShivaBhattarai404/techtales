"use server";

import { EMAIL_REGEX, OTP_LENGTH } from "@/constants/validation";
import { getCollection } from "./database";
import { sendVerificationEmail } from "./email";
import { decodeJwtToken, generateJwt } from "./jwt";
import { hashSync } from "bcryptjs";
import { cookies } from "next/headers";

// async function checkUserLogin() {
//   "use server";
//   const storedCookies = cookies();
//   if (storedCookies.token) {
//     return true;
//   }
//   return false;
// }

export async function getUserByToken(token) {
  try {
    const user = await decodeJwtToken(token);
    if (!user) {
      return null;
    }
    const userId = user._id;

    return { ...user, _id: userId };
  } catch (error) {
    return null;
  }
}

// function to check resend otp
export async function resendOtp(email) {
  // check if email is valid
  const isEmailValid = email && email.match(EMAIL_REGEX);
  if (!isEmailValid) {
    return false;
  }

  try {
    const [Unverified_Users, connection] = await getCollection(
      "Unverified_Users"
    );

    const user = await Unverified_Users.findOne({ email });
    // if user does not exist, return false
    if (!user) {
      return false;
    }
    const lastGeneratedOtpIn = user.lastGeneratedOtpIn;
    const sendNextOtpIn = new Date(
      new Date(lastGeneratedOtpIn).getTime() + 1000 * 60
    );
    const currentTime = new Date();
    const isItOkayToResendOTP = currentTime > sendNextOtpIn;

    // if it is not okay to resend otp, return false
    if (!isItOkayToResendOTP) {
      return false;
    }

    // generate new otp
    const newOtp = await generateOTP();

    const expiresIn = new Date(
      currentTime.getTime() + 1000 * 60 * 5
    ).toISOString();

    const newToken = await generateJwt({ email, otp: newOtp, expiresIn });
    await sendVerificationEmail({ to: email, jwt: newToken, otp: newOtp });

    // update lastGeneratedOtpIn and otp in database
    await Unverified_Users.updateOne(
      { email },
      {
        $set: {
          lastGeneratedOtpIn: new Date().toISOString(),
          otp: newOtp,
          expiresIn,
        },
      }
    );
    connection.close();
    return true;
  } catch (error) {
    return false;
  }
}

// function to create a hash from given string
export async function createHash(text) {
  const hashedText = hashSync(text, 12);
  return hashedText;
}

// function to generate otp
export async function generateOTP() {
  const otp = Math.random()
    .toString()
    .substring(2, OTP_LENGTH + 2);
  return otp;
}
