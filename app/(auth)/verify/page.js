import { getCollection } from "@/utils/database";
import OTP from "@/components/OTP/OTP";
import { notFound } from "next/navigation";
import { EMAIL_REGEX } from "@/constants/validation";
import { resendOtp } from "@/utils/auth";

async function checkUser(email) {
  "use server";
  if (!email || !email.match(EMAIL_REGEX)) {
    return notFound();
  }
  const [Users, connection] = await getCollection("Unverified_Users");
  const user = await Users.findOne({ email });
  if (!user) {
    return notFound();
  }
  connection.close();
  return user;
}

const page = async ({ searchParams }) => {
  const email = searchParams.email;

  await checkUser(email);

  return <OTP email={email} resendOtp={resendOtp.bind(null, email)} />;
};

export default page;
