import React, { useEffect, useState } from "react";
import {
  read,
  unfollow,
  follow,
  checkFollow,
  getFeedUser,
} from "../api/api-post";
import Posts from "./Posts";
import auth from "./../auth/auth-help";
import { jwtDecode } from "jwt-decode"; // Ensure correct jwtDecode import
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import NavBar from "./NavBar";
import "./profile.css";
import logo from "../images/IMG-20201113-WA0051.jpg"; // with import

const Profile = () => {
  const params = useParams();
  const nav = useNavigate();
  const [value, SetValues] = useState({
    user: { following: [], followers: [] },
    following: false,
  });
  const [posts, setPosts] = useState([]);
  const jwt = auth.isAuthenticated();
  const user1 = jwtDecode(jwt.token);

  useEffect(() => {
    read({ userId: params.id }, { t: jwt.token }).then((res) => {
      if (res.name) {
        let following = checkFollow(res, user1.id);
        SetValues({ ...value, user: res, following: following });
        loadPost(res._id);
      }
    });
  }, [params.id]); // Fixed dependency to params.id
  const loadPost = (user) => {
    getFeedUser({ userId: user }, { t: jwt.token }).then((data) =>
      setPosts(data)
    );
  };

  const clickfollow = () => {
    let callApi = value.following ? unfollow : follow;
    callApi({ userId: user1.id }, { t: jwt.token }, value.user._id).then(
      (data) => {
        if (data) {
          if (!value.following) toast.success(`Following ${value.user.name}!`);
          else toast.warn(`Unfollowing ${value.user.name}!`);
          SetValues({ ...value, following: !value.following });
        }
      }
    );
  };

  return (
    <div>
      <NavBar />
      <section className="container mt-3 py-5 rounded px-5">
        <div className="d-flex mb-5 mt-4 ms-lg-5 ps-lg-5 ms-0 ps-0">
          <div className="me-md-5 me-3 ms-lg-5 ms-0">
            <img
              src={value.user.image || logo} // Use a fallback image if no image
              alt="profile"
              className="rounded-circle profile_img border border-light border-3"
            />
          </div>

          <div className="w-50">
            <h3 className="mt-3 mb-4">{value.user.name}</h3>
            <div className="d-flex mb-3 mt-2">
              <div className="d-flex me-4">
                <p className="me-1">{posts.length}</p>
                <p>posts</p>
              </div>

              <div className="d-flex me-4">
                <p className="me-1">{value.user.followers.length}</p>
                <p>followers</p>
              </div>

              <div className="d-flex me-4">
                <p className="me-1">{value.user.following.length}</p>
                <p>following</p>
              </div>
            </div>
            {user1.id === params.id ? (
              <button
                onClick={() => nav("/user/edit/" + user1.id)}
                type="button"
                className="btn btn-dark"
              >
                <i className="fa-solid fa-pen me-2" />
                Edit profile
              </button>
            ) : null}
            {user1.id !== params.id ? (
              value.following === false ? (
                <button
                  onClick={clickfollow}
                  type="button"
                  className="ml-2 btn btn-success me-3"
                >
                  <i className="fa-solid fa-user-plus me-2"></i>
                  Follow
                </button>
              ) : (
                <button
                  onClick={clickfollow}
                  type="button"
                  className="ml-2 btn btn-danger me-3"
                >
                  <i className="fa-solid fa-user-plus me-2"></i>
                  Unfollow
                </button>
              )
            ) : null}
          </div>
        </div>

        {/* profile & cover img */}
        <section>
          <ul
            className="nav nav-pills mt-5 mt-lg-0 ms-lg-5 ms-0"
            id="pills-tab"
            role="tablist"
          >
            <li
              className="nav-item ms-xl-5 ms-0 ps-lg-4 ps-0"
              role="presentation"
            >
              <button
                className="nav-link active ms-4"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Posts
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Followers
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-contact-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                aria-selected="false"
              >
                Following
              </button>
            </li>
          </ul>

          <div className="tab-content p-4" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabIndex={0} // Fixed the tabIndex issue
            >
              <div className="left col-lg-9 col-sm-12 border_radius mt-4 m-auto">
                {posts.map((post, index) => (
                  <Posts key={post._id || index} post={post} />
                ))}
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex={0} // Fixed the tabIndex issue
            >
              <section className="d-flex justify-content-around mt-4">
                <div className="d-flex flex-column col-5">
                  {value.user.followers.map((pers) => (
                    <div
                      key={pers._id} // Added unique key
                      onClick={() =>
                        (window.location.href = "/user/" + pers._id)
                      }
                      className="d-flex align-items-center p-2 mb-3 rounded p-3 hover"
                    >
                      <div>
                        <img
                          src={pers.image}
                          alt="profile"
                          style={{ width: 50, height: 50 }}
                          className="me-3 rounded"
                        />
                      </div>
                      <h6 className="fw-bold">{pers.name}</h6>
                      <i className="fa-solid fa-ellipsis ms-auto fs-4" />
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div
              className="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
              tabIndex={0} // Fixed the tabIndex issue
            >
              <section className="d-flex justify-content-around mt-4">
                <div className="d-flex flex-column col-5">
                  {value.user.following.map((pers) => (
                    <div
                      key={pers._id} // Added unique key
                      onClick={() =>
                        (window.location.href = "/user/" + pers._id)
                      }
                      className="d-flex align-items-center p-2 mb-3 rounded p-3 hover"
                    >
                      <div>
                        <img
                          src={pers.image}
                          alt="profile"
                          style={{ width: 50, height: 50 }}
                          className="me-3 rounded"
                        />
                      </div>
                      <h6 className="fw-bold">{pers.name}</h6>
                      <i className="fa-solid fa-ellipsis ms-auto fs-4" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Profile;
