# Cuisine

The technical infrastructure includes an API Gateway. The gateway offers a number of recipe operations. Recipes contain a lot of
information such as cuisine, customer ratings & comments, stock levels and diet types.

REST API built upon Node.js using Express Framework. The data is saved in a MongoDB using Mongoose Schema. Unit test are developed using Mocha and Chai. 

## Functional Requirements

* Fetch a recipe by id
* Fetch all recipes for a specific cuisine (should paginate)
* Rate an existing recipe between 1 and 5
* Update an existing recipe
* Store a new recipe

## Install

```shell
 git clone https://github.com/giuly/gousto.git
 cd gousto 
 npm install
 nodemon
```
## Test

```shell
 npm test
```
