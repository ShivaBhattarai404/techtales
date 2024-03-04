"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import Input from "@/components/UI/Input";
import EmailVerifyPage from "../verify/[token]/component";
import classes from "./page.module.css";
import Button from "@/components/UI/Button";
import forgotPasswordImage from "@/public/images/forgot-password.png";
import Notification from "@/components/Notification/Notification";
import { NOTIFICATION_DURATION } from "@/constants/duration";

const ForgotPassword = ({ title, description, onContinue, href, continueBtnText }) => {
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [email, setEmail] = useState("");

  // dismiss error after few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, NOTIFICATION_DURATION);

    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    setError("");
    setShowLoader(true);

    // if email is empty, set error
    if (!email) {
      setShowLoader(false);
      return setError("Email is required");
    }
    const response = await onContinue(email);

    setShowLoader(false);
    // if response doesnot succeed, set error
    if (!response.succeeded) {
      return setError(response.message);
    }
    setEmailSent(true);
  };

  const desc = emailSent ? description.emailSent : description.default;
  return (
    <Fragment>
      {error && <Notification message={error} onClose={() => setError("")} />}
      <EmailVerifyPage
        title={title}
        image={forgotPasswordImage}
        description={desc}
      />
      {showLoader && <div className={classes.loader}>Loading...</div>}

      {emailSent && href && (
        <Button
          className={classes.continueBtn}
          type="submit"
          href={`/verify?email=${email}`}
        >
          {continueBtnText || "Continue"}
        </Button>
      )}

      {!emailSent && !showLoader && (
        <form onSubmit={formSubmitHandler} noValidate>
          <Input
            className={classes.emailInput}
            value={email}
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className={classes.continueBtn} type="submit">
            Continue
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
