var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

//import command
//mongoimport --host=127.0.0.1 -d gousto -c recipes --type csv --file ~/Desktop/recipe-data-copy.csv --headerline

var recipeSchema = new mongoose.Schema({
	box_type: String,
	title: { type: String, required: true },
	rating: { type: Number, "default": 0, min: 0, max: 5 },
	slug: String,
	short_title: String,
	marketing_description: String,
	calories_kcal: Number,
	protein_grams: Number,
	carbs_grams: Number,
	fat_grams: Number,
	bulletpoint1: String,
	bulletpoint2: String,
	bulletpoint3: String,
	recipe_diet_type_id: String,
	season: String,
	base: String,
	protein_source: String,
	preparation_time_minutes: Number,
	shelf_life_days: Number,
	equipment_needed: String,
	origin_country: String,
	recipe_cuisine: {
		type: String,
		required: true
	},
	in_your_box: String,
	gousto_reference: Number,
	created_at: String,
	updated_at: String
});

// Include paginate module
recipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Recipe', recipeSchema);
