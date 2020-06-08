require('dotenv').config()


const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const cors = require('cors')

//My Routes
const authRoutes = require("./routes/auth") // ./ takes to the home dir
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")

//read about dotenv

//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(() =>{
    console.log('DB CONNECTED!');
    //.then has the method or the code that is going to be executed once the connection is succesfull
})


//Middlewares
app.use(bodyparser.json())
app.use(cookieparser())
app.use(cors())

//My routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)

//Port
const port = process.env.PORT || 8000

//Starting a Server
app.listen(port, () =>{
    console.log(`app is running at ${port}`);
    
})