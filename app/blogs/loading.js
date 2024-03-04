import { Fragment } from "react";
import AllBlogsLoadingSkeleton from "@/components/Blog/loader";
import Suscribe from "@/components/UI/Suscribe";
import FilterBox from "@/components/Filter/FilterBox";

const loading = () => {
  return (
    <Fragment>
      <h1
        style={{
          width: "fit-content",
          margin: "3em auto 2em",
          fontSize: "2.5em",
          color: "var(--color-primary)",
          wordSpacing: "10px",
        }}
      >
        All Blogs
      </h1>
      <Suscribe
        title="Clear"
        placeholder="Search..."
        style={{ margin: "auto" }}
        btnStyle={{
          width: "8em",
          height: "2.5em",
          fontSize: "1.2em",
          padding: "0.5em",
        }}
      />

      <FilterBox style={{ marginLeft: "5%" }} />
      <AllBlogsLoadingSkeleton width={300} cardWrapperStyle={{ gap: "3em" }} />
    </Fragment>
  );
};

export default loading;
