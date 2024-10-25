import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { Link } from "react-router-dom";

const Register = ({ history }) => {
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#000000");

  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo1")) {
      nav("/s");
    }
  }, [history]);
  const [data, setData] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  }

  async function handleClick(event) {
    //console.log(data);
    event.preventDefault();
    setLoading(true);

    const newDate = data;
    if (!data.name || !data.password || !data.email || !data.password2) {
      toast.warning("Please Fill all the Feilds");
      setLoading(false);
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      "http://localhost:4000/api/users/register",
      requestOptions
    );
    const Data = await response.json();

    if (!Data.error) {
      toast.success("Successful Register");
      setLoading(false);
      nav("/login");
    } else {
      toast.warning(Data.error);
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5">
      <h1>Register</h1>
      <PulseLoader color={color} loading={loading} size={15} />
      <div className="row">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    onChange={handleChange}
                    type="name"
                    className="form-control"
                    name="name"
                  />
                </div>
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
                </div>
                <div className="form-group">
                  <label htmlFor="password">Confirm PassWord</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    className="form-control"
                    name="password2"
                  />
                  <p>
                    <Link to="/login">Have an acount Login</Link>
                  </p>
                </div>
                <button onClick={handleClick} className="btn btn-dark">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
