const router = require('express').Router();
const mongoose= require('mongoose');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const Courts = require('../models/Courts.js');
require('dotenv').config();

router.get('/courtdata',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    
    try {        
        const court = await Courts.find({});
    
        if (court) {
          res.status(200).json({ message: 'Courts retrieved successfully', data: court});
        } else {
          res.status(404).json({ message: 'Courts not found' });
        }
      } catch (err) {
        console.error('Error retrieving Courts:', err);
        res.status(500).json({ message: 'Error retrieving Courts', error: err.message });
      }
  });

  router.post('/viewcourtdata',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    var courtid = req.body.CourtID;
    
    try {        
        const court = await Courts.findOne({CourtID : courtid});
    
        if (court) {
          res.status(200).json({ message: 'Courts retrieved successfully', data: court});
        } else {
          res.status(404).json({ message: 'Courts not found' });
        }
      } catch (err) {
        console.error('Error retrieving Courts:', err);
        res.status(500).json({ message: 'Error retrieving Courts', error: err.message });
      }
  });

router.post("/addcourt",authenticateTokenAndisAdmin, async (req, res) => {
    if(req.user){
    
    try {
      const registercourt=req.body;
      const register = Courts(registercourt);
      await register.save(); 
      res.status(201).json({ message: 'Court registered successfully', data: register }); 
    } catch (err) {
      console.error('Error Registering Court:', err);
      res.status(500).json({ message: 'Error registering Court', error: err.message }); 
    }
    }else{
        console.error('Error Registering Court:', err);
      res.status(500).json({ message: 'Error registering Court', error: err.message }); 
    }
  });

  
  router.delete('/deletecourt',authenticateTokenAndisAdmin, async (req,res)=>{
    var courtid;
    if(req.user){
        try {
             courtid = req.body.CourtID;
            if (!courtid) {
              return res.status(400).json({ message: 'Court ID is required' });
            }
        
            const result = await Courts.deleteOne({ CourtID: courtid });
        
            if (result.deletedCount === 1) {
              res.status(200).json({ message: 'Court deleted successfully' });
            } else {
              res.status(404).json({ message: 'Court not found' });
            }
          } catch (err) {
            console.error('Error deleting Court:', err);
            res.status(500).json({ message: 'Error deleting Court', error: err.message });
          }
        }
  });


  router.patch('/updatecourt', authenticateTokenAndisAdmin, async (req, res) => {
    if(req.user){
    try {
      
      const updates = req.body;
      const courtid = req.body.CourtID;
  
      if (!courtid) {
        return res.status(400).json({ message: 'Court Id is required' });
      }
  
      const court = await Courts.findOneAndUpdate(
        { CourtID: courtid },
        { $set: updates },
        { new: true }
      );
  
      if (court) {
        res.status(200).json({ message: 'Court updated successfully', data: court });
      } else {
        res.status(404).json({ message: 'Court not found' });
      }
    } catch (err) {
      console.error('Error updating court:', err);
      res.status(500).json({ message: 'Error updating court', error: err.message });
    }
}
  });

module.exports=router;