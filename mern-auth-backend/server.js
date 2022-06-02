const express=require('express')
const databaseConnect=require('./config/db.js')
const cors=require('cors')
const dotenv=require('dotenv')
const bodyParser=require('body-parser')
var jwt=require('jsonwebtoken')
dotenv.config()
const User=require('./models/User')

databaseConnect()
const app=express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

const PORT=5000

app.get("/",(req,res)=>{
    res.send("Hello there we are at home")
})

app.get("/post",(req,res)=>{
    res.json({ message:"Posts are here.."})
})

const verifyToken=(req,res,next)=>{
    const bearer=req.headers['authorization'].split(' ')[1]
    if(typeof bearer!=="undefined"){
        req.token=bearer
        next()
    }else{
        res.sendStatus(403)
    }
}

app.post("/post",verifyToken,(req,res)=>{
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            res.sendStatus(403)
        }else{
            res.json({
                message:"Post created Sucessfully",
                authData
            })
        }
    })
})


app.post("/login",(req,res)=>{
    const user={
        name:"Jtto",
        email:"jittojoyes77@gmail.com",
        password:"Hello world!"
    }
    jwt.sign({user},'secretkey',{expiresIn:36000},(err,token)=>{
        if(err){
            return res.json({message: err})
        }
        res.json({
            message: "Success",
            token
        })
    })

})

app.listen(PORT,()=>{
    console.log("The server is running on port 5000")
})