const express = require('express')
const path = require('path')

let configViewEngine = (app) => {
    app.use(express.static(path.join(__dirname, "../public"))); 
    app.set("view engine", "ejs"); 
    app.set("views", path.join(__dirname, "../views"));
};

module.exports = configViewEngine;
