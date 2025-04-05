const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const registerRoute = require("./routes/Register.js");
const loginRoute = require("./routes/Login.js");
const electoralRegisterRoute = require("./routes/ElectoralRegister.js");
const courtsRoute = require("./routes/Courts.js");
const casesRoute = require("./routes/Cases.js");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/register",registerRoute);
app.use("/api/login",loginRoute);
app.use("/api/electoralregister",electoralRegisterRoute);
app.use("/api/courts",courtsRoute);
app.use("/api/cases",casesRoute);

const dbconnection = async () => {
    try {
      await mongoose.connect(process.env.DB_ConnectionString, {
       
      });
  
      console.log("DB Connected");
    } catch (err) {
      console.error("DB connection error:", err);
    }
  };
  dbconnection();

app.get("/",(req,res)=>{
    res.send("Server Running    ");

});
const Port = (process.env.PORT || 3000);
app.listen(Port);

module.exports = dbconnection;