const router = require('express').Router();
const mongoose= require('mongoose');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const ElectoralRegister = require('../models/ElectoralRegister');
require('dotenv').config();


router.post('/userdata',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    var username;
    if(user.User.isAdmin){
        username = req.body.UserName;
    }
    else
    {
        username = user.User.UserName;
    }

    
    try {    
        if (!username) {
          return res.status(400).json({ message: 'Username is required' });
        }
    
        const user = await ElectoralRegister.findOne({ UserName: username });
    
        if (user) {
          res.status(200).json({ message: 'User retrieved successfully', data: user });
        } else {
          res.status(404).json({ message: 'User not found' });
        }
      } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
      }
  });

router.post('/selectrandomjury', authenticateTokenAndisAdmin, async (req, res) => {
  if (req.user) {
    const numRecords = parseInt(req.body.NumRecords) || 15;
    const PFN = req.body.PlantiffFirstName;
    const DFN = req.body.DefendantFirstName;
    const PLN = req.body.PlantiffLastName;
    const DLN = req.body.DefendantLastName;

    try {
      const matchCriteria = { 
        isAdmin: false, 
        JuryEligibility: true 
      };


      const exclusionArray = [];

      if (PFN) {
        exclusionArray.push({ FirstName: PFN, LastName: PLN});
      }
      if (DFN) {
        exclusionArray.push({ FirstName: DFN,LastName: DLN });
      }

      if (exclusionArray.length > 0) {
        matchCriteria.$nor = exclusionArray;
      }

      const randomRecords = await ElectoralRegister.aggregate([
        { $match: matchCriteria },
        { $sample: { size: numRecords } }
      ]).exec();

      const ids = randomRecords.map(record => record._id);

      await ElectoralRegister.updateMany(
        { _id: { $in: ids } },
        { $inc: { JuryInvitations: 1 } }
      );

      res.status(200).json(randomRecords);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching random records', error: err.message });
    }
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
});

  router.patch('/updateuser', authenticateToken, async (req, res) => {
    try {
      const updates = req.body;
      const username = req.body.UserName;
  
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
  
      const user = await ElectoralRegister.findOneAndUpdate(
        { UserName: username },
        { $set: updates },
        { new: true }
      );
  
      if (user) {
        res.status(200).json({ message: 'User updated successfully', data: user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Error updating user', error: err.message });
    }
  });

  router.delete('/deleteelectoralregister',authenticateTokenAndisAdmin, async (req,res)=>{
    
    if(req.user){
        try {
             username = req.body.UserName;
            if (!username) {
              return res.status(400).json({ message: 'User Name is required' });
            }
        
            const result = await ElectoralRegister.deleteOne({ UserName: username });
        
            if (result.deletedCount === 1) {
              res.status(200).json({ message: 'User deleted successfully',username });
            } else {
              res.status(404).json({ message: 'User not found', username });
            }
          } catch (err) {
            console.error('Error deleting User:', err);
            res.status(500).json({ message: 'Error deleting User', error: err.message });
          }
        }
  });


module.exports=router;