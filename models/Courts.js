const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const CourtsSchema = new Schema({
  CourtID: {type:String,Required:true,unique:true},  
  CourtName : {type : String, required : true},
  Address:{
    HouseNumber:{type:Number},
    Street:{type:String},
    Town:{type:String},
    City:{type:String},
    State:{type:String},
    Country:{type:String}
  },
  PostalCode:{type:String},
},
{timestamps:true},
);

const Courts = model('Courts', CourtsSchema);
module.exports = Courts;