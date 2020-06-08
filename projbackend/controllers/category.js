const Category = require("../models/category")

exports.getCategoryById = (req,res,next,id) =>{

    Category.findById(id).exec((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "No categories are found"
            })
        }
        req.category = category
        next()
    })
}

exports.createCategory = (req,res) =>{
    const category = new Category(req.body)
    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error: "Not able to save category in DB"
            })
        }
        res.json({category})
    })
}

exports.getCategory = (req,res) =>{
    return res.json(req.category)
}

exports.getAllCategories = (req,res) => {
    Category.find(),exec((err,categories)=> {
        if(err){
            return res.status(400).json({
                error: "No categories found"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory = (req,res) => {
    //we are able to get this req.category because of the middleware getCategoryById 
    const category = req.category
    //category.name is getting populated either from the frontend or from the postman
    category.name = req.body.name

    category.save((err,updatedCateory)=>{
        if(err){
            return res.status(400).json({
                error: "Category is not updated"
            })
        }
        res.json(updatedCateory)
    })
}

exports.removeCategory = (req,res) =>{
    const category = req.category

    category.remove((err,category) =>{
        if(err){
            return res.status(400).json({
                error: "Failed to delete the category"
            })
        }
        res.json({
            message: `${category} deleted successfully`
        })
    })
}