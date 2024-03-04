"use client";

import { useState } from "react";
import Suscribe from "../UI/Suscribe";
import classes from "./HeroHeader.module.css";

const HeroHeader = () => {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitHandler = async (email) => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      setError("Invalid email");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/suscribe", {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 400) {
        setError("Please enter a valid email");
      }
      if (res.status === 403) {
        setError("You are already suscribed");
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data.message);
      }
      if (res.status === 201) setSubmitted(true);
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <section className={classes.section}>
      <h4>Our Blog</h4>
      <h1>
        Updates <span>and</span> News
      </h1>
      <p>
        Suscribe to our new letter and receive all our blogs notification at
        first directly to your email
      </p>
      {error && <p className={classes.error}>{error}</p>}
      {submitted && (
        <div className={classes.success}>
          You have been suscribed successfully
        </div>
      )}
      {!submitted && (
        <Suscribe
          onSubmit={submitHandler}
          type="email"
          disabled={submitting}
          onChange={() => setError("")}
          title={submitting ? "please wait..." : "Suscribe"}
          btnStyle={{ width: "10em" }}
        />
      )}
    </section>
  );
};

export default HeroHeader;
