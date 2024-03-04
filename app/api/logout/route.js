import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const storedCookies = cookies();
  storedCookies.delete("token");
  storedCookies.delete("login");
  return NextResponse.json({ message: "Logged out successfully" });
}
