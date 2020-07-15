const Product = require("../models/product")
//formidable is npm package for post form data 'in DB
const formidable = require("formidable")
//another npmm stuff
const _ = require("lodash")
//to get file path by default comes in nodejs
const fs = require("fs")


exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = product
        next()
    })
}

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    
    form.keepExtensions = true

    form.parse(req, (err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with image"
            })
        }

        //Destructure the feilds
        const {name, description, price, category, stock} = fields

        // restrictions on fields
        if(!name || !description || !price || !category || !stock ){
            return res.status(400).json({
                error:"Please include all the fields"
            })
        }



        let product = new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            //grabbing location of photo
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to DB
        product.save((err,product)=> {
            if(err){
                return res.status(400).json({
                    error: "Saving tshirt in DB failed!"
                })
            }
            res.json(product)
        })

    })
}

exports.getProduct = (req,res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

//Middleware
exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

//Delete Product
exports.deleteProduct = (req,res) => {
    let product = req.product
    product.remove((err,deletedProduct)=> {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message: "Deletion successfull",
            deletedProduct
        })
    })
}

//Update Product
exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    
    form.keepExtensions = true

    form.parse(req, (err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error: "problem with image"
            })
        }

        //updation code
        let product = req.product
        //fields are goig to be updated in this product
        product = _.extend(product, fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big"
                })
            }
            //grabbing location of photo
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }

        //save to DB
        product.save((err,product)=> {
            if(err){
                return res.status(400).json({
                    error: "Updation of product failed!"
                })
            }
            res.json(product)
        })

    })
}

//Product listing
exports.getAllProducts = (req,res) => {
    //mainly when we took input from user the language crafts it as a string so here we have to convert it into a string
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err,allProducts)=> {
        if(err){
            return res.status(400).json({
                error: "No products found in DB"
            })
        }

        res.json(allProducts)
    })
}

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category", {}, (err,category) => {
        if(err){
            return res.status(400).json({
                error: "No category found"
            })
        }
        res.json(category)
    })
}

//Middleware for updation of stock and sold
exports.updateStock = (req,res,next) => {

    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne:{
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count , sold: +prod.count}} //prod.count comes from front end
            }
        }
    })

    Product.bulkWrite(myOperations, {} , (err,products)=> {
        if(err){
            return res.status(400).json({
                error: "Bulk operations failed"
            })
        }

        next()
    } )

}
