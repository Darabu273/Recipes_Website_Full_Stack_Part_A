const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getIngredientsInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/ingredientWidget.json`, {
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let recipe_ingred = await getIngredientsInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, instructions } = recipe_info.data;
    let {ingredients} = recipe_ingred.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        ingredients: ingredients,
        servings: servings,
        instructions: instructions,
        
    }
  }

    function getSpecificDataFromRecipee(recipee) {
        let {
          id,
          title,
          readyInMinutes,
          image,
          aggregateLikes,
          vegan,
          vegetarian,
          glutenFree,
        } = recipee;
      
        return {
          id: id,
          title: title,
          readyInMinutes: readyInMinutes,
          image: image,
          popularity: aggregateLikes,
          vegan: vegan,
          vegetarian: vegetarian,
          glutenFree: glutenFree,
        };
      }
      
      async function getRandomRecipee(numb) {
        return await axios.get(`${api_domain}/random`, {
          params: {
            number: numb,
            apiKey: process.env.spooncular_apiKey,
          },
        });
      }
      
      async function getRandomRecipeeDetails(numb) {
        recipee_random_list = [];
        let recipees_info = await getRandomRecipee(numb);
        recipees_info.data.recipes.map((recipee) =>
          recipee_random_list.push(getSpecificDataFromRecipee(recipee))
        );
      
        return recipee_random_list;
      }
      
      async function markAsSeen(user_id, recipe_id) {
        await DButils.execQuery(
          `insert into mydb.lastrecipee values ('${user_id}','${recipe_id}',NOW())`
        );
      }
      
      async function getLastRecipee(user_id, numb) {
        let arr = await DButils.execQuery(
          `SELECT recipe_id FROM mydb.lastrecipee where user_id='${user_id}' ORDER BY date DESC LIMIT ${numb}`
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
          recipee_last_list.push(getRecipeDetails(element))
        );
        result = Promise.all(recipee_last_list);
        console.log(result);
      
        return result;
      }
      
      exports.getRecipeDetails = getRecipeDetails;
      exports.getRandomRecipeeDetails = getRandomRecipeeDetails;
      exports.getLastRecipeeDetails = getLastRecipeeDetails;
      exports.markAsSeen = markAsSeen;
