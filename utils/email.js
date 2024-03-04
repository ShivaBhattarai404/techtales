"use server";

// import {
//   TECHTALES_EMAIL_ADDRESS,
//   TECHTALES_EMAIL_APP_PASSWORD,
// } from "@/constants/credientials";
import nodemailer from "nodemailer";

const TECHTALES_EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD
const TECHTALES_EMAIL_ADDRESS = process.env.EMAIL_ADDRESS


// function to send email
export async function sendVerificationEmail({ jwt, to, otp }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: TECHTALES_EMAIL_ADDRESS,
      pass: TECHTALES_EMAIL_APP_PASSWORD,
    },
  });

  const content = `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
    <h2 style="color: #333333; text-align: center;">Welcome to techtales!</h2>
    <p style="color: #666666;">Thank you for signing up! Please verify your email address to activate your account.</p>
    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">Your verification code is: <span style="color: #007bff; font-weight: bold;">${otp}</span></p>
    <p style="color: #666666;">Or you can click the following link to verify your email:</p>
    <a href="http://localhost:3000/verify/${jwt}" style="display: block; text-align: center; text-decoration: none; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">Verify Email</a>
    <p style="color: #666666; margin-top: 20px;">If you did not sign up for an account on techtales, you can safely ignore this email.</p>
    <p style="color: #666666;">Thanks,<br> The techtales Team</p>
    </div>
    </body>`;

  try {
    const response = await transporter.sendMail({
      from: `Tech Tales ${TECHTALES_EMAIL_ADDRESS}`,
      to: to,
      subject: "Verify your email",
      html: content,
    });
  } catch (error) {
    return null;
  }
}

export async function sendResetPasswordEmail({ jwt, to }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: TECHTALES_EMAIL_ADDRESS,
      pass: TECHTALES_EMAIL_APP_PASSWORD,
    },
  });

  const content = `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
    <h2 style="color: #333333; text-align: center;">Reset your password</h2>
    <p style="color: #666666;">You requested to reset your password. Please click the following link to reset your password:</p>
    <a href="http://localhost:3000/reset-password/${jwt}" style="display: block; text-align: center; text-decoration: none; background-color: #007bff; color: #ffffff; padding: 10px 20px; border-radius: 5px; margin-top: 20px;">Reset Password</a>
    <p style="color: #666666; margin-top: 20px;">This link will expire after 1 hour.</p>
    <p style="color: #666666; margin-top: 20px;">If you did not request to reset your password, you can safely ignore this email.</p>
    <p style="color: #666666;">Thanks,<br> The techtales Team</p>
    </div>
    </body>`;

  try {
    const response = await transporter.sendMail({
      from: `Tech Tales ${TECHTALES_EMAIL_ADDRESS}`,
      to: to,
      subject: "Reset your password",
      html: content,
    });
  } catch (error) {
    return null;
  }
}

