import { createPortal } from "react-dom";

import { RxCross2 } from "react-icons/rx";
import classes from "./Notification.module.css";

const Notification = ({ message, onClose, type }) => {
  const notification_classes = `${classes.notification} ${
    type === "success" ? classes.success : classes.error
  }`;

  return createPortal(
    <div className={notification_classes}>
      <p className={classes.notification__msg}>{message}</p>
      <div className={classes.notification__cross} onClick={onClose}>
        <RxCross2 />
      </div>
    </div>,
    document.getElementById("notification")
  );
};

export default Notification;
