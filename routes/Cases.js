const router = require('express').Router();
const mongoose= require('mongoose');
const { authenticateToken, authenticateTokenAndisAdmin } = require('./VerifyUsers');
const Cases = require('../models/Cases.js');
require('dotenv').config();

router.get('/getallcases',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    
    try {        
        const registeredcases = await Cases.find({});
    
        if (registeredcases) {
          res.status(200).json({ message: 'Cases retrieved successfully', data: registeredcases});
        } else {
          res.status(404).json({ message: 'Cases not found' });
        }
      } catch (err) {
        console.error('Error retrieving Cases:', err);
        res.status(500).json({ message: 'Error retrieving Cases', error: err.message });
      }
  });


  router.post('/getcase',authenticateTokenAndisAdmin, async (req,res)=>{
    var user = req.user;
    var caseid = req.body.CaseID;
    try {        
        const registeredcases = await Cases.findOne({"CaseID" : caseid})
        .populate({
          path: 'LocationOfHearing', 
          select: 'CourtName CourtID'
        })
        .populate({
          path: 'ProposedJury.ElectedJuror',
          select: 'FirstName LastName Email PhoneNumber'
        })
        .exec();;
    
        if (registeredcases) {
          res.status(200).json({ message: 'Case retrieved successfully', data: registeredcases});
        } else {
          res.status(404).json({ message: 'Cases not found' });
        }
      } catch (err) {
        console.error('Error retrieving Cases:', err);
        res.status(500).json({ message: 'Error retrieving Cases', error: err.message });
      }
  });

  router.get('/getjuryinvites',authenticateToken, async (req,res)=>{
    var user = req.user;
    var firstname = req.user.User.FirstName;
    var lastname = req.user.User.LastName;
    
    try {         
        const registeredcases = await Cases.find({})
        .populate({
          path: 'LocationOfHearing', 
          select: 'CourtName CourtID PostalCode'
        })
        .populate({
          path: 'ProposedJury.ElectedJuror',
          select: '_id FirstName LastName Email PhoneNumber UserName'
        })
        .exec();;
        if (registeredcases) {
          const filteredCases = registeredcases.filter(caseItem => 
            caseItem.ProposedJury.some(juror => 
                juror.ElectedJuror &&
                juror.ElectedJuror.FirstName === firstname &&
                juror.ElectedJuror.LastName === lastname
            )
        );
          res.status(200).json({ message: 'Jury Invites retrieved successfully', data: filteredCases});
        } else {
          res.status(404).json({ message: 'Cases not found' });
        }
      } catch (err) {
        console.error('Error retrieving Cases:', err);
        res.status(500).json({ message: 'Error retrieving Cases', error: err.message });
      }
  });

  const ObjectId = mongoose.Types.ObjectId;

  router.patch('/updatejurorconfirmation',authenticateToken, async (req, res) => {
      const { caseId, electedJurorId, jurorConfirmation } = req.body;
  
      try {
          const caseDocument = await Cases.findOne({
              CaseID: caseId,
              'ProposedJury.ElectedJuror': new ObjectId(electedJurorId)
          });
  
          if (!caseDocument) {
              return res.status(404).json({ message: 'Case or Juror not found' });
          }
  
          const updatedCase = await Cases.findOneAndUpdate(
              {
                  CaseID: caseId,
                  'ProposedJury.ElectedJuror': new ObjectId(electedJurorId)
              },
              {
                  $set: {
                      'ProposedJury.$.JurorConfirmation': jurorConfirmation
                  }
              },
              { new: true }
          );
  
          res.status(200).json({ message: 'Juror confirmation updated successfully', data: updatedCase });
      } catch (error) {
          res.status(500).json({ message: 'Error updating juror confirmation', error: error.message });
      }
  });

router.get('/casesfilledbyuser',authenticateToken, async (req,res)=>{
    var user = req.user;
    var firstname = req.user.User.FirstName;
    var lastname = req.user.User.LastName;
    try {        
        const registeredcases = await Cases.find({PlantiffFirstName : firstname , PlantiffLastName : lastname});
    
        if (registeredcases) {
          res.status(200).json({ message: 'Cases Filled By User retrieved successfully', data: registeredcases});
        } else {
          res.status(404).json({ message: 'Cases not found' });
        }
      } catch (err) {
        console.error('Error retrieving Cases:', err);
        res.status(500).json({ message: 'Error retrieving Cases', error: err.message });
      }
  });

  router.get('/casesfilledonuser',authenticateToken, async (req,res)=>{
    var user = req.user;
    var firstname = req.user.User.FirstName;
    var lastname = req.user.User.LastName;
    try {        
        const registeredcases = await Cases.find({DefendantFirstName : firstname , DefendantLastName : lastname});
    
        if (registeredcases) {
          res.status(200).json({ message: 'Cases Filled On User retrieved successfully', data: registeredcases});
        } else {
          res.status(404).json({ message: 'Cases not found' });
        }
      } catch (err) {
        console.error('Error retrieving Cases:', err);
        res.status(500).json({ message: 'Error retrieving Cases', error: err.message });
      }
  });

router.post("/addcase",authenticateTokenAndisAdmin, async (req, res) => {
    if(req.user.User){
    try {
      const registercase=req.body;
      const register = Cases(registercase);
      const result = await register.save(); 
      res.status(201).json({ message: 'Case Added successfully', data: result }); 
    } catch (err) {
      console.error('Error Registering Case:', err);
      res.status(500).json({ message: 'Error registering Case', error: err.message }); 
    }
    }else{
        console.error('Error Registering Case:', err);
      res.status(500).json({ message: 'Error registering Case', error: err.message }); 
    }
  });


  router.patch('/updatecase', authenticateTokenAndisAdmin, async (req, res) => {
    try {
      const updates = req.body;
      const caseid = req.body.CaseID;
      if (!caseid) {
        return res.status(400).json({ message: 'CaseID is required' });
      }
  
      const casedetails = await Cases.findOneAndUpdate(
        { CaseID : caseid },
        { $set: updates },
        { new: true }
      )
      .populate({
        path: 'ProposedJury.ElectedJuror', 
        select: 'FirstName LastName Email PhoneNumber'
      })
      .exec();
  
      if (casedetails) {
        res.status(200).json({ message: 'Case updated successfully', data: casedetails });
      } else {
        res.status(404).json({ message: 'Case not found' });
      }
    } catch (err) {
      console.error('Error updating Case:', err);
      res.status(500).json({ message: 'Error updating Case', error: err.message });
    }
  });

  router.delete('/deletecase',authenticateTokenAndisAdmin, async (req,res)=>{
    var caseid;
    if(req.user){
        try {
             caseid = req.body.CaseID;
            if (!caseid) {
              return res.status(400).json({ message: 'Case ID is required' });
            }
        
            const result = await Cases.deleteOne({ CaseID : caseid });
        
            if (result.deletedCount === 1) {
              res.status(200).json({ message: 'Case deleted successfully' });
            } else {
              res.status(404).json({ message: 'Case not found' });
            }
          } catch (err) {
            console.error('Error deleting Case:', err);
            res.status(500).json({ message: 'Error deleting Case', error: err.message });
          }
        }
  });

module.exports=router;