var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
//const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 *
 * SAVE RECIPE AS FAVORITE
 */
router.post("/favorites", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 *
 * RETRIEVE RECIPE FROM FAVORITE
 */
router.get("/favorites", async (req, res, next) => {
  try {
    const recipees = await user_utils.getFavoriteRecipeeDetails(
      req.session.user_id
    );
    res.status(200).send(recipees);
  } catch (error) {
    next(error);
  }
});

router.get("/myrecipe/:recipeId", async (req, res, next) => {
  try {
    const recipees = await user_utils.getMyRecipeeDetailWithRecipeId(req.session.user_id, req.params.recipeId);
    res.send(recipees);
  } catch (error) {
    next(error);
  }
});

router.get("/myrecipe", async (req, res, next) => {
  try {
    const recipees = await user_utils.getMyRecipeeDetails(req.session.user_id);
    res.status(200).send(recipees);
  } catch (error) {
    next(error);
  }
});

router.post("/myrecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const image = req.body.image;
    const popularity = req.body.popularity;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const glutenFree = req.body.glutenFree;
    const servings = req.body.servings;
    const Instructions = req.body.Instructions;
    //I didnt add analyzedInstructions to myrecipe we need rememder to update the swagger.
    const IngredientsList = req.body.IngredientsList;
    //I didnt add extendedIngredients --need to check how it is diffrent from what we do. and if we keep it neww to update the swagger

    await user_utils.addPersonalRecipee(
      user_id,
      title,
      readyInMinutes,
      image,
      popularity,
      vegan,
      vegetarian,
      glutenFree,
      servings,
      Instructions,
      //analyzedInstructions,
      IngredientsList
    );
    res.status(200).send("The Recipe was successfully saved as a personal recipe");
  } catch (error) {
    next(error);
  }
});

router.get("/family", async (req, res, next) => {
  try {
    const recipees = await user_utils.getMyFamilyRecipeeDetails(req.session.user_id);
    res.status(200).send(recipees);
  } catch (error) {
    next(error);
  }
});

router.get("/lastSeenRecipe/:numb", async (req, res, next) => {
  try {
    let recipees = await user_utils.getLastRecipeeDetails(req.session.user_id,req.params.numb);
    console.log(recipees)
    res.status(200).send(recipees);
  } catch (error) {
    next(error);
  }
});


router.post("/lastSeenRecipe", async (req, res, next) => {
  try {
    const recipeId = req.body.recipeId;
    const recipees = await user_utils.markAsSeen(req.session.user_id, recipeId);
    res.status(200).send("The Recipe was successfully saved as a last seen recipe");;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
