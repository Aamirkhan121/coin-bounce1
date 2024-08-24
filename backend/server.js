const express =require ("express");
const dbConnection =require ("./database/index");
const { PORT } =require ("./config/index");
const router =require ("./routes/index");
const errorHandler =require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors=require("cors")


// const corsOptions={
//     credentials:true,
//     origin:["http://localhost:3000"]
// }
const app =express()
app.use(cookieParser())
// app.use(cors(corsOptions))

app.use(
    cors({
        origin:function(origin,callback) {
            return callback(null,true)
        },
        optionsSuccessStatus:200,
        credentials:true
    })
)
app.use(express.json({limit:'50mb'}))

app.use(router)

dbConnection()

app.use('/storage',express.static('storage'))

app.use(errorHandler)
app.listen(PORT,(req,res)=>{
    console.log(`server running on http://localhost:${PORT}`)
})



