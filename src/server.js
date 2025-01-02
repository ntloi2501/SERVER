const express = require('express')
const bodyParser = require('body-parser')
const viewEngine = require("./config/viewEngine")
const initWebRoutes = require ("./route/web")
const connectDB = require( './config/db')
// const cors = require('cors')

require('dotenv').config()
let app = express()

// app.use(cors({  origin: true  }))

//fix cors
// Add headers before the routes are defined
app.use(function (req, res, next) {
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
     // Pass to next layer of middleware
     next();
 });
//config app
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
viewEngine(app)
initWebRoutes(app)

connectDB()
let port = process.env.PORT 

app.listen(port, () => {
     //callback 
     console.log("server is running port : " + port)
})



