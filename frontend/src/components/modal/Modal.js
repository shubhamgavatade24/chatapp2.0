import { useEffect, useState } from "react";
import classes from "./Modal.module.css";

const Modal = (props) => {
  const [width, setWidth] = useState(window.innerWidth);
  const leftpos = {};
  if (width > 768) {
    leftpos.left = "25%";
  } else {
    leftpos.left = "" + (width - 370) / 2 + "px";
  }

  return (
    <>
      <div
        className={classes.backdrop}
        style={{ display: props.show ? "block" : "none" }}
        onClick={() => props.closingFunction(false)}
      ></div>

      <div
        className={classes.modal}
        style={{ display: props.show ? "block" : "none", ...leftpos }}
      >
        {props.children}
      </div>
    </>
  );
};

export default Modal;
