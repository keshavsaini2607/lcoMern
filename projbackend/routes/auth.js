var express = require('express')
var router = express.Router()
const { check } = require('express-validator')
const {signout , signup , signin , isSignedIn} = require("../controllers/auth")



router.post("/signup",[
    //express-validator checks
    check("name").isLength({ min: 3 }).withMessage('name must be at least 3 chars long'),
    check("email").isEmail().withMessage('email is required'),
    check("password").isLength({ min: 3 }).withMessage('password must be at least 3 chars long')

], signup)

router.post("/signin",[
    //express-validator checks
    check("email").isEmail().withMessage('email is required'),
    check("password").isLength({ min: 3 }).withMessage('password is required')

], signin)

router.get("/signout" , signout)

router.get("/testroute" , isSignedIn , (req,res) =>{
    res.send("A protected route")
})


//by this line we are throwing the code in this file outside of this file
module.exports  = router