import { getDB } from "@/utils/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
  const email = body.email;
  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isEmailValid) {
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });
  }
  const [db, connection] = await getDB();
  const suscribersDoc = await db.collection("Suscribers");
  const existingEmail = await suscribersDoc.findOne({ email });
  if (existingEmail) {
    connection.close();
    return NextResponse.json(
      { message: "Email already suscribed" },
      { status: 403 }
    );
  }
  await suscribersDoc.insertOne({ email });
  connection.close();

  return NextResponse.json(
    { message: "Suscribed successfully" },
    { status: 201 }
  );
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
