import { Tab, Tabs } from "react-bootstrap";
import classes from "./Home.module.css";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Home = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.appTitle}>ChatEZ</h1>
      <Tabs defaultActiveKey="Login" id="Home-page" className="mb-3" fill>
        <Tab eventKey="Login" title="Login">
          <Login />
        </Tab>
        <Tab eventKey="Signup" title="Sign up">
          <Signup />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Home;
