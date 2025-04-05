const router = require('express').Router();
const mongoose = require('mongoose');
const ElectoralRegister = require('../models/ElectoralRegister.js');
const jwt = require('jsonwebtoken');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers.js');
require('dotenv').config();


router.post('/', async (req, res) => {
    const username = req.body.UserName; 
    const password = req.body.Password;

    const user = await ElectoralRegister.findOne({UserName : username, Password : password});
  
    if (user) {
        if(user.Password !== password){
            res.status(401).json({ message: 'Invalid Password' });
         }
         else
         {
             const token = jwt.sign({ User : user }, process.env.JWT_String, { expiresIn: '300m' });
      res.json({ "token" : token, "UserName" : user.UserName , "Role" : user.isAdmin?"admin":"user"});
    }
} else {
      res.status(401).json({ message: 'User Not Registered' });
    }
  });

  router.post('/verify',authenticateToken,(req,res)=>{
    res.send(req.user);
  });

  router.post('/verifyadmin',authenticateTokenAndisAdmin,(req,res)=>{
    res.send(req.user);
  });





module.exports=router;