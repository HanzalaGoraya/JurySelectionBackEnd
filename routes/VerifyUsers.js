const express = require('express');
const jwt = require('jsonwebtoken');


const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
    let token = 0;
  if (authHeader) {
    if(authHeader.startsWith('Bearer ')){
    token = authHeader.substring(7);
  }
    else{
        token = authHeader;
    }
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  await jwt.verify(token, process.env.JWT_String, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}};

const authenticateTokenAndisAdmin = async (req, res, next) => {
   
    const authHeader = req.headers['authorization'];
  let token = 0;
  if (authHeader) {
    if(authHeader.startsWith('Bearer ')){
    token = authHeader.substring(7);
   
    }
    else{
        token = authHeader;
       
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
    await jwt.verify(token, process.env.JWT_String, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
    
      if(user.User.isAdmin)
        {
      req.user = user;
        }
        else{
            req.user=null;
            return res.status(403).json({ message: 'Invalid Request' });
        }
      next();
    });
}};
  

module.exports = {authenticateToken, authenticateTokenAndisAdmin}


