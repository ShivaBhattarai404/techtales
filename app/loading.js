import { Fragment } from "react";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import Intro from "@/components/Intro/Intro";
import LatestBlogLoadingSkeleton from "@/components/Blog/LatestSection/loader";
import AllBlogsLoadingSkeleton from "@/components/Blog/loader";
import FaQLoadingSkeleton from "@/components/FAQ/loader";

const IntroSkeleton = () => {
  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          margin: "10em 0 0",
        }}
      >
        <div>
          <SkeletonTheme baseColor="#d9d9d9">
            <h1>
              <Skeleton
                style={{
                  width: "25em",
                  height: "1.5em",
                  margin: "1em 0 0.8em",
                }}
              />
            </h1>
            <p>
              <Skeleton
                count={2}
                style={{
                  height: "1em",
                  width: "60em",
                  margin: "0.5em 0 0",
                }}
              />
              <Skeleton
                style={{
                  width: "20em",
                  height: "1em",
                  margin: "0.5em 0 0",
                }}
              />
            </p>
            <div>
              <Skeleton
                style={{
                  width: "10em",
                  height: "3em",
                  margin: "2em 0",
                  borderRadius: "0.5em",
                }}
              />
            </div>
          </SkeletonTheme>
        </div>
        <SkeletonTheme baseColor="#d9d9d9">
          <Skeleton height={400} width={400} circle />
        </SkeletonTheme>
      </div>
    </Fragment>
  );
};

const Loading = () => {
  return (
    <Fragment>
      <Intro />
      {/* <IntroSkeleton /> */}
      <LatestBlogLoadingSkeleton />
      <AllBlogsLoadingSkeleton showAllBlogsText={true} />
      <FaQLoadingSkeleton />
    </Fragment>
  );
};

export default Loading;
