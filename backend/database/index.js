const mongoose = require('mongoose');
const {MONGO_CONNECTION_STRING} = require('../config/index');



const dbConnection=async()=>{
  try {
    const connected=await mongoose.connect(MONGO_CONNECTION_STRING)
    console.log(`connect to database ${connected.connection.host}`)
  } catch (error) {
    console.log(`Error: ${error}`)
  }
}
module.exports = dbConnection;