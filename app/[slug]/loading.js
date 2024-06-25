import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import classes from "./loading.module.css";

const loading = () => {
    
  const baseColor = "#bbb";
  const highlightColor = "#ddd";

  return (
    <section className={classes.section}>
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} >
        <h1 className={classes.title}><Skeleton  width={700} height={30} /></h1>
        <p className={classes.description}><Skeleton width={500} /></p>
        <p className={classes.description}><Skeleton width={400} /></p>
        <div className={classes.author}>
            <div className={classes.authorImage}><Skeleton width={45} height={45} circle /></div>
            <h3 className={classes.authorName}><Skeleton height={20} /> </h3>
            <p className={classes.publishDate}><Skeleton height={15} /></p>
        </div>
        <div className={classes.content}>
            <h1><Skeleton height={30} width={300} /></h1>
            <p><Skeleton count={4} /></p>
            <p><Skeleton width={500} /></p>
            <div className={classes.contentImage}><Skeleton height={500} borderRadius={20} /></div>
            {/* <h1><Skeleton height={30} width={300} /></h1> */}
            <p><Skeleton count={9} /></p>
            <p><Skeleton width={500} /></p>
            <br /><br />
            <p><Skeleton count={9} /></p>
            <p><Skeleton width={500} /></p>
        </div>
      </SkeletonTheme>
    </section>
  );
};

export default loading;
