import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Login from "./component/Login";
import NotFoundPage from "./component/NotFound";
import Register from "./component/Register";
import PrivateRoute from "./Routing/PrivateRoute";
import Post from "./component/Post";
import HomePage from "./component/HomePage";
import { ToastContainer, toast } from "react-toastify";
import FindPeople from "./component/FindPeople";
import Profile from "./component/Profile";
import EditProfile from "./component/EditProfile";
import Join from "./component/Join";

import { HashRouter } from "react-router-dom";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="/s" element={<HomePage />} />
                  <Route path="/user/:id" element={<Profile />} />
                  <Route path="/user/edit/:id" element={<EditProfile />} />
                  <Route path="/chat/join" element={<Join />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const Public = () => <div>public</div>;
const Private = () => <div>private</div>;

export default App;
