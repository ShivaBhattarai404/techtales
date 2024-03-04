import { Fragment } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import classes from "./loading.module.css";
import AllBlogsLoadingSkeleton from "@/components/Blog/loader";

const loading = () => {
  return (
    <Fragment>
      <h1
        style={{
          width: "fit-content",
          margin: "3em auto -3em",
          fontSize: "2.5em",
          color: "var(--color-primary)",
          wordSpacing: "10px",
        }}
      >
        Saved Blogs
      </h1>
      <AllBlogsLoadingSkeleton count={4} width={250} cardWrapperStyle={{ gap: "3em" }} />
    </Fragment>
  );
};

export default loading;
