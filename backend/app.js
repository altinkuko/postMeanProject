const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path  = require('path')
const app = express();
const postRoutes = require('./routes/posts')
const userRoutes = require("./routes/user")

mongoose.connect("mongodb+srv://admin:"+ process.env.MONGO_ATLAS_PW +"@cluster0.bl6re.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected")
  })
  .catch(() => {
    console.log("Connection Failed")
  });

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, PUT");
    next();
  }
);

app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "backend/images")));
app.use("/", express.static(path.join(__dirname, "angular")));
app.use(["/api/posts", "/api/post"], postRoutes);
app.use("/api/user", userRoutes);
app.use(((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
}))


module.exports = app;
