import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "./../auth/auth-help";
import { jwtDecode } from "jwt-decode";
import logo from "../images/IMG-20201113-WA0051.jpg"; // with import
import { read, searchuser } from "../api/api-post";
import { Box, TextField, Stack, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = searchResult.length !== 0 && open;
  const jwt = auth.isAuthenticated();
  const user1 = jwtDecode(jwt.token);
  const nav = useNavigate();
  const [values, setValues] = useState({});

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    searchuser(
      {
        userId: user1.id,
      },
      {
        t: jwt.token,
      },
      {
        search: search,
      }
    ).then((data) => {
      if (search !== "") setSearchResult(data);
      else setSearchResult([]);
    });
  }, [search]);

  useEffect(() => {
    read(
      { userId: user1.id },
      {
        t: jwt.token,
      }
    ).then((data) => {
      setValues({
        id: data._id,
        name: data.name,
        email: data.email,
        image: data.image,
        about: data.about,
        update: data.updated,
      });
    });
  }, []);

  return (
    <div>
      <nav className="py-2 position-fixed top-0 pr-4 start-0 w-100 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center w-100 bg-white">
          <a style={{ textDecoration: "none", color: "black" }}>
            <h1
              onClick={() => {
                nav("/");
              }}
              className="logo fs-3 fw-bold"
            >
              Ak
            </h1>
          </a>
          <div className="mr-5 position-relative d-flex">
            <Stack sx={{ width: 100 }}>
              <Autocomplete
                className="rounded"
                size="small"
                id="asynchronous-demo"
                sx={{ width: 200 }}
                options={searchResult}
                loading={loading}
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                onChange={(event, value) => nav("/user/" + value._id)} // Navigate to user
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props; // Extract key and rest
                  return (
                    <Box
                      component="li"
                      key={option._id} // Key should be set directly
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...restProps} // Spread other props
                    >
                      <img
                        className="rounded-circle me-3"
                        loading="lazy"
                        width="30"
                        height="30"
                        src={option.image}
                        alt=""
                      />
                      {option.name}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    className={"rounded bg-white"}
                    sx={{ p: "0px" }}
                    size="small"
                    onChange={(e) => setSearch(e.target.value)}
                    {...params}
                    placeholder="Search To Chat"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </Stack>
          </div>
          <div className="logo rounded-circle d-flex align-items-center">
            <i
              className="fa-solid fa-right-to-bracket fs-3 me-4"
              onClick={() => {
                localStorage.removeItem("userInfo1");
                nav("/");
              }}
            />
            <i
              className="fa fa-paper-plane me-4 fs-3"
              onClick={() => {
                nav("/chat/join");
              }}
            />
            <div
              onClick={() => {
                nav("/user/" + values.id);
              }}
            >
              <img
                src={values.image}
                alt="profile"
                width="40px"
                height="40px"
                className="rounded-circle"
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
