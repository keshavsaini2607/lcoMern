const {Order,ProductCart} = require("../models/order")

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "No orders found"
            })
        }

        req.order = order
        next()
    })
}

exports.createOrder = (req,res) => {
    //here req.profile is populated by getUserById
    req.body.order.user = req.profile
    const order = Order(req.body.order)

    order.save((err,order) => {
        if(err){
            return res.status(400).json({
                error: "Failed to save your order"
            })
        }

        res.json(order)
    })
}

exports.getAllOrders = (req,res) => {
    Order.find()
    .populate("user", "_id name")
    .exec((err,allOrders) => {
        if(err){
            return res.status(400).json({
                error: "Failed to get all order"
            })
        }
        res.json(allOrders)
    })
}

exports.getOrderStatus = (req,res) => {
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) => {
    Order.update(
        {_id: reqq.body.orerId},
        {$set: {status: req.body.status}},
        (err,order) => {
            if(err){
                return res.status(400).json({
                    error: "Failed to update your order"
                })
            }
            res.json(order)
        }
    )
}