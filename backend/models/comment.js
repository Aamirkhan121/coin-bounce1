const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentSchema=new Schema({
    content:{type:String,required:true},
    author:{type:mongoose.SchemaTypes.Object,ref:"User"},
    blog:{type:mongoose.SchemaTypes.Object,ref:"Blog"},
},
{timestamps:true}
)
module.exports =  mongoose.model("Comment",commentSchema,"comments") //Data will be saved in the database with the name of the comments