import { NextRequest, NextResponse } from "next/server";

import { EMAIL_REGEX } from "@/constants/validation";
import { getCollection } from "@/utils/database";

export async function POST(request) {
  const req = new NextRequest(request);
  
  try {
    const body = await req.json();
    const name = body.name;
    const email = body.email;
    const message = body.message;
    const captcha = body.captcha;

    if (!name || !email || !message || !captcha) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    if (!email.match(EMAIL_REGEX)) {
      return NextResponse.json({ success: false, message: "Invalid email" });
    }

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRECT_KEY}&response=${captcha}`,
      {
        method: "POST",
      }
    );
    const resData = await response.json();
    if (!resData.success) {
      return NextResponse.json({
        success: false,
        message: "Verify captcha correctly again",
      });
    }

    const data = {
      name,
      email,
      message,
      date: new Date().toISOString(),
    };
    // const [messageDoc, connection] = await getCollection("Messages");
    // await messageDoc.insertOne(data);
    // connection.close();

    return NextResponse.json({ success: true, message: "Success" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed" },
      { status: 400 }
    );
  }
}
