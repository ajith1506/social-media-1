import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

const Login = ({ history }) => {
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#000000");

  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo1")) {
      nav("/s");
    }
  }, [history]);

  const [data, setData] = useState({});
  const handleClick = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!data.email || !data.password) {
      toast.warning("Please Fill all the Feilds");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    try {
      const response = await fetch(
        "https://social-media-1-1.onrender.com/api/users/login",
        requestOptions
      );
      const Data = await response.json();

      if (Data.success) {
        localStorage.setItem("userInfo1", JSON.stringify(Data));
        toast.success("Successful Login");
        setLoading(false);
        nav("/s");
      } else {
        throw Data;
      }
    } catch (Data) {
      toast.warning(Data.errors);
      setLoading(false);
    }
  };
  function handleChange(event) {
    const { name, value } = event.target;

    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  }

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <PulseLoader color={color} loading={loading} size={15} />
      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <form action="/login" method="POST">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    className="form-control"
                    name="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    name="password"
                  />
                  <p>
                    <Link to="/register">Don't Have an acount Register</Link>
                  </p>
                </div>
                <button onClick={handleClick} className="btn btn-dark">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-4"></div>
      </div>
    </div>
  );
};
export default Login;
