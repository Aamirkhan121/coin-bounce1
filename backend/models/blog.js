const mongoose = require('mongoose');
const {Schema} = mongoose;

const blogSchema=new Schema({
    title:{type:String,requierd:true},
    content:{type:String,requierd:true},
    photoPath:{type:String,requierd:true},
    author:{type:mongoose.SchemaTypes.Object,ref:"User"},
},
{timestamps:true}
)

module.exports = mongoose.model('Blog', blogSchema, 'blogs'); //Data will be saved in the database with the name of the blogs