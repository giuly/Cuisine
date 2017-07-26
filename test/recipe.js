//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// workintech@gousto.co.uk

var mongoose = require('mongoose');
var Recipe = require('../api/models/recipes');

var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Recipe', function() {

	/* Test the /GET route for a specific cuisine*/
	describe('/GET?cousine=italian&page=1 recipe for italian cuisine', function() {
		it('it should GET all recipes', function(done) {
			chai.request(app)
				.get('/api/recipe')
				.query('cousine=italian')
				.query('page=1')
				.end(function(err, res) {
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});
	});

	/* Test a /POST route */
	describe('/POST recipe', function() {
		it('it should not post a recipe without `recipe_cuisine`, mandatory field', function(done) {
			var recipe = {
				title: "Dummy Recipe",
				marketing_description: "Dummy description",
				calories_kcal: 10
			}

			chai.request(app)
				.post('/api/recipe')
				.send(recipe)
				.end(function(err, res) {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.errors.should.have.property('recipe_cuisine');
					res.body.errors.recipe_cuisine.should.have.property('kind').eql('required');
					done();
				})
		})
	})

	/* Test a /GET recipe by id */
	describe('/GET:idRecipe recipe by id', function() {
		it('it should GET a recipe for given id', function(done) {
			var recipe = new Recipe({ title: 'Test Get Recipe', marketing_description: 'Test Get Recipe Description', recipe_cuisine: 'test' });
			
			recipe.save(function(err, recipe) {
				chai.request(app)
					.get('/api/recipe/' + recipe._id)
					.end(function(err, res) {
						res.should.have.status(200)
						res.body.should.be.a('object');
						done();
					});
				});
		})
	})

	/* Test a /PUT - update a recipe */
	describe('/PUT:idRecipe recipe by id', function() {
		it('it should PUT a recipe for given id', function(done) {
			var recipe = new Recipe({ title: 'Test Get Recipe', marketing_description: 'Test Get Recipe Description', recipe_cuisine: 'test' });

			recipe.save(function(err, recipe) {
				chai.request(app)
					.put('/api/recipe/' + recipe._id)
					.send({ title: 'Updated Title' })
					.end(function(err, res) {
						res.should.have.status(200);
						res.body.should.be.a('object')
						res.body.should.have.property('title').eql('Updated Title');
						done();
					})
			})
		})
	})

	/* Test a /POST - add recipe rating */
	describe('/POST rate a recipe', function() {
		it('it should POST recipe rating got given recipe id', function(done) {
			var recipe = new Recipe({ title: 'Test Get Recipe', marketing_description: 'Test Get Recipe Description', recipe_cuisine: 'test' });
				
			recipe.save(function(err, recipe) {
				chai.request(app)
					.post('/api/recipe/' + recipe._id)
					.send({ 'rating': 5 })
					.end(function(err, res) {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('rating').eql(5);
						done();
					})
			})
		})
	})
})