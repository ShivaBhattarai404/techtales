"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import classes from "./SignUp.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Notificaion from "../Notification/Notification";
import { NOTIFICATION_DURATION } from "@/constants/duration";
import manWithaLaptop from "@/public/images/office-man-with-a-laptop.png";
import Spinner from "../Spinner/Spinner";

const Login = ({ login }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, NOTIFICATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    // set isSubmitting to true to show loading spinner
    setIsSubmitting(true);

    // get email and password from form
    const email = e.target.email.value;
    const password = e.target.password.value;
    const response = await login({ email, password });

    // if error occurs then set error and stop showing loading spinner
    if (response.error) {
      setIsSubmitting(false);
      setError((e) => response.error);
    }
    // if login is successful then redirect to dashboard
    if (response.login) {
      // redirect to dashboard
      router.push("/");
    }
  };

  if (isSubmitting) return <Spinner />;

  return (
    <div className={classes.container}>
      {error && <Notificaion message={error} onClose={() => setError("")} />}
      <Image
        className={classes.image}
        src={manWithaLaptop}
        alt="Office man with a laptop"
        width={400}
        height={700}
      />
      <div className={classes.formWrapper}>
        <h1>Welcome back 👋</h1>
        <p>
          Log in to your account to access exclusive content, personalize your
          experience, and engage with our community. Our login process is quick
          and easy. Simply enter your username or email and password below to
          gain access to all the latest tech insights, product reviews, and
          industry updates.
        </p>
        <form onSubmit={loginSubmitHandler}>
          <Input
            title="Email"
            placeholder="example@gmail.com"
            type="email"
            name="email"
          />
          <Input
            title="Password"
            placeholder="*********"
            type="password"
            style={{ marginTop: "2em" }}
            name="password"
          />
          {/* <div className={classes.agreement} style={{ width: "fit-content" }}>
            <input id="aggement_btn" type="checkbox" />
            <label htmlFor="aggement_btn">emember Me</label>
          </div> */}
          <Button
            className={classes.submitBtn}
            type={isSubmitting ? "button" : "submit"}
          >
            Login
          </Button>
          <p className={classes.loginLink}>
            <Link href="/forgot-password">forgot password?</Link>
          </p>
          <p className={classes.loginLink}>
            <Link href="/request-to-verify">Verify Email</Link>
          </p>
          <p className={classes.loginLink}>
            Don't have an account?{" "}
            <Link href="/signup">Create free account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
