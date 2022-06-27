const DButils = require("./DButils");
const recipe_utils = require("./recipes_utils");


async function markAsSeen(user_id, recipe_id) {
  await DButils.execQuery(
    `insert into mydb.lastrecipee values ('${user_id}','${recipe_id}',NOW())`
  );
}

async function getAllLastRecipee(user_id) {
    let arr = await DButils.execQuery(
      `SELECT recipe_id FROM mydb.lastrecipee where user_id='${user_id}'`
    );
    return arr;
}

async function getLastRecipee(user_id, numb) {

  let arr = await DButils.execQuery(
    `SELECT recipe_id FROM mydb.lastrecipee where user_id=${user_id} ORDER BY date DESC LIMIT ${numb}`
  );
  return arr;
}

async function getLastRecipeeDetails(user_id, numb) {
  //get last recepee
  let recipes_id = await getLastRecipee(user_id, numb);
  //get the ids of the last recepees
  let recipes_id_array = [];
  recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
  //get the list of recepees from the list of ids
  let recipee_last_list = [];
  recipes_id_array.map((element) =>
    recipee_last_list.push(recipe_utils.getRecipePreviewFromRecipeId(element, user_id))
  );
  result = Promise.all(recipee_last_list);

  return result;
}


async function markAsFavorite(user_id, recipe_id) {
  await DButils.execQuery(
    `insert into mydb.favoriterecipee values ('${user_id}','${recipe_id}',NOW())`
  );
}

async function getFavoriteRecipes(user_id) {
  let arr = await DButils.execQuery(
    `SELECT recipe_id FROM mydb.favoriterecipee where user_id='${user_id}' ORDER BY date DESC`
  );
  return arr;
}

async function getFavoriteRecipeeDetails(user_id) {
  const recipes_id = await getFavoriteRecipes(user_id);
  let recipes_id_array = [];
  recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
  //get the recipes details from the list of recipe ids
  console.log(recipes_id_array);
  let recipee_favorite_list = [];
  recipes_id_array.map((element) =>
    recipee_favorite_list.push(recipe_utils.getRecipePreviewFromRecipeId(element, user_id))
  );
  result = Promise.all(recipee_favorite_list);
  console.log



  return result;
}

async function getPersonalRecipes(user_id) {
  let arr = await DButils.execQuery(
    `SELECT * FROM mydb.personalrecipee where user_id='${user_id}' `
  );
  return arr;
}
async function getMyRecipeeDetails(user_id) {
  //get the personal recipee from db
  const personal_recipes_from_db = await getPersonalRecipes(user_id);
  result = Promise.all(personal_recipes_from_db);
  //let recipes_id_array = [];
  //personal_recipes_from_db.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
  return result;
}


async function getSpecificPersonalRecipeWithRecipeId(user_id, recipe_id) {
  let arr = await DButils.execQuery(
    `SELECT * FROM mydb.personalrecipee where user_id='${user_id}' and id='${recipe_id}' LIMIT 1 `
  );
  return arr;
}
async function getMyRecipeeDetailWithRecipeId(user_id, recipe_id) {
  //get the personal recipee from db
  const personal_recipes_from_db = await getSpecificPersonalRecipeWithRecipeId(user_id,recipe_id);
  result = Promise.all(personal_recipes_from_db);
  //let recipes_id_array = [];
  //personal_recipes_from_db.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
  return result;
}


async function getFamilyRecipes(user_id) {
    let arr = await DButils.execQuery(
      `SELECT * FROM mydb.familyrecipee where user_id='${user_id}' `
    );
    return arr;
  }

async function getMyFamilyRecipeeDetails(user_id) {
    //get the personal recipee from db
    const personal_recipes_from_db = await getFamilyRecipes(user_id);
    result = Promise.all(personal_recipes_from_db);
    //let recipes_id_array = [];
    //personal_recipes_from_db.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    return result;
  }

async function addPersonalRecipee(user_id, title, readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,servings,Instructions,IngredientsList) {
    await DButils.execQuery(
        `INSERT INTO mydb.personalrecipee (user_id, title, readyInMinutes,image,popularity,vegan,vegetarian,glutenFree,servings,Instructions,IngredientsList) VALUES ('${user_id}', '${title}', '${readyInMinutes}',
        '${image}', '${popularity}', '${vegan}', '${vegetarian}', '${glutenFree}', '${servings}', '${Instructions}', '${IngredientsList}')`
      );
    
}

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFavoriteRecipeeDetails = getFavoriteRecipeeDetails;
exports.getMyRecipeeDetails = getMyRecipeeDetails;
exports.getMyRecipeeDetailWithRecipeId = getMyRecipeeDetailWithRecipeId;
exports.addPersonalRecipee = addPersonalRecipee;
exports.getMyFamilyRecipeeDetails = getMyFamilyRecipeeDetails;
exports.getLastRecipeeDetails = getLastRecipeeDetails;
exports.getAllLastRecipee = getAllLastRecipee 
exports.markAsSeen = markAsSeen;
