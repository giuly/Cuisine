var express = require('express');
var router = express.Router();
//load controller
var recipesCtrl = require('../controllers/recipes');

// GET a recipe
router.get('/recipe/:idRecipe', recipesCtrl.getRecipe);
// GET recipes for a specific cousine
router.get('/recipe', recipesCtrl.getCousineRecipes);
// Rate a recipe
router.post('/recipe/:idRecipe', recipesCtrl.rateRecipe);
// Update a recipe
router.put('/recipe/:idRecipe', recipesCtrl.updateRecipe);
// Add a new recipe
router.post('/recipe', recipesCtrl.addRecipe);

module.exports = router;
