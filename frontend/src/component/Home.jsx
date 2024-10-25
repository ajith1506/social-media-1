import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo1")) {
      nav("/s");
    }
  }, [nav]); // Use 'nav' in the dependency array

  return (
    <div>
      <div className="jumbotron centered align-items-center">
        <div className="container">
          <h1 className="display-3 mt-3 mb-3">Piqosocial</h1>
          <a
            className="btn btn-light btn-lg mr-2"
            href="/register"
            role="button"
          >
            Register
          </a>
          <a className="btn btn-dark btn-lg" href="/login" role="button">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
