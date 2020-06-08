const express = require("express");
const app = express();

const port = 8000

app.get('/', (req,res) => {
    return res.send("you are on homepage");
});

app.get('/signout', (req,res) => {
    return res.send("you have been signed out");
});

const admin = (req,res) =>{
    return res.send("Home dashboard")
}

const isAdmin = (req,res,next) =>{
    console.log("isAdmin is running");
    next()
}

const isLoggedIn = (req,res,next) =>{
    console.log("isLoggedIn is running");
    next()
    
}

app.get('/admin', isLoggedIn,isAdmin,admin)

app.get('/signup', (req,res) => {
    return res.send("you are on signup route");
});

app.get('/login', (req,res) => {
    return res.send("you are on login route");
});

app.listen(port , () => {
    console.log("server is ip and running...");
    
})