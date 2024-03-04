import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import componentClasses from "./FaQ.module.css";

import Button from "../UI/Button";

const FaQ = async (props) => {
  const baseColor = props.baseColor || "#d9d9d9";
  const highlightColor = props.highlightColor || "#f5f5f5";

  return (
    <section className={componentClasses.section}>
      <h1 className={componentClasses.title}>Frequently Asked Questions</h1>
      <p className={componentClasses.description}>
        Find quick answers to common questions about our blog, including
        content, navigation, subscriptions, and more in our comprehensive FAQs
        section.
      </p>
      <div className={componentClasses.faq_wrapper}>
        <SkeletonTheme
          baseColor={baseColor}
          highlightColor={highlightColor}
          borderRadius={12}
        >
          {new Array(5).fill(0).map((_, key) => (
            <Skeleton key={key} height={45} style={{ marginBottom: "1em" }} />
          ))}
        </SkeletonTheme>
      </div>

      <div className={componentClasses.moreQs}>
        <h1>Still have questions?</h1>
        <p>Loem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <Button href="/contact">Contact Us</Button>
      </div>
    </section>
  );
};

export default FaQ;
