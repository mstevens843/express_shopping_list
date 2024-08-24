const express = require('express');
const app = express(); 
const itemRoutes = require('./routes/items'); 

app.use(express.json()); // for parsing application/json
app.use('/items', itemRoutes); 

app.use(function (req, res, next) {
    const err = new Error('Not found');
    err.status = 404;
    next(err); 
}); 

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    return res.json({
        error: err.message,
    });
}); 

module.exports = app;