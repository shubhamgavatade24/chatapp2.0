import classes from "./Modal.module.css";

const Modal = (props) => {
  return (
    <>
      <div
        className={classes.backdrop}
        style={{ display: props.show ? "block" : "none" }}
        onClick={() => props.closingFunction(false)}
      ></div>

      <div
        className={classes.modal}
        style={{ display: props.show ? "block" : "none" }}
      >
        {props.children}
      </div>
    </>
  );
};

export default Modal;
