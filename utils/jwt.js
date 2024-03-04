"use server";

import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function generateJwt(data, expiresIn) {
  const token = jwt.sign(data, SECRET, { expiresIn: expiresIn || "5m" });
  return token;
}

export async function decodeJwtToken(token) {
  try {
    return jwt.decode(token, SECRET);
  } catch (error) {
    return null;
  }
}

export async function verifyJwtToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}