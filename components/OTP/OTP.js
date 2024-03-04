"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import classes from "./OTP.module.css";
import Input from "@/components/UI/Input";
import otpImage from "@/public/images/verify-otp.png";
import Button from "@/components/UI/Button";
import useCountdown from "@/hooks/useCountdown";
import { revalidatePath } from "next/cache";

const INITIAL_OTP = new Array(6).fill("");

const OTP = ({ email, resendOtp }) => {
  const router = useRouter();
  const inputRef = useRef([]);
  const [error, setError] = useState("");
  // value of each input field
  const [otp, setOtp] = useState(INITIAL_OTP);
  // show loading spinner/text while submitting otp
  const [submitting, setSubmitting] = useState(false);
  // show loading spinner/text while resending otp
  const [sendingOtp, setSendingOtp] = useState(false);
  const { countdown, isActive, startCountdown, resetCountdown } =
    useCountdown(1);

  useEffect(() => {
    inputRef.current[0].focus();
  }, []);

  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      submitOtp(otpString);
    }
  }, [otp]);

  const submitOtp = async (otpString) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpString, email }),
      });
      if (response.status === 422) {
        router.replace("/signup");
      } else if (response.status === 401) {
        throw new Error("Incorrect OTP");
      } else if (response.status === 410) {
        throw new Error("OTP expired, Resend it");
      } else if (!response.ok) {
        throw new Error("Server Error");
      }
      // if response is ok, redirect to home page
      // cookies are already set in verify api route
      revalidatePath("/");
      router.push("/");
    } catch (error) {
      setSubmitting(false);
      setOtp(INITIAL_OTP);
      setError(error.message || "Server Error");
    }
  };

  const inputChangeHandler = (val = "", index) => {
    if (isNaN(val)) {
      return;
    }
    setOtp((prevOtp) => {
      const newOtp = [...prevOtp];
      newOtp[index] = val.slice(-1);
      return newOtp;
    });
    if (val && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }
  };

  const inputClickHandler = (e, index) => {

    if (index > 0 && !otp[index - 1]) {
      inputRef.current[otp.indexOf("")].focus();
    }
  };

  const keyDownHandler = (e, index) => {
    if (e.key === "ArrowRight" && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }

    if (e.key === "ArrowLeft" && inputRef.current[index - 1]) {
      e.preventDefault();
      inputRef.current[index - 1].focus();
    }

    if (e.key === "Backspace" && !otp[index] && inputRef.current[index - 1]) {
      inputRef.current[index - 1].focus();
    }
  };

  // handle countdown
  let showCountdown = isActive;
  if (countdown === "00:00") {
    resetCountdown();
    showCountdown = false;
  }
  // handle resend otp click
  const handleResendOtp = async () => {
    if (!showCountdown) {
      setSendingOtp(true);
      const status = await resendOtp();
      setSendingOtp(false);
      if (status) {
        startCountdown();
      }
    }
  };

  return (
    <Fragment>
      <div className={classes.imgWrapper}>
        <Image
          src={otpImage}
          alt="otp verification"
          width={200}
          height={150}
          priority={false}
        />
      </div>
      <h1 className={classes.title}>
        {submitting ? "Verifying Otp" : "OTP Verification"}
      </h1>
      {submitting ? (
        <h1 className={classes.loadingText}>Loading...</h1>
      ) : (
        <>
          <p className={classes.text}>Enter otp code sent to {email}</p>
          {error && (
            <p className={`${classes.text} ${classes.error}`}>{error}</p>
          )}
          <div className={classes.inputWrapper}>
            {otp.map((val, index) => (
              <Input
                key={index}
                type="number"
                className={classes.input}
                value={val}
                onClick={(e) => inputClickHandler(e, index)}
                onKeyDown={(e) => keyDownHandler(e, index)}
                onChange={(e) => inputChangeHandler(e.target.value, index)}
                ref={(ref) => (inputRef.current[index] = ref)}
              />
            ))}
          </div>
          <p className={classes.text}>Didn't receive OTP code?</p>

          {sendingOtp ? (
            <Button variant="text" className={classes.btn}>
              Sending OTP...
            </Button>
          ) : (
            <Button
              variant="text"
              className={classes.btn}
              onClick={handleResendOtp}
            >
              {showCountdown
                ? `OTP sent, Resend in ${countdown}`
                : "Resend Code"}
            </Button>
          )}
        </>
      )}
    </Fragment>
  );
};

export default OTP;
