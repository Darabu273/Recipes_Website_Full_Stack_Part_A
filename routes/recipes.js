var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
 

router.get("/", (req, res) => res.send("im here"));

/* 
*Search Recipes with the natural language, recipe search query.
*Number of recipes that will be repeated in the search: 5/10/15. The default is 5.
*We will be able to get around this on the client side.
*In addition it will be possible to filter according to lists: cuisine, diet and intolerance.
*The defualt is unfiltered.
*
* example: http://localhost:3000/recipes/search?query=pizza&num=4&cuisine=Italian
*/
router.get("/search", async (req, res, next) => {
  try {
    // User that logged in means he has session.user_id and we will save his last search. 
    if (req.session && req.session.user_id) {
      req.session.last_search = req.query.query;
    }

    queryWords = req.query.query;
    numtoReturn = req.query.num;
    cuisine = req.query.cuisine;
    diet = req.query.diet;
    intolerances = req.query.intolerances;
    user_id = req.session.user_id;

    let finalResult = await recipes_utils.getSimilarRecipes(queryWords, numtoReturn, cuisine, diet, intolerances, user_id);
    res.status(200).send(finalResult);

  }
  catch (error) {
    next(error)
  }
});



/* This path returns a full details of a recipe by its id:
 * - Details of preview details
 * - recipe's ingredient list
 * - number of servings
 * - instructions
 * - analyzedInstructions dar add after
 * */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId, req.session.user_id);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns 3 (actually, numb) random recipees
 */
router.get("/random/:numb", async (req, res, next) => {
  try {
    const recipees = await recipes_utils.getRandomRecipeeDetails(req.params.numb, req.session.user_id);
    res.send(recipees);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
