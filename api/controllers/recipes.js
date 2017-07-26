var mongoose = require('mongoose');
var Recipe = mongoose.model('Recipe');

var sendJSONResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
}

// Fetch a recipe by an Id
module.exports.getRecipe = function(req, res) {
	
	if(req.params && req.params.idRecipe) {
 		var idRecipe = req.params.idRecipe;

 		Recipe
 			.findById(idRecipe, function(err, recipe) {
 				if(err) {
 					console.log(err);
 					sendJSONResponse(res, 400, err);
 					return;
 				} else if(!recipe) {
 					sendJSONResponse(res, 404, {
 						"message": "Recipe not found"
 					})
 					return;
 				}
 				console.log(recipe)
 				sendJSONResponse(res, 200, recipe);
 			})
	} else {
		console.log("No idRecipe specified");
		sendJSONResponse(res, 404, {"message": "No idRecipe in request"});
	}

}

// Fetch all recipes for a specific cuisine (should paginate)
module.exports.getCousineRecipes = function(req, res) {

	var cousine = req.query.cousine;
	// Set default page to 1
	var queryPage = (req.query.page && req.query.page != 0) ? parseInt(req.query.page) : 1;
	// Number of recipes per page
	var recipesNo = 2;

	if(!cousine || cousine === '') {
		console.log("no cousine provided");
		sendJSONResponse(res, 404, {
			"message": "cousine parameteres is required"
		});
		return;
	} 

	Recipe
		.paginate({ recipe_cuisine: cousine }, { page: queryPage, limit: recipesNo }, function(err, recipes) {
			if(err) {
				console.log(recipe);
				sendJSONResponse(res, 400, err);
				return;
			} else if(!recipes || recipes.length === 0) {
				console.log('No recipe found');
				sendJSONResponse(res, 404, {
					"message": "Unfortunatly, there is no recipe for the "+cousine
				})
				return;
			} else if(recipes.docs.length === 0) {
				sendJSONResponse(res, 404, {
					"message": "No recipes returned on page: " + queryPage
				})
				return;
			}
			console.log(recipes);
			sendJSONResponse(res, 200, recipes.docs);
		})

}

//Rate an existing recipe between 1 and 5
module.exports.rateRecipe = function(req, res) {
	if(req.params && req.params.idRecipe) {
 		var idRecipe = req.params.idRecipe;

 		Recipe
 			.findById(idRecipe, function(err, recipe) {
 				if(err) {
 					console.log(err);
 					sendJSONResponse(res, 400, err);
 					return;
 				} else if(!recipe) {
 					sendJSONResponse(res, 404, {
 						"message": "Recipe not found"
 					})
 					return;
 				}
 				
 				if(req.body && req.body.rating) {
 					var rating = parseInt(req.body.rating);
 					recipe.rating = rating;
 					recipe.updated_at = new Date();
 					recipe.save(function(err, recipe) {
 						if(err) {
 							console.log(err);
 							sendJSONResponse(res, 400, {
 								"message": err
 							});
 						} else {
 							sendJSONResponse(res, 200, recipe);
 						}
 					})
 				} else {
 					sendJSONResponse(res, 404, {
 						"message": "No rating has been sent"
 					})
 				}

 			})
 		
	} else {
		console.log("No idRecipe specified");
		sendJSONResponse(res, 404, {"message": "No idRecipe in request"});
	}
}

// Update an existing recipe
module.exports.updateRecipe = function(req, res) {
	if(req.params && req.params.idRecipe) {
		var idRecipe = req.params.idRecipe;

		Recipe
			.findById(idRecipe, function(err, recipe) {
				if(err) {
					sendJSONResponse(res, 400, err)
					return;
				} else if(!recipe) {
					console.log('No recipe with id: '+ idRecipe + ' no found');
					sendJSONResponse(res, 404, {
						"message": "No recipe found"
					})
					return;
				}

				// Update recipe
				for(key in req.body) {
					if(recipe[key].length > 0) {
						recipe[key] = req.body[key];
					}
				}

				recipe.save(function(err, recipe) {
					if(err) {
						console.log(err);
						sendJSONResponse(res, 400, err);
					} else {
						console.log(recipe);
						sendJSONResponse(res, 200, recipe);
					}
				})
			})

	} else {
		console.log("No idRecipe specified");
		sendJSONResponse(res, 404, {"message": "No idRecipe in request"});
	}
}

// Add new recipe
module.exports.addRecipe = function(req, res) {
	
	var newRecipe = new Recipe(req.body);
	newRecipe.slug        = req.body.title.toString().replace(' ', '-').toLowerCase();
	newRecipe.short_title = (req.body.title.length > 10) ? req.body.title.substr(0, 10) + '..' : req.body.title;

	Recipe
		.create(newRecipe, function(err, recipe) {
			if(err) {
				sendJSONResponse(res, 400, err)
			} else {
				sendJSONResponse(res, 200, recipe);
			}
		})
}