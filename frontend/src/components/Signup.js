import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Toast } from "react-bootstrap";
import axios from "axios";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as mainActions from "../store/actions/mainActions";
import Cookies from "js-cookie";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setConfirmPass] = useState(false);

  const [error, errorShow] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (Cookies.get("userInfo") && JSON.parse(Cookies.get("userInfo"))?._id) {
      navigate("/chats");
    }
  }, []);

  const changePassState = () => {
    setShowPass((prevState) => {
      return !prevState;
    });
  };

  const changeConfirmPassState = () => {
    setConfirmPass((prevState) => {
      return !prevState;
    });
  };

  const signUpHandler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      errorShow(true);
      setErrMsg("please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      errorShow(true);
      setErrMsg("please recheck the passwords");
      return;
    }
    try {
      const reqPayload = { name, email, password };
      const { data } = await axios.post("/api/user", reqPayload);
      console.log(data);
      dispatch(mainActions.loginUser(data));
      Cookies.set("userInfo", JSON.stringify(data), { expires: 1 });
      if (!window.localStorage.getItem("recent" + data._id)) {
        window.localStorage.setItem("recent" + data._id, JSON.stringify([]));
      }
      navigate("/chats");
    } catch {
      errorShow(true);
      setErrMsg("something went wrong while creating new Account");
    }
  };

  return (
    <div className={classes.LoginPage}>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Form.Label>Password</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type={showPass ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button variant="outline-secondary" onClick={changePassState}>
            {showPass ? "Hide" : "Show"}
          </Button>
        </InputGroup>
        <Form.Label>Confirm Password</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type={showConfirmPass ? "text" : "password"}
            onChange={(e) => setconfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <Button variant="outline-secondary" onClick={changeConfirmPassState}>
            {showConfirmPass ? "Hide" : "Show"}
          </Button>
        </InputGroup>
        <Button variant="primary" onClick={signUpHandler} id="loginButton">
          Signup
        </Button>
      </Form>
      <Toast
        onClose={() => errorShow(false)}
        show={error}
        delay={3000}
        autohide
        className={classes.toaster}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Hello New User</strong>
        </Toast.Header>
        <Toast.Body>{errMsg}</Toast.Body>
      </Toast>
      ;
    </div>
  );
};

export default Signup;
