const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log("mongo db connected");
  })
  .catch((error) => {
    console.log(error);
  });
