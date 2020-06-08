const User = require("../models/user")
const Order = require("../models/order")

exports.getUserById = (req,res,next,id) =>{
    // findOne and findById are mongo methods & exec means execute
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(400).json({
                error: "NO user was found in DB"
            })
        }
        req.profile = user
        next()
    })
}


exports.getUser = (req,res) => {
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, userFindAndModify: false},
        (err,user)=>{
            if(err || !user){
                return res.status(400).json({
                    error: "Data is not updated"
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res) => {
    Order.find({user: req.profile._id})
    .populate("user","_id name")
    .exec((err,order) =>{
        if(err){
            return res.status(400).json({
                error: "NO order are found in this account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req,res,next) => {

    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })
    //Store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}}, //first purchases is from user model which is updating info in DB second is local
        {new: true},
        (err, purchase) =>{
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
            next()
        }
    )
}