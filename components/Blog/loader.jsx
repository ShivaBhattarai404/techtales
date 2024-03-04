import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import classes from "./loader.module.css";

const loader = (props) => {
  const baseColor = props.baseColor || "#d9d9d9";
  const highlightColor = props.highlightColor || "#f5f5f5";

  return (
    <section className={classes.blogSection} style={{ ...props.style }}>
      {props.showAllBlogsText && <h1>All Blogs</h1>}
      <div className={classes.wrapper} style={{ ...props.cardWrapperStyle }}>
        <SkeletonTheme
          baseColor={baseColor}
          borderRadius={12}
          highlightColor={highlightColor}
        >
          {new Array(props.count || 8).fill(0).map((_, index) => (
            <div className={classes.blog} key={index}>
              <Skeleton
                width={props.width || 280}
                height={props.height || 350}
              />
            </div>
          ))}
        </SkeletonTheme>
      </div>
    </section>
  );
};

export default loader;
