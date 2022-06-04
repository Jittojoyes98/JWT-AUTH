const express=require('express')
const databaseConnect=require('./config/db.js')
const cors=require('cors')
const dotenv=require('dotenv')
const bodyParser=require('body-parser')
var jwt=require('jsonwebtoken')
dotenv.config()
const User=require('./models/User.js')

databaseConnect()
const app=express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
const router=require('./routes/auth')


const PORT=5000
app.use("/users",router)
app.get("/",(req,res)=>{
    res.send("Hello there we are at home")
})

app.get("/post",(req,res)=>{
    res.json({ message:"Posts are here.."})
})



app.listen(PORT,()=>{
    console.log("The server is running on port 5000")
})