const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const signinRoute = require("./routes/api/signin.js");
require("dotenv/config");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api", signinRoute);

//Conntect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

mongoose.connection.on("connected", () => {
  console.log("CONNECTED TO MONGO_DB");
});

//Listener on PORT
app.listen(PORT);
