"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";

import classes from "./component.module.css";
import { NOTIFICATION_DURATION } from "@/constants/duration";
import Notification from "@/components/Notification/Notification";

const ResetPassword = ({ reset }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (!password || !confirmPassword) {
      setError("Password and confirm password are required");
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    setLoading(true);
    const response = await reset(password, confirmPassword);
    if (response.done) {
      return router.refresh();
    }
    setError(response.error);
    setLoading(false);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <Fragment>
      {error && (
        <Notification
          message={error}
          onClose={() => {
            setError("");
          }}
        />
      )}
      <h1 className={classes.title}>Reset password</h1>
      <form onSubmit={formSubmitHandler} className={`${classes.form}`}>
        <Input
          type="password"
          title="New password"
          placeholder="********"
          name="password"
        />
        <Input
          type="password"
          title="Confirm password"
          placeholder="********"
          name="confirmPassword"
          style={{ marginTop: "1.5em" }}
        />
        <Button
          type="submit"
          className={classes.resetBtn}
          onClick={() => setError("")}
        >
          Reset password
        </Button>
      </form>
    </Fragment>
  );
};

export default ResetPassword;
