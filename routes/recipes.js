var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));



/* This path returns a full details of a recipe by its id:
 * - Details of preview details
 * - recipe's ingredient list
 * - number of servings
 * - instructions
 * */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
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
    const recipees = await recipes_utils.getRandomRecipeeDetails(
      req.params.numb
    );
    res.send(recipees);
  } catch (error) {
    next(error);
  }
});

router.get("/lastRecipee/show/:numb", async (req, res, next) => {
  try {
    const recipees = await recipes_utils.getLastRecipeeDetails(
      req.session.user_id,
      req.params.numb
    );
    res.status(200).send(recipees);
  } catch (error) {
    next(error);
  }
});

router.post("/lastRecipee/update/:recipee_id", async (req, res, next) => {
  try {
    const recipees = await recipes_utils.markAsSeen(
      req.session.user_id,
      req.params.recipee_id
    );
    res.send(recipees);
  } catch (error) {
    next(error);
  }
});

module.exports = router;