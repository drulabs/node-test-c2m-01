var mongoose = require('mongoose');
var Restaurant = mongoose.model('Restaurant');

exports.allRestaurants = function(req,res){
    console.log("getting all restaurant");
    Restaurant.find({}, function(err, restaurants){
        if (err){
            res.json(err);
        } else if(restaurants) {
            res.json(restaurants);
        } else {
            res.status(404).send();
        }
    });
}

exports.addRestaurant = function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var tagline = req.body.tagline;
    var pic = req.body.pic;
    var cuisine = req.body.cuisine;
    var address = req.body.address;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var city = req.body.city;
    var country = req.body.country;
    var hasBranches = req.body.hasBranches;
    var updated = req.body.updated;
    var established = req.body.established;
    var rating = req.body.rating;
    console.log("Restaurant name: " + req.body.name);
 
    var newRestaurant = new Restaurant();
    newRestaurant.name = name;
    newRestaurant.email = email;
    newRestaurant.pic = pic;
    newRestaurant.cuisine = cuisine;
    newRestaurant.address = address;
    newRestaurant.longitude = longitude;
    newRestaurant.latitude = latitude;
    newRestaurant.city = city;
    newRestaurant.country = country;
    newRestaurant.hasBranches = hasBranches;
    newRestaurant.updated = updated;
    newRestaurant.established = established;
    newRestaurant.rating = rating;
 
    newRestaurant.save(function(err,msg){
        if (err) {
            console.log("Error : While saving the new restaurant");
            res.status(500).send('<h1>Error : While saving the new restaurant</h1>');
        }else{
            res.json(newRestaurant);
        }
    });
}

exports.getRestaurant = function(req,res){
    var requestedSlug = req.params.slug;
    Restaurant.findOne({slug:requestedSlug}, function(err,restaurant){
        if (err) {
            console.log("Error : While searching the restaurant - " + requestedSlug);
            res.status(404).send();
        } else if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).send("Restaurant not found - " + requestedSlug);
        }
    });
}

exports.updateRestaurant = function(req,res) {

    var restaurantSlug = req.params.restaurant_slug;

    var name = req.body.name;
    var email = req.body.email;
    var tagline = req.body.tagline;
    var pic = req.body.pic;
    var cuisine = req.body.cuisine;
    var address = req.body.address;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var city = req.body.city;
    var country = req.body.country;
    var hasBranches = req.body.hasBranches;
    var updated = req.body.updated;
    var established = req.body.established;
    var rating = req.body.rating;
    console.log("Restaurant name: " + req.body.name);
 
    var updatedRestaurant = {};
    updatedRestaurant.name = name;
    updatedRestaurant.email = email;
    updatedRestaurant.pic = pic;
    updatedRestaurant.cuisine = cuisine;
    updatedRestaurant.address = address;
    updatedRestaurant.longitude = longitude;
    updatedRestaurant.latitude = latitude;
    updatedRestaurant.city = city;
    updatedRestaurant.country = country;
    updatedRestaurant.hasBranches = hasBranches;
    updatedRestaurant.updated = updated;
    updatedRestaurant.established = established;
    updatedRestaurant.rating = rating;

    Restaurant.findOneAndUpdate({slug:restaurantSlug}, updatedRestaurant, { upsert: true, new: true }, function(err, data){
        if (err) {
            console.log("Error : While updating restaurant - " + restaurantSlug);
            res.status(404).send();
        } else {
            res.json(data);
        }
    });
}

exports.deleteRestaurant = function(req,res) {
    var restaurantSlug = req.params.slug;
    Restaurant.findOneAndRemove({slug:restaurantSlug}, function(err,data){
        if (err) {
            console.log("Error : While removing restaurant - " + restaurantSlug);
            res.status(404).send();
        } else if (data) {
            res.json(data);
        } else {
            res.status(404).send("Restaurant not found - " + restaurantSlug);
        }
    });
}

exports.getRestaurantsByCity = function(req,res){
    var city = req.params.city.toLowerCase();
    var newCity = city.replace(/[^a-zA-Z0-9 ]/g, "");
    var cityWithHyphen = newCity.replace(/\s+/g, '-');
    Restaurant.find({city:cityWithHyphen}, function(err,restaurants){
        if (err) {
            console.log("Error : While searching for restaurants");
            res.status(404).send();
        } else if(restaurants) {
            res.json(restaurants);
        } else {
            res.status(404).send("");
        }
    });
}

exports.bulkAdd = function(req, res){
    var restaurants = req.body;
    Restaurant.collection.insertMany(restaurants, {ordered: false}, function(err, data){
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(data);
        }
    });
    
    // .then(function(data){
    //     console.log("bulk Promise success - " + data);
    // }).catch(function(reason) {
    //     console.log('bulk Promise rejected - ' + reason);
    //     res.status(500).send();
    // });

}

exports.saveComment = function(req,res){
    var restaurant_slug = req.body.restaurant_slug;
    var body = req.body.body;
    var commented_by = req.body.commented_by;
    var posted_date = new Date();
 
    Restaurant.findOne({slug:restaurant_slug}, function(err,restaurant){
 
        if (restaurant) {
            restaurant.comments.push({body:body,commented_by:commented_by,date:posted_date});

            restaurant.save(function(err,data){
                if(err){
                    console.log("Error : While saving comment for - " + restaurant_slug);
                    return res.status(500).send();
                }else{
                    console.log("comment saved - " + data);
                    res.status(200).send();
                }
            });
        } else {
            console.log("Restaurant not found - " + restaurant_slug);
            return res.status(404).send();
        }
    });
}