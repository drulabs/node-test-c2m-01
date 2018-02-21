var chalk = require('chalk');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser=require('body-parser');

var app = express();
var db = require('./models/db.js');
var routes = require('./routes/route.js');
var restaurant = require('./routes/restaurant.js');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', routes.index);

app.get('/restaurants', restaurant.allRestaurants);

app.get('/restaurant/:slug', restaurant.getRestaurant);
app.get('/restaurants/:city', restaurant.getRestaurantsByCity);

app.post('/new-restaurant', restaurant.addRestaurant);
app.post('/new-comment', restaurant.saveComment);


app.use(function(req, res) {
    console.log(chalk.red("Error: 404"));
    res.status(404).sendFile(__dirname +'/public/404.html');
});

app.use(function(error, req, res, next) {
    console.log(chalk.red('Error : 500'+error))
    res.status(500).sendFile(__dirname +'/public/500.html');
});

var port = process.env.PORT || 8080;

var server=app.listen(port,function(req,res){
   console.log(chalk.green("Catch the action at http://localhost:"+port));
});