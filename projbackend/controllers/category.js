const Category = require("../models/category")
//formidable is npm package for post form data 'in DB
const formidable = require("formidable")
//another npmm stuff
const _ = require("lodash")

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
                error: err
            })
        }
        res.json({category})
    })
}

exports.getCategory = (req,res) =>{
    return res.json(req.category)
}

exports.getAllCategories = (req,res) => {
    Category.find().exec((err,categories)=> {
        if(err){
            return res.status(400).json({
                error: "No categories found"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory = (req, res) => {
    const category = req.category;


    category.name = req.body.name;


    category.save( (error, updatedcategory) => {
        if(error) {
            return res.status(400).json(
                {
                    error: "FAILED TO UPDATE CATEGORY"
                }
            )
        }
        console.log(updatedcategory);
        res.json(updatedcategory);
    } )
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