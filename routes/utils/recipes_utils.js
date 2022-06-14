const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");
const user_utils = require("./user_utils");

/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info
 */

async function getRecipeInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/information`, {
    params: {
      includeNutrition: false,
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

async function getIngredientsInformation(recipe_id) {
  return await axios.get(`${api_domain}/${recipe_id}/ingredientWidget.json`, {
    params: {
      apiKey: process.env.spooncular_apiKey,
    },
  });
}

async function getRecipeDetails(recipe_id, user_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  let recipe_ingred = await getIngredientsInformation(recipe_id);
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
    servings,
    instructions,
  } = recipe_info.data;
  let { ingredients } = recipe_ingred.data;
  
  
  //check if this recipe is in favorite 
  //get the recipe id from the db
  array_of_favorite_db = await user_utils.getFavoriteRecipes(user_id);
  let array_of_favorite = [];
  //extracting the recipe ids into array
  array_of_favorite_db.map((element) => array_of_favorite.push(element.recipe_id)); 
  flagFavorite = checkIfIdInArray(id,array_of_favorite);
  
  //get the recipe id from the db
  array_of_lastseen_db = await user_utils.getAllLastRecipee(user_id);
  let array_of_lastseen = [];
  //extracting the recipe ids into array
  array_of_lastseen_db.map((element) => array_of_lastseen.push(element.recipe_id)); 
  flagLastSeen = checkIfIdInArray(id,array_of_lastseen);

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
    flagInFavorite : flagFavorite,
    flagInLastSeen : flagLastSeen
  };
}

//this function get a preview from recipe_id
async function getRecipePreviewFromRecipeId(recipe_id, user_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    
    let {
      id,
      title,
      readyInMinutes,
      image,
      aggregateLikes,
      vegan,
      vegetarian,
      glutenFree
    } = recipe_info.data;
    

    //check if this recipe is in favorite 
    //get the recipe id from the db
    array_of_favorite_db = await user_utils.getFavoriteRecipes(user_id);
    let array_of_favorite = [];
    //extracting the recipe ids into array
    array_of_favorite_db.map((element) => array_of_favorite.push(element.recipe_id)); 
    flagFavorite = checkIfIdInArray(id,array_of_favorite);
    
    //get the recipe id from the db
    array_of_lastseen_db = await user_utils.getAllLastRecipee(user_id);
    let array_of_lastseen = [];
    //extracting the recipe ids into array
    array_of_lastseen_db.map((element) => array_of_lastseen.push(element.recipe_id)); 
    flagLastSeen = checkIfIdInArray(id,array_of_lastseen);
  
    return {
      id: id,
      title: title,
      readyInMinutes: readyInMinutes,
      image: image,
      popularity: aggregateLikes,
      vegan: vegan,
      vegetarian: vegetarian,
      glutenFree: glutenFree,
      flagInFavorite : flagFavorite,
      flagInLastSeen : flagLastSeen
    };
  }


  //this function get a preview from recipe_id
async function getRecipePreviewandInstructionFromRecipeId(recipe_id, user_id) {
  let recipe_info = await getRecipeInformation(recipe_id);
  
  
  let {
    id,
    title,
    readyInMinutes,
    image,
    aggregateLikes,
    vegan,
    vegetarian,
    glutenFree,
    instructions
  } = recipe_info.data;
  
  

  //check if this recipe is in favorite 
  //get the recipe id from the db
  array_of_favorite_db = await user_utils.getFavoriteRecipes(user_id);
  let array_of_favorite = [];
  //extracting the recipe ids into array
  array_of_favorite_db.map((element) => array_of_favorite.push(element.recipe_id)); 
  flagFavorite = checkIfIdInArray(id,array_of_favorite);
  
  //get the recipe id from the db
  array_of_lastseen_db = await user_utils.getAllLastRecipee(user_id);
  let array_of_lastseen = [];
  //extracting the recipe ids into array
  array_of_lastseen_db.map((element) => array_of_lastseen.push(element.recipe_id)); 
  flagLastSeen = checkIfIdInArray(id,array_of_lastseen);

  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    instructions: instructions,
    flagInFavorite : flagFavorite,
    flagInLastSeen : flagLastSeen
  };
}


//this function check if an id is in an array
function checkIfIdInArray(id, array_of_id){
    for (let i = 0; i < array_of_id.length; i++) {
        if(id == array_of_id[i]){
            return true
        }
      }
    return false
}

//this function get a preview from a whole recipe 
async function getSpecificDataFromRecipee(recipee, user_id) {
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

  //check if this recipe is in favorite 
  //get the recipe id from the db
  array_of_favorite_db = await user_utils.getFavoriteRecipes(user_id);
  let array_of_favorite = [];
  //extracting the recipe ids into array
  array_of_favorite_db.map((element) => array_of_favorite.push(element.recipe_id)); 
  flagFavorite = checkIfIdInArray(id,array_of_favorite);
  
  //get the recipe id from the db
  array_of_lastseen_db = await user_utils.getAllLastRecipee(user_id);
  let array_of_lastseen = [];
  //extracting the recipe ids into array
  array_of_lastseen_db.map((element) => array_of_lastseen.push(element.recipe_id)); 
  flagLastSeen = checkIfIdInArray(id,array_of_lastseen);
  
  return {
    id: id,
    title: title,
    readyInMinutes: readyInMinutes,
    image: image,
    popularity: aggregateLikes,
    vegan: vegan,
    vegetarian: vegetarian,
    glutenFree: glutenFree,
    flagInFavorite : flagFavorite,
    flagInLastSeen : flagLastSeen
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

async function getRandomRecipeeDetails(numb, user_id) {
  recipee_random_list = [];
  let recipees_info = await getRandomRecipee(numb);
  recipees_info.data.recipes.map((recipee) =>
    recipee_random_list.push(getSpecificDataFromRecipee(recipee, user_id))
  );
  result = Promise.all(recipee_random_list);

  return result;
}

// async function markAsSeen(user_id, recipe_id) {
//   await DButils.execQuery(
//     `insert into mydb.lastrecipee values ('${user_id}','${recipe_id}',NOW())`
//   );
// }

// async function getAllLastRecipee(user_id) {
//     let arr = await DButils.execQuery(
//       `SELECT recipe_id FROM mydb.lastrecipee where user_id='${user_id}'`
//     );
//     return arr;
// }

// async function getLastRecipee(user_id, numb) {

//   let arr = await DButils.execQuery(
//     `SELECT recipe_id FROM mydb.lastrecipee where user_id=${user_id} ORDER BY date DESC LIMIT ${numb}`
//   );
//   return arr;
// }

// async function getLastRecipeeDetails(user_id, numb) {
//   //get last recepee
//   let recipes_id = await getLastRecipee(user_id, numb);
//   //get the ids of the last recepees
//   let recipes_id_array = [];
//   recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
//   //get the list of recepees from the list of ids
//   let recipee_last_list = [];
//   recipes_id_array.map((element) =>
//     recipee_last_list.push(getRecipePreviewFromRecipeId(element, user_id))
//   );
//   result = Promise.all(recipee_last_list);
//   console.log(result);

//   return result;
// }


 function extractPreviewRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
            instructions,
        } = data;

        // //check if this recipe is in favorite 
        // //get the recipe id from the db
        // array_of_favorite_db = await user_utils.getFavoriteRecipes(user_id);
        // let array_of_favorite = [];
        // //extracting the recipe ids into array
        // array_of_favorite_db.map((element) => array_of_favorite.push(element.recipe_id)); 
        // flagFavorite = checkIfIdInArray(id,array_of_favorite);
        
        // //get the recipe id from the db
        // array_of_lastseen_db = await user_utils.getAllLastRecipee(user_id);
        // let array_of_lastseen = [];
        // //extracting the recipe ids into array
        // array_of_lastseen_db.map((element) => array_of_lastseen.push(element.recipe_id)); 
        // flagLastSeen = checkIfIdInArray(id,array_of_lastseen);
  




        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            instructions: instructions
            // flagInFavorite : flagFavorite,
            // flagInLastSeen : flagLastSeen
        }
    })
  }

async function getRecipesPreview(recipes_ids_list, user_id) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    info_res.map((recp)=>{console.log(recp.data)});
    // console.log(info_res);
    return getSpecificDataFromRecipee(info_res, user_id);
  }

async function getSimilarRecipes(q, numtoReturn, cuisine, diet, intolerances, user_id) {
    const test =  await axios.get(`${api_domain}/complexSearch`, {
        params: {
          query: q,
          number: numtoReturn,
          cuisine: cuisine,
          diet: diet,
          intolerances: intolerances,
          apiKey: process.env.spooncular_apiKey
        }
    });
    let Relevant_results = test.data.results;
    let recipes_id_array = [];


    Relevant_results.map((element) => recipes_id_array.push(element["id"])); //extracting the recipe ids into array
    console.log(recipes_id_array)

    let recipee_details_list = [];
    recipes_id_array.map((element) => recipee_details_list.push(getRecipePreviewandInstructionFromRecipeId(element, user_id)));
    result = Promise.all(recipee_details_list);



    //let finalResult = getRecipesPreview(recipes_id_array, user_id);
    return result;
}




exports.getRecipeDetails = getRecipeDetails;
exports.getRandomRecipeeDetails = getRandomRecipeeDetails;
// exports.getLastRecipeeDetails = getLastRecipeeDetails;
// exports.markAsSeen = markAsSeen;
exports.getSpecificDataFromRecipee = getSpecificDataFromRecipee;
exports.getRecipePreviewFromRecipeId = getRecipePreviewFromRecipeId;
exports.getSimilarRecipes = getSimilarRecipes;
// exports.getRecipePreviewFromRecipeId = getRecipePreviewFromRecipeId;
