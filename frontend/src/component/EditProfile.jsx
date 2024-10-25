import React, { useState, useEffect } from "react";
import auth from "./../auth/auth-help";
import { jwtDecode } from "jwt-decode"; // Ensure correct jwtDecode import
import logo from "../images/IMG-20201113-WA0051.jpg"; // with import
import { read, update } from "../api/api-post";
import { toast } from "react-toastify";
import BarLoader from "react-spinners/BarLoader"; // Fixed incorrect import
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const EditProfile = () => {
  const nav = useNavigate();
  const params = useParams();

  const [picLoading1, setPicLoading1] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    image: "",
    about: "",
    password: "",
    update: "",
  });

  const jwt = auth.isAuthenticated();
  const user1 = jwtDecode(jwt.token);

  useEffect(() => {
    read({ userId: user1.id }, { t: jwt.token }).then((data) => {
      setValues({
        name: data.name || "",
        email: data.email || "",
        image: data.image || "",
        about: data.about || "",
        password: "",
        update: data.updated || "",
      });
    });
  }, [user1.id, jwt.token]); // Ensure proper dependencies

  const ImageHander = (pics) => {
    setPicLoading1(true);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwjy0lwss");
      fetch("https://api.cloudinary.com/v1_1/dwjy0lwss/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setValues({ ...values, image: data.url.toString() });
          setPicLoading1(false);
        })
        .catch(() => {
          toast.error("Something went wrong");
          setPicLoading1(false);
        });
    } else {
      toast.error("Invalid photo format");
      setPicLoading1(false);
    }
  };

  const clickSubmit = () => {
    update({ userId: params.id }, { t: jwt.token }, values).then((data) => {
      if (data) {
        toast.success("Profile updated successfully");
        nav("/user/" + user1.id);
      }
    });
  };

  return (
    <div>
      <NavBar />
      <div className="d-flex flex-column py-5 align-items-center mt-5">
        <div className="d-flex flex-column align-items-center flex-lg-row align-items-lg-start m-auto">
          <div className="position-relative">
            <img
              src={values.image || logo} // Fallback image
              alt="profile"
              className="rounded"
              style={{ width: 280 }}
            />
            <BarLoader loading={picLoading1} size={15} />
            <label htmlFor="file-input">
              <i className="fa-solid fa-camera fs-2 camera_icon" />
            </label>
            <input
              id="file-input"
              onChange={(e) => ImageHander(e.target.files[0])}
              accept="image/*"
              name="photo"
              type="file"
              className="d-none"
            />
          </div>
          <div style={{ width: 450 }} className="px-5 pt-4 pt-lg-0">
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">
                Name
              </label>
              <input
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                value={values.name} // Controlled input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Enter your name..."
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput2" className="form-label">
                About
              </label>
              <input
                value={values.about} // Controlled input
                onChange={(e) =>
                  setValues({ ...values, about: e.target.value })
                }
                type="text"
                className="form-control"
                id="formGroupExampleInput2"
                placeholder="Tell something about yourself..."
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput3" className="form-label">
                Email
              </label>
              <input
                value={values.email} // Controlled input
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                type="email"
                className="form-control"
                id="formGroupExampleInput3"
                placeholder="Enter your email..."
              />
            </div>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput4" className="form-label">
                Password
              </label>
              <input
                type="password"
                value={values.password} // Controlled input
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                className="form-control"
                id="formGroupExampleInput4"
                placeholder="Enter a new password..."
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => nav(-1)}
                type="button"
                className="btn btn-dark mt-2 px-4"
              >
                Back To Profile
              </button>
              <button
                onClick={clickSubmit}
                type="button"
                className="btn btn-primary ml-2 mt-2 px-4"
              >
                <i className="fa-solid fa-pen me-2" />
                Update
              </button>
            </div>
            <p className="mt-2 d-flex justify-content-center">
              Last update: {new Date(values.update).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
