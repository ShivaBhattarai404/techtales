"use client";
import Image from "next/image";
import { Fragment } from "react";

import classes from "./component.module.css";
import emailVerficationImage from "@/public/images/verify-email.png";
import Button from "@/components/UI/Button";
import { useRouter } from "next/navigation";

const EmailVerifyPage = ({ title, description, btnText, image, href, cb }) => {
  const router = useRouter();
  const imageSrc = image || emailVerficationImage;

  const btnClickHandler = async () => {
    await cb?.();
    router.replace(href || "/");
  }

  return (
    <Fragment>
      <div className={classes.imgWrapper}>
        <Image
          src={imageSrc}
          alt="verify email"
          width={100}
          height={100}
          priority={false}
        />
      </div>
      <h1 className={classes.title}>{title}</h1>
      <p className={classes.description}>{description}</p>
      {btnText && (
        <Button className={classes.cta__btn} onClick={btnClickHandler} >
          {btnText}
        </Button>
      )}
    </Fragment>
  );
};

export default EmailVerifyPage;
