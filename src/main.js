// letters to use for initial recipes loaded - excluding letters with null results
const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "r",
  "s",
  "t",
  "v",
  "w",
  "y",
];

// Elements
const input = document.querySelector("#search-input");
const searchType = document.querySelector("#search-type");
const searchBtn = document.querySelector("#search-btn");
const searchCategories = document.querySelector("#search-categories");
const searchAreas = document.querySelector("#search-areas");
const recipesContainer = document.querySelector(".recipes-container");
const loadMoreBtn = document.querySelector("#load-more-btn");
const suggestionHeader = document.querySelector(".suggestion-header");
const preLoader = document.querySelector(".pre-loader");

const pages = ["recipes", "favorites", "recipe"];
const currentPage = [pages[0]];
let recipes = [];
const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];

class Recipe {
  constructor(data) {
    this.recipe = this.formatData(data);
  }

  formatData(data) {
    const recipe = {};
    const ingredients = [];
    const measures = [];
    for (let key in data) {
      if (data[key] !== "" && data[key] !== null) {
        if (key.toLowerCase().includes("ingredient")) {
          ingredients.push(data[key]);
          recipe["ingredients"] = [...ingredients];
          continue;
        }
        if (key.toLowerCase().includes("measure")) {
          measures.push(data[key]);
          recipe["measures"] = [...measures];
          continue;
        }

        if (key.toLowerCase() === "idmeal") {
          recipe["id"] = data[key];
          continue;
        }

        if (key === "strInstructions") {
          const instructions = data[key].replace(/(\r\n|\r|\n)/, " ");
          recipe["instructions"] = instructions;
          continue;
        }

        recipe[
          key.includes("str") ? key.toLowerCase().replace("str", "") : key
        ] = data[key];
      }
    }

    return recipe;
  }
}

class UI {
  static updateDOM(_recipes) {
    let recipesInDOM = "";
    _recipes.forEach((recipe) => {
      recipesInDOM += this.formatRecipesDOM(recipe);
    });
    preLoader.classList.add("hidden");
    recipesContainer.innerHTML = recipesInDOM;
  }

  static formatRecipesDOM(recipe) {
    return `
      <div class="recipe-card">
              <div class="recipe-image">
                <img
                  class="w-full h-[260px] object-cover"
                  src="${recipe.mealthumb}"
                  alt="Recipe 1"
                />
              </div>
              <div class="recipe-content mt-5">
                <h2>
                  <a class="recipe-title text-3xl font-Lora" href="#"
                    >S${recipe.meal}</a
                  >
                </h2>
                <p
                  class="recipe-desc line-clamp-4 mt-4 text-LightGray text-justify"
                >
                ${recipe.instructions}
                </p>
                <div class="flex justify-between items-center mt-3">
                  <a
                    href="#"
                    class="learn-more text text-TomatoRed hover:text-TomatoRed-Hover hover-effect"
                    >Learn More</a
                  >
                  <button
                    class="add-favorite bg-SoftBrown text-white rounded-full py-2 px-4 text-xs hover:bg-SoftBrown/90 hover-effect cursor-pointer"
                  >
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div> 
    `;
  }
}

class API {
  static async getRecipesByFirstLetter(letter) {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=` + letter
    );
    const data = await response.json();
    for (let x of data.meals) {
      const { recipe } = new Recipe(x);
      recipes.push(recipe);
    }
    UI.updateDOM(recipes);
  }
}

// load recipes
window.addEventListener("DOMContentLoaded", () => {
  API.getRecipesByFirstLetter(randomLetter);
});
