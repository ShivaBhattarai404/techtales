import { getCollection } from "@/utils/database";
import ForgotPassword from "./component";
import { EMAIL_REGEX } from "@/constants/validation";
import { generateJwt } from "@/utils/jwt";
import { sendResetPasswordEmail } from "@/utils/email";

async function continueToResetPassword(email) {
  "use server";
  const isEmailValid = email.match(EMAIL_REGEX);

  if (!isEmailValid) {
    return { succeeded: false, message: "Invalid email" };
  }
  try {
    // check if email exists in database
    const [Users, connection] = await getCollection("Users");
    const user = await Users.findOne({ email });
    connection.close();

    if (!user) {
      // if email does not exist in database return error
      return { succeeded: false, message: "Email does not exist" };
    }
  } catch (error) {
    return { succeeded: false, message: "Something went wrong" };
  }

  try {
    // Send email with reset link
    const token = await generateJwt({ email }, "1h");

    // Code to send email goes here
    await sendResetPasswordEmail({ jwt: token, to: email });
  } catch (error) {
    return { succeeded: false, message: "Something went wrong" };
  }

  return { succeeded: true };
}

const page = () => {
  const title = "FORGOT YOUR PASSWORD?";
  const description = {
    default:
      "Enter the email associated to your account and we'll send you a link to reset your password",
    emailSent:
      "A reset link has been sent to your email follow that link to reset your email",
  };
  return (
    <ForgotPassword
      title={title}
      description={description}
      onContinue={continueToResetPassword}
    />
  );
};

export default page;
