const searchinput = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
const closeDisplayPage = document.querySelector("#close-display-button");
const mealList = document.querySelector("#contain-image");
const mealCategory = document.querySelector(".meal-cat");
const header = document.querySelector(".header");
const form = document.querySelector(".form");

searchBtn.addEventListener("click", getMealList);
mealCategory.parentElement.addEventListener("click", (event) => {
  if (event.target.id === "close-display-button") {
    mealCategory.parentElement.classList.remove("display-recipe");
    document.querySelector(".section-header").style.display = "flex";
    mealCategory.innerHTML = "";
  }
});

getMealList();
function getMealList() {
  const searchinputValue = searchinput.value.trim();
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchinputValue}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        const mealsToShow = searchinputValue
          ? data.meals
          : data.meals.slice(0, 12);
        mealsToShow.forEach((meal) => {
          html += `
                <div class="image" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}"
                 class="main-display-image">
                    <h4>${meal.strMeal}</h4>
                <button type="button" id="recipe-btn" class ="recipe-btn">Get recipe</button>
            </div>`;
        });
        mealList.innerHTML = html;
        const getRecipeBtn = document.querySelectorAll("#recipe-btn");
        getRecipeBtn.forEach((btn) =>
          btn.addEventListener("click", displayMealRecipe)
        );
      } else {
        displayText.innerHTML = "sorry we didn't find your meal!";
      }
    });
}

function displayMealRecipe(event) {
  event.preventDefault();
  if (event.target.classList.contains("recipe-btn")) {
    let mealItem = event.target.parentElement;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        return mealRecipeModal(data.meals);
      });
  }
}

function mealRecipeModal(meal) {
  meal = meal[0];
  const html = `
    <button type="button" id="close-display-button">&times;</button>
    <div class="header2">
        <h2 class="meal-name">${meal.strMeal}</h2>
        <h3 class="recipe-category">${meal.strCategory}</h3>
        <h4>Instructions</h4>
    </div>
        <div class="Instructions">
            <p id="Instructions">${meal.strInstructions}</p>
        </div>
        <div class="video-link">
            <img src="${meal.strMealThumb}" class="recipe-image">
            <a href="${meal.strYoutube}" target="_blank">Watch video</a>
        </div>
    `;

  mealCategory.innerHTML = html;
  mealCategory.parentElement.classList.add("display-recipe");
  document.querySelector(".section-header").style.display = "none";
}
