import classes from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.spinner} />
    </div>
  );
};

export default Spinner;
