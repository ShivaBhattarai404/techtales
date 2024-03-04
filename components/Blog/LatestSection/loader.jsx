import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import classes from "./loader.module.css";

const loader = (props) => {
  const baseColor = props.baseColor || "#d9d9d9";
  const highlightColor = props.highlightColor || "#f5f5f5";

  return (
    <section className={classes.section} id="latestBlogSection" >
      <h1>Latest Blog</h1>

      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} borderRadius={12} >
        <div className={classes.wrapper1}>
            <div className={classes.post1}><Skeleton width={300} height={450} /></div>
            <div className={classes.post2}><Skeleton width={500} height={125} /></div>
            <div className={classes.post3}><Skeleton width={500} height={125} /></div>
            <div className={classes.post4}><Skeleton width={500} height={125} /></div>
        </div>
        
        <div className={classes.wrapper2}>
            <div className={classes.post1}><Skeleton width={600} height={350} /></div>
            <div className={classes.post2}><Skeleton width={600} height={150} /></div>
            <div className={classes.post3}><Skeleton width={600} height={150} /></div>
            <div className={classes.post4}><Skeleton width={600} height={150} /></div>
        </div>

        <div className={classes.wrapper3}>
            <div className={classes.post2}><Skeleton width={300} height={400} /></div>
            <div className={classes.post3}><Skeleton width={300} height={400} /></div>
            <div className={classes.post4}><Skeleton width={300} height={400} /></div>
            <div className={classes.post1}><Skeleton width={300} height={400} /></div>
        </div>
      </SkeletonTheme>
    </section>
  );
};

export default loader;
