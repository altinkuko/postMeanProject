const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(
    hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(result => {
        res.status(200).json(result);
      }).catch(err => {
        res.status(500).json(err);
      });
    });
});

router.post("/login", (req, res, next) =>
  {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(
      user =>{
        if (!user){
          return res.status(401).json({
            message: "User not found"
          });
        }
        fetchedUser=user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result=>{
      if (!result){
        return res.status(401).json({message:"Password not valid"});
      }
      const token = jwt.sign({email:fetchedUser.email, userId: fetchedUser._id},
        "this_is_secret",
        {expiresIn: "1h"});
      res.status(200).json({token:token, expiresIn: 3600})
    }).catch(err=>{return res.status(401).json({message:"Auth failed"})});

  });


module.exports = router;
