"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import ReCAPTCHA from "react-google-recaptcha";

import Input from "../UI/Input";
import classes from "./ContactForm.module.css";
import Card from "../UI/Card";
import Button from "../UI/Button";
import image from "@/public/images/contact-us-background.jpg";
import { NOTIFICATION_DURATION } from "@/constants/duration";
import Notification from "../Notification/Notification";
import { EMAIL_REGEX } from "@/constants/validation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ContactCard = ({ img, title, content }) => {
  return (
    <Card className={classes.contactCard}>
      <div className={classes.contactCard__imageWrapper}>
        <img src={img} alt={title} />
      </div>
      <span className={classes.contactCard__title}>{title}</span>
      <span className={classes["contactCard__content--1"]}>{content[0]}</span>
      <span className={classes["contactCard__content--2"]}>{content[1]}</span>
    </Card>
  );
};

const ContactForm = () => {
  const [captcha, setCaptcha] = useState(false);
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert("");
    }, NOTIFICATION_DURATION);
    return () => {
      clearTimeout(timer);
    };
  }, [alert]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // extract all the values from the form
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    // check if the form is loading
    if (loading) return;

    // check if the form is empty
    if (!name || !email || !message) {
      // window.grecaptcha.reset();
      return setAlert("Please fill in all fields.");
    }

    // check if the email is valid
    if (!email.match(EMAIL_REGEX)) {
      // window.grecaptcha.reset();
      return setAlert("Invalid email.");
    }

    // check if the captcha is ticked
    if (!captcha) {
      // window.grecaptcha.reset();
      return setAlert("Please tick the captcha.");
    }
    try {
      // set the form to loading
      setLoading(true);
      // send the form data to the server
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          captcha,
        }),
      });

      // reset the form to normal
      window.grecaptcha.reset();
      setLoading(false);
      setCaptcha(null);

      // check if the response is not ok
      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      const data = await response.json();
      // check if the response is not successful
      if (!data.success) {
        throw new Error(data.message);
      }
      e.target.reset();
      setAlert({ type: "success", message: "Message sent successfully." });
    } catch (error) {
      setLoading(false);
      setAlert(error.message || "Failed to send message.");
    }
  };

  return (
    <section className={classes.section}>
      {alert && (
        <Notification
          type={alert.type || "error"}
          message={alert.message || alert}
          onClose={setAlert.bind(null, false)}
        />
      )}

      <div className={classes.header}>
        <h1>Contact Us</h1>
        <p>
          Have a question, suggestion, or just want to say hello? We'd love to
          hear from you! Feel free to reach out to us using the contact form
          below or connect with us through email or social media. Our team is
          here to assist you with any inquiries you may have. We value your
          feedback and strive to provide the best experience for our readers.
        </p>
      </div>
      <div className={classes.body}>
        <div className={classes.leftCard}>
          <Image
            src={image}
            alt="Contact Us"
            width={500}
            height={500}
            className={classes.bg}
          />
          <h2>Welcome to our community</h2>
          <p>
            Clarity gives you the blocks & components you need to create a truly
            professional website.
          </p>
          <ContactCard
            img="https://assets.website-files.com/63b78919476f228ce0b0bdf6/63c3cd23fd09f3f9390b485c_Logo.webp"
            title="Our email"
            content={["techtales48@gmail.com"]}
          />
        </div>
        <form className={classes.form} onSubmit={submitHandler}>
          <h1>Let's talk?</h1>
          <p>
            Loem ipsum dolor sit amet consectetur adipiscing elit interdorm
            ullamcorper sed pharetra senectus donec nunc ame
          </p>
          <Input
            type="text"
            title="Name"
            name="name"
            placeholder="Enter your name"
          />
          <Input
            type="text"
            title="Email"
            name="email"
            placeholder="youemail@gmail.com"
          />
          <Input
            type="textarea"
            title="Message"
            name="message"
            placeholder="Type your message..."
          />
          <ReCAPTCHA
            onChange={setCaptcha}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY}
          />
          <Button
            type={loading ? "button" : "submit"}
            className={classes.submitBtn}
            onClick={() => setAlert("")}
            style={{ width: "80%", maxWidth: "14em", fontSize: "1.2em" }}
          >
            {loading && <AiOutlineLoading3Quarters />}
            <span>Send Message</span>
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
