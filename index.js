const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./Config/.env" });
// const multer = require("multer");
const cors = require("cors");
const DbConnect = require("./Config/DbConnection");
const adminRoute = require("./Routes/adminRout");
const userRoute = require("./Routes/userRout");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const port = process.env.port;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", adminRoute);
app.use("/api", userRoute);
DbConnect();

app.use(errorHandler);

app.listen(port, () => {
  console.log(`your app is listening port:${port}`);
});
