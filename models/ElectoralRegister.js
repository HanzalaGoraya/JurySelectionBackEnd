const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const ElectoralRegisterSchema = new Schema({
  isAdmin: {type : Boolean, default : false,},
  UserName : {type : String, required : true, unique:true},
  FirstName : {type : String, required : true},
  LastName : {type : String},
  DOB : {type : String },
  FathersName : {type : String},
  MothersName : {type : String},
  Email : {type: String,minLength: 10,required: true},
  Password:{type:String, required : true},
  PhoneNumber : {type : String },
  NIN : {type : String },
  PassportNumber:{type:String},
  Address:{
    HouseNumber:{type:Number},
    Street:{type:String},
    Town:{type:String},
    City:{type:String},
    State:{type:String},
    Country:{type:String}
  },
  PostalCode:{type:String},
  FamilyRegistrationNumber:{type:String},
  ResidentialStatus:{type:String},
  HasConvictions:{type: Boolean, default : false},
  JuryEligibility:{type:Boolean, default : true},
  JuryInvitations:{type:Number, default : 0},
  JuryInvitationsAccepted:{type:Number, default : 0},
},
{timestamps:true},  

);

const ElectoralRegister = model('ElectoralRegister', ElectoralRegisterSchema);
module.exports = ElectoralRegister;