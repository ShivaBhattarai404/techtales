"use client";
import React, { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import classes from "./SignUp.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import manWithaLaptop from "@/public/images/office-man-with-a-laptop.png";

import {
  SignupFormReducer,
  initialSignupState,
  isFormValid,
} from "@/helpers/signup";
import Spinner from "../Spinner/Spinner";

const SignUp = () => {
  // HOOKS STARTS HERE
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [credientials, dispatch] = useReducer(
    SignupFormReducer,
    initialSignupState
  );
  // HOOKS ENDS HERE

  // useEffect hook to check whether email exits by debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (credientials.email.touched && !credientials.email.invalidtext) {
        // send request to backend to check for availability of email
        const response = await fetch(
          `/api/check?email=${credientials.email.value}`
        );

        if (response.status === 409) {
          dispatch({ type: "SET_EMAIL_EXISTANCE", payload: true });
        } else if (response.status === 200) {
          dispatch({ type: "SET_EMAIL_EXISTANCE", payload: false });
        } else if (!response.ok) {
          throw new Error("Error while fetching existance of email");
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [credientials.email, dispatch]);

  // useEffect hook to check whether username exits by debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (credientials.username.touched && !credientials.username.invalidtext) {
        // send request to backend to check for availability of username
        const response = await fetch(
          `/api/check?username=${credientials.username.value}`
        );

        if (response.status === 409) {
          dispatch({ type: "SET_USERNAME_EXISTANCE", payload: true });
        } else if (response.status === 200) {
          dispatch({ type: "SET_USERNAME_EXISTANCE", payload: false });
        } else if (!response.ok) {
          console.error("Error while fetching existance of username");
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [credientials.username, dispatch]);

  // function to handle form submission/account creation
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isFormValid(credientials)) {
      // if the form is not valid do not submit
      return;
    }

    // set submitting to true while data is being proccessed at backend
    setSubmitting(true);

    const response = await fetch("/api/signup", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...credientials }),
    });

    const resData = await response.json();
    if (response.status === 422) {
      setSubmitting(false);
      return console.error("Invalid data");
    }
    if (response.status === 409) {
      setSubmitting(false);
      return console.error("account already exists");
    }
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    // if everything is correct then redirect to email verification
    const email = credientials.email.value;
    router.replace(`/verify?email=${email}`);
  };

  // show a submitting loader while data is being submitted to backend
  if (submitting) {
    return <Spinner />;
  }

  // decide which invalid username message to be shown
  let usernameinvalidtext = credientials.username.invalidtext;
  if (!usernameinvalidtext && credientials.usernameExistance) {
    usernameinvalidtext = "Username already Exists";
  }

  // decide which invalid email message to be shown
  let emailinvalidtext = credientials.email.invalidtext;
  if (!emailinvalidtext && credientials.emailExistance) {
    emailinvalidtext = "Email already Exists";
  }

  return (
    <div className={classes.container}>
      <Image
        className={classes.image}
        src={manWithaLaptop}
        alt="Office man with a laptop"
        width={400}
        height={700}
      />
      <div className={classes.formWrapper}>
        <h1>Join the TechTales community today</h1>
        <p>
          Join TechTales today for exclusive tech insights and community
          engagement! Register below to get started and unlock a world of tech
          news and discussions.
        </p>
        <form onSubmit={formSubmitHandler}>
          <Input
            title="Name"
            placeholder="Your Name"
            invalidtext={credientials.name.invalidtext}
            value={credientials.name.value}
            onChange={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
          />
          <Input
            title="Username"
            placeholder="username"
            style={{ marginTop: "2em" }}
            invalidtext={usernameinvalidtext}
            value={credientials.username.value}
            onChange={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
          />
          <Input
            title="Email"
            placeholder="example@gmail.com"
            type="email"
            style={{ marginTop: "2em" }}
            invalidtext={emailinvalidtext}
            value={credientials.email.value}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
          />
          <Input
            title="Password"
            placeholder="*********"
            type="password"
            style={{ marginTop: "2em" }}
            invalidtext={credientials.password.invalidtext}
            value={credientials.password.value}
            onChange={(e) => {
              dispatch({ type: "SET_PASSWORD", payload: e.target.value });
              dispatch({
                type: "SET_CONFIRMPASSWORD",
                payload: credientials.confirmPassword.value,
              });
            }}
            onBlur={(e) => {
              dispatch({ type: "SET_PASSWORD", payload: e.target.value });
              dispatch({
                type: "SET_CONFIRMPASSWORD",
                payload: credientials.confirmPassword.value,
              });
            }}
          />
          <Input
            title="Confirm Password"
            placeholder="*********"
            type="password"
            style={{ marginTop: "2em" }}
            invalidtext={credientials.confirmPassword.invalidtext}
            value={credientials.confirmPassword.value}
            onChange={(e) =>
              dispatch({ type: "SET_CONFIRMPASSWORD", payload: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "SET_CONFIRMPASSWORD", payload: e.target.value })
            }
          />
          {/* <div className={classes.agreement}>
            <input id="aggement_btn" type="checkbox" />
            <label htmlFor="aggement_btn">
              I had read and accept the Terms & Conditions and Privacy Policy.
            </label>
          </div> */}

          <Button className={classes.submitBtn}>Create Account</Button>
          <p className={classes.loginLink}>
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
