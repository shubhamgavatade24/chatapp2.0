import axios from "axios";
import { useEffect, useState } from "react";
import { Form, InputGroup, Toast } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { useDispatch } from "react-redux";
import * as mainActions from "../store/actions/mainActions";
import Cookies from "js-cookie";

import { Navigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("asdf");
  const [password, setPassword] = useState("asdf");
  const [showPass, setShowPass] = useState(false);

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

  const loginHandler = async () => {
    const reqPayload = {
      email,
      password,
    };

    try {
      const { data } = await axios.post("/api/user/login", reqPayload);
      dispatch(mainActions.loginUser(data));
      Cookies.set("userInfo", JSON.stringify(data), { expires: 1 });
      if (!window.localStorage.getItem("recent" + data._id)) {
        window.localStorage.setItem("recent" + data._id, JSON.stringify([]));
      }
      navigate("/chats");
    } catch {
      setErrMsg("credentials doesnt exist");
      errorShow(true);
    }
  };

  return (
    <div className={classes.LoginPage}>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="name@example.com" />
        </Form.Group> */}
        <Form.Label>Password</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type={showPass ? "text" : "password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
          />
          <Button variant="outline-secondary" onClick={changePassState}>
            {showPass ? "Hide" : "Show"}
          </Button>
        </InputGroup>
        <Button variant="primary" onClick={loginHandler} id="loginButton">
          Login
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
    </div>
  );
};

export default Login;
