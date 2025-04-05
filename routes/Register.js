const express = require('express');
const ElectoralRegister = require('../models/ElectoralRegister.js');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const router = express.Router();
require('dotenv').config();




router.get('/users',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    if(user){
    
    try {        
        const electoralregister = await ElectoralRegister.find({});
    
        if (electoralregister) {
          res.status(200).json({ message: 'Electoral Register retrieved successfully', data: electoralregister });
        } else {
          res.status(404).json({ message: 'Electoral Register not found' });
        }
      } catch (err) {
        console.error('Error retrieving Electoral Register:', err);
        res.status(500).json({ message: 'Error retrieving Electoral Register', error: err.message });
      }
    }
    else{
        console.error('Error retrieving Electoral Register due to Unauthorisation:', err);
        res.status(500).json({ message: 'Error retrieving Electoral Register due to Unauthorisation', error: err.message });
    }
  });


router.post("/", async (req, res) => {

  try {
    const registeruser=req.body;
    const register = ElectoralRegister(registeruser);
    await register.save(); 
    res.status(201).json({ message: 'User registered successfully', data: register }); 
  } catch (err) {
    console.error('Error Registering user:', err);
    res.status(500).json({ message: 'Error registering user', error: err.message }); 
  }
});

module.exports = router;
