import React from "react";
import classes from "./FaQ.module.css";
import FaQItem from "./FaQItem";
import Button from "../UI/Button";
import { getCollection } from "@/utils/database";

// function to fetch FAQs from the database
async function fetchFAQs() {
  "use server";
  const [FAQs, connection] = await getCollection("FAQs");
  const faqs = await FAQs.find().toArray();
  connection.close();
  return faqs;
}

const FaQ = async () => {
  const FAQs = await fetchFAQs();

  return (
    <section className={classes.section}>
      <h1 className={classes.title}>Frequently Asked Questions</h1>
      <p className={classes.description}>
        Find quick answers to common questions about our blog, including
        content, navigation, subscriptions, and more in our comprehensive FAQs
        section.
      </p>
      <div className={classes.faq_wrapper}>
        {FAQs &&
          FAQs.map((faq) => (
            <FaQItem
              key={faq._id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
      </div>

      <div className={classes.moreQs}>
        <h1>Still have questions?</h1>
        <p>
          If you have any more questions or need further assistance, we're here
          to help. Don't hesitate to reach out to us for any additional
          information or support.
        </p>
        <Button href="/contact">Contact Us</Button>
      </div>
    </section>
  );
};

export default FaQ;
