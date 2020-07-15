const User = require("../models/user")
const { check, validationResult } = require('express-validator')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')



exports.signup = (req,res) =>{
    //express-validator
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    //method to save data in DB
   const user = new User(req.body)
   user.save((err , user) => {
       if(err){
           return res.status(400).json({
               err: "Not able to save user in DB"
           })
       }
       res.json({
           name: user.name,
           email: user.email,
           id: user._id
       })
   })
}

exports.signin = (req,res) => {
    const errors = validationResult(req)
    const {email, password} = req.body

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }    

    User.findOne({email}, (err, user) => {
        //if error this email doesn't exists in our DB
        if(err || !user){
           return res.status(400).json({
                error:"User email doesn't exists"
            })
        }

        //using authenticate method from user model
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password do no match"
            })
        }
        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        //put token in cookies
        res.cookie("token",token,{expire: new Date() + 9999})

        //send response to frontend
        const {_id , name , email , role} = user
        return res.json({token, user:{_id,name,email,role}})
    })
}

//method for signout route
exports.signout = (req,res) =>{
    res.clearCookie("token")
    res.json({
        message: "User signed out successfully"
    })
}


//protected routes
//TODO: read how tokens are created section7 video 5
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})

//custom middlewares
exports.isAuthenticated = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error: "Access Denied or Authorization failed"
        })
    }
    next()
}

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not ADMIN, Access denied"
        })
    }
    next()
}