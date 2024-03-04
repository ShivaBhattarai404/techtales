import { getCollection } from "@/utils/database";
import ForgotPassword from "../forgot-password/component";
import { redirect } from "next/navigation";
import { resendOtp } from "@/utils/auth";

export const metadata = {
  title: "Request to Verify",
  description: "Request to verify your email",
};

async function continueToVerifyEmail(email) {
  "use server";
  if (!email) {
    return { succeeded: false, message: "Email is required" };
  }

  // check if email exists in database
  const [Users, connection] = await getCollection("Unverified_Users");
  const user = await Users.findOne({ email });
  connection.close();

  if (!user) {
    // if email does not exist in database return error
    return { succeeded: false, message: "Email does not exist" };
  }

  const resendOTPSucceded = await resendOtp(email);
  if (!resendOTPSucceded) {
    return {
      succeeded: false,
      message: "Failed to send OTP. Try after a minute",
    };
  }
  return { succeeded: true };
}

const page = () => {
  const title = "VERIFY YOUR EMAIL";
  const description = {
    default:
      "Enter the email associated to your account and we'll send you an OTP and a verifcation link to your email",
    emailSent:
      "An OTP and a verification link has been sent to your email follow that link to reset your email",
  };
  return (
    <section style={{margin: "10em auto"}}>
      <ForgotPassword
        title={title}
        description={description}
        onContinue={continueToVerifyEmail}
        href={true}
        btnText={"Verify OTP"}
      />
    </section>
  );
};

export default page;
