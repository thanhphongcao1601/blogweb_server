//dotenv
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

//CORS
app.use(cors());

//BODY PARSER
app.use(express.json());

//MOUNT THE ROUTE
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

//HANDLE NOT FOUND ROUTE
app.all("*", (req, res, next) => {
  const err = new Error("The route can not be found");
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);

const PORT = process.env.APP_PORT;
const URI = process.env.DB_URI;
try {
  mongoose.connect(
    URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log("CONNECTED TO MONGODB");
      app.listen(PORT, () => {
        console.log("Server is running");
      });
    }
  );
} catch (error) {
  console.log(error);
  process.exit(1);
}
