const  mongoose =  require('mongoose');
const ElectoralRegister= require('./ElectoralRegister');
const Courts = require('./Courts');
const { Schema, model } = mongoose;

const CasesSchema = new Schema({
  CaseID: {type:String,Required:true,unique:true},  
  CaseType:{type: String, Required: true}, 
  PlantiffFirstName : {type : String, required : true},
  PlantiffLastName : {type : String},
  DefendantFirstName : {type : String, required : true},
  DefendantLastName : {type : String},
  PlantiffLawyer: {type : String  },
  DefendantLawyer : {type : String},
  ProposedCharges : {type : String},
  ProposedDecision : {type : String, default : "Pending"},
  ProposedJury:[
    {
        ElectedJuror:{type: Schema.Types.ObjectId, ref: 'ElectoralRegister'},
        JurorConfirmation: {type:Boolean, default : false}, 
        ConfirmationDate:{type: Date},
        IsSubstitute : { type:Boolean, default: false}
    }
  ],
  TimeAndDateOfHearing:{type : Date},
  LocationOfHearing: {type: Schema.Types.ObjectId, ref: 'Courts', default : ""},
  VotesInFavourOfDefendant:{type : Number},
  VotesAgainstDefendant : {type : Number},
},
{timestamps:true},
);

const Cases = model('Cases', CasesSchema);
module.exports = Cases;