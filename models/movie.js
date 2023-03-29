const mongoose =require("mongoose");

const movieSchema = new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    type:{type:String},
    desc:{type:String},
    img:{type:String},
    imgSm:{type:String},
    trailer:{type:String},
    vedio:{type:String},
    limit:{type:String},
    year:{type:String},
    genre:{type:String},
    isSeries:{type:Boolean,default:false},
},{timestamps:true})

module.exports= mongoose.model("Movie",movieSchema);