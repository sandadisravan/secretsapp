require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const md5 = require("md5");
const app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email : String,
  password: String
});
// userSchema.plugin(encrypt, {secret: process.env.SECRET,encryptedFields:["password"] });
const User = new mongoose.model("User", userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    // updated password security to md5 hashing
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = md5(req.body.password);
  console.log(password);
  User.findOne({email: username},function(err,foundOne){
    if(err){
      console.log(err);
    }
    else{
      if(foundOne){
        if(foundOne.password === password){
          res.render("secrets")
        }
      }
    }
  });
});

app.listen(3000,function(){
  console.log("server started on port 3000.");
})
