const express = require('express')
const router=express.Router()
const User=require('../models/User')

// token verification by middleware
const verifyToken=require('../middleware/verifyToken')

const bcrypt=require('bcryptjs')
const {check,validationResult}=require('express-validator')
const jwt=require('jsonwebtoken')

const secretKey='secrettoken'

router.get("/",(req,res)=>{
    res.send("Hii there user")
})

// @route POST /users
// @desc register a user
// @access public

router.post("/",[
        check("name","Name is requires").not().isEmpty(),
        check("email","valid Email is required").isEmail(),
        check("password","Please enter valid password with 6 characters").isLength({min:6})
    ],
    async(req,res)=>{
        const result=validationResult(req)
        if(!result.isEmpty()){
            res.status(400).json({message: result.array()})
        }
        const {name,email,password}=req.body;

        try{
            // Check if a user exist or not
            const checkUser=await User.findOne({email})
            if(checkUser){
                res.status(400).json({ errors: [{ msg: "User already exists" }] })
            }
            // else create a user
            const newUser=new User({
                name,
                email,
                password,
            })

            // hash the password and store it in the database
            const salt=await bcrypt.genSalt(10)
            newUser.password=await bcrypt.hash(password,salt)
            await newUser.save()

            // since signed in create a web token and return it.
            const payload={
                user:newUser
            }
            // console.log(newUser.id) It do exist
            jwt.sign(payload,secretKey,{expiresIn :"36000"},(err,token)=>{
                if(err){
                    throw err
                }
                res.json({token})
            })


        }catch(err){
            console.error(err.message)
            res.status(500).json({message : "Server error"})
        }
})

// @route POST /users/login
// @desc request sending and token creation
// @access public
router.post("/login",[
    check("email","Enter a valid email").isEmail(),
    check("password","Enter a valid password").exists(),
    ],
    async(req,res)=>{
        const error=validationResult(req)
        if(!error.isEmpty()){
            res.status(400).json({message: error.array()})
        }
        const {email,password}=req.body; 
        
        try{
            // find if a user exist
            const user=await User.findOne({email})
            if(!user){
                // if not send msg
                res.status(400).json({error:[{message:"Invalid credentials"}]})
            }

            const match=await bcrypt.compare(password,user.password);

            if(!match){
                // if no match send msg
                res.status(400).json({error:[{message:"Invalid credentials"}]})
            }

            const payload={
                user:user
            }

            jwt.sign(payload,secretKey,{expiresIn:"6 days"},(err,token)=>{
                if(err){
                    res.status(400).json({msg:"There is an error"})
                }
                res.send({token})
            })



        }catch(err){
            console.error({message:err})
            res.status(500).json({message:"Server error"})
        }
})

router.get("/login",verifyToken,async(req,res)=>{
    try{
        // console.log(req.user)
        const user=await User.findById(req.user._id)
        res.json({user})
    }catch(err){
        res.status(500).send("Server error")
    }
})


module.exports=router;

