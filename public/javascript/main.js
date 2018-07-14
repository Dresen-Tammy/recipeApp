    // Log in user
function loginUser() {
    // get variables
    var username = document.querySelector('#username').value,
        password = document.querySelector('#password').value;
        if (!username || !password) {
            document.querySelector('.error').innerText = "Please fill in all fields."
            return;
        }
        // perform AJAX request using get()
        $.post('/login', 
            {
                username: username,
                password: password
            }).done(function(result, status) {
            if (result.chef_id !== undefined) {
                window.location.href = '/'; 
            } else {
                document.querySelector('.error').innerText = "Username or password is incorrect."
            }
        }).fail(function(xhr, status, error) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            document.querySelector('.error').innerText = response.message ;
        })
    }


// register user
function registerUser() {
    const message = document.querySelector('.error');
    message.innerText = ""
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    if (username == "" || password == "") {
        message.innerText = "Please fill in all fields"; 
    } else {
        $.post('/register', //url
    { username: username, // data
      password: password
    }).done(function(result, status){
        console.log('registration worked');
        message.innerText = `Thanks for registering, ${result.username}. Please Login.`
        
    }).fail(function(xhr, status, error) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        message.innerText = response.message;
    }) 
    }
    
}

// logout
function logout() {
    document.querySelector('.error').innertext = "";
    $.get('/logout', (result)=> {
        window.location.href = '/';
    }).fail(function(xhr, status, error) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        document.querySelector('.error').innertext = response.message;
    })
}

    // get list of recipes from Food2Fork API
function searchRecipes() {
    const message = document.querySelector('.error');
    message.innerText = "";
    const keyword = document.querySelector('#keyword').value;
    if (keyword == "") {
        document.querySelector('.error').innerText = "Please enter a search keyword."
        return;
    }
    const target = `api/searchRecipes/${keyword}/1`
    $.get(target, function(res){
        var list = res.recipes;
        message.innerText = "Search Results";
        renderList(list);
    }).fail(function(ERROR){
        message.innerText = "There was an error searching for recipes.";
    })
}
// get one recipe from Food2Fork API
// TODO: get one recipe by recipe_id and display recipe with link to instructions.
function viewRecipe(e) {
    document.querySelector('.error').innerText = "";
    const recipe_id = e.currentTarget.attributes[1].value;
    const target = 'api/viewRecipe/' + recipe_id;
    $.get(target, (res)=>{
        // success render recipe 
        displayRecipe(res.recipe);
    }).fail((ERROR)=>{
        document.querySelector('.error').innerText = "There was an error displaying the recipe.";
    // error
    })
}
// display 1 recipe
function displayRecipe(recipe) {
    // create recipe tile elements
    document.querySelector('.error').innerText = "";
    const li = document.createElement('li'),
          liClass = document.createAttribute('class'),
          card = document.createElement('div'),
          cardClass = document.createAttribute('class'),
          img = document.createElement('img'),
          imgClass = document.createAttribute('class'),
          imgSrc = document.createAttribute('src'),
          imgAlt = document.createAttribute('alt'),
          div = document.createElement('div'),
          divClass = document.createAttribute('class'),
          h3 = document.createElement('h3'),
          h3Text = document.createTextNode('Ingredients:'),
          faveButton = document.createElement('button'),
          ul = document.createElement('ul'),
          ulClass = document.createAttribute('class'),
          ingredients = recipe.ingredients,
          a = document.createElement('a'),
          aHref = document.createAttribute('href'),
          aTarget = document.createAttribute('target'),
          aText = document.createTextNode('Directions'),
          p = document.createElement('p'),
          pText = document.createTextNode("Publisher: " + recipe.publisher),
          h2 = document.createElement('h2'),
          h2Text = document.createTextNode(recipe.title)
          title = document.createTextNode("Add to Favorites"), // favorite text
          id = document.createAttribute("id"),
          span = document.createElement('span'),
          fa = document.createAttribute("class"),
          cls2 = document.createAttribute("class");
    let ingred;
    // create class
    liClass.value = 'one-recipe';
    li.setAttributeNode(liClass);
    // heading
    h2.appendChild(h2Text);
    li.appendChild(h2);
    id.value = recipe['recipe_id'] + 'fav';
    // add button items
    const recipeTile = document.getElementById(recipe['recipe_id']);
    if (recipeTile.classList.contains('favorited')) {
        faveButton.addEventListener('click', deleteFaveHero);
        cls2.value = 'favorite herofave favorited';
    } else {
        faveButton.addEventListener('click', addFaveHero);
        cls2.value = 'favorite herofave';
    }
    // button heart
    fa.value = "fa fa-heart"
    span.setAttributeNode(fa);
    faveButton.setAttributeNode(id);
    faveButton.appendChild(span);
    
    // add custom attributes for saving to favorites
    var image_url = document.createAttribute("data_image");
    image_url.value = recipe['image_url'];// HERE
    var title = document.createAttribute("data_title");
    title.value = recipe['title'];
    faveButton.setAttributeNode(image_url);
    faveButton.setAttributeNode(title);
    faveButton.setAttributeNode(cls2);
    li.appendChild(faveButton);
    cardClass.value = 'info';
    card.setAttributeNode(cardClass);
    imgClass.value = 'one-image';
    img.setAttributeNode(imgClass);
    imgSrc.value = recipe.image_url;
    img.setAttributeNode(imgSrc);
    imgAlt.value = recipe.title;
    img.setAttributeNode(imgAlt);
    card.appendChild(img);
    // create information
    divClass.value = 'one-info';
    div.setAttributeNode(divClass);
    h3.appendChild(h3Text);
    div.appendChild(h3);
    ulClass.value = 'one-list';
    ul.setAttributeNode(ulClass);
    for (let i=0; i<ingredients.length; i++) {
        ingred = document.createElement('li');
        let text = document.createTextNode(ingredients[i]);
        ingred.appendChild(text);
        ul.appendChild(ingred);
    }
    div.appendChild(ul);
    aHref.value = recipe.source_url;
    aTarget.value = "_blank";
    a.setAttributeNode(aHref);
    a.setAttributeNode(aTarget);
    a.appendChild(aText);
    div.appendChild(a);
    card.appendChild(div);
    li.appendChild(card);
    imgAlt.value = recipe.title;
    img.setAttributeNode(imgAlt);
    const hero = document.querySelector('.hero');
    $(".one-recipe").remove();
    hero.appendChild(li);
   $('html, body').animate({scrollTop: $("#hero").offset().top}, 'slow');
}


// get favorites from database() {
function getFavorites() {
    document.querySelector('.error').innerText = "";
    $.get('recipes/getFavorites', function(res){
        
        document.querySelector('.galleryTitle').innerText = "Favorite Recipes";
        renderFavorites(res);
    }).fail(function(ERROR){
        document.querySelector('.error').innerText = "Error getting favorites";
    })
}
// add favorite to database and change heart red
function addFave(e) {
    document.querySelector('.error').innerText = "";
    console.log(e.currentTarget.id);
    const recipe_id = e.currentTarget.id;
    const title = e.currentTarget.attributes[2].value;
    const image_url = e.currentTarget.attributes[1].value;
    if (recipe_id == null || recipe_id == "" ||title == null || title == "" ||image_url == null || image_url == "") {
        console.log(err);
        return;
    }
    $.post('recipes/addFavorite', //url
        { recipe_id: recipe_id, // data
          image_url: image_url,
          title: title,
        }).done(function(result,status){
            
            const heart = document.getElementById(result.recipe_id);
            if (!heart.classList.contains('favorited')) {
                heart.classList.add('favorited')
                heart.removeEventListener('click', addFave);
                heart.addEventListener('click', removeFaveSearch);
            }
            const heartHero = document.getElementById(result.recipe_id + "fav");
            if (heartHero) {
                if (!heartHero.classList.contains('favorited')) {
                    heartHero.classList.add('favorited')
                    heartHero.removeEventListener('click', addFaveHero);
                    heartHero.addEventListener('click', deleteFaveHero);
                }
            }
        }).fail(function(xhr, status, error) {
            document.querySelector('.error').innerText = "Error adding recipe to favorite list."
        }) 
}
function addFaveHero(e) {
    document.querySelector('.error').innerText = "";
    console.log(e.currentTarget.id);
    const hero_recipe_id = e.currentTarget.id;
    const recipe_id = hero_recipe_id.slice(0, -3);
    const title = e.currentTarget.attributes[2].value;
    const image_url = e.currentTarget.attributes[1].value;
    if (recipe_id == null || recipe_id == "" ||title == null || title == "" ||image_url == null || image_url == "") {
        console.log(err);
        return;
    }
    $.post('recipes/addFavorite', //url
        { recipe_id: recipe_id, // data
          image_url: image_url,
          title: title,
        }).done(function(result,status){
            
            const heart = document.getElementById(result.recipe_id);
            const heartHero = document.getElementById(result.recipe_id + "fav");
            if (heart) {
                if (!heart.classList.contains('favorited')) {
                heart.classList.add('favorited')
                heart.removeEventListener('click', addFave);
                heart.addEventListener('click', removeFaveSearch);
                }
            }
            if (!heartHero.classList.contains('favorited')) {
                heartHero.classList.add('favorited')
                heartHero.removeEventListener('click', addFaveHero);
                heartHero.addEventListener('click', deleteFaveHero);
            }
            
        }).fail(function(xhr, status, error) {
            document.querySelector('.error').innerText = "Error adding recipe to favorite list."
        }) 
}

// delete recipe from favorite in database and rerender favorite display.
function removeFave(e) {
    document.querySelector('.error').innerText = "";
    const recipe_id = e.currentTarget.id;
    if (recipe_id) {
        $.ajax({
            type: 'DELETE',
            url: 'recipes/deleteFavorite',
            data: {
                recipe_id: recipe_id,
            }
        }).done(function(result){
            console.log("deleted");
            const tile = document.getElementsByClassName(result.recipe_id);
            if (tile[0] !== undefined) {
            tile[0].parentNode.removeChild(tile[0]);
            }
            const heartHero = document.getElementById(result.recipe_id + "fav");
            if (heartHero) {
                if (heartHero.classList.contains('favorited')) {
                    heartHero.classList.remove('favorited')
                    heartHero.removeEventListener('click', deleteFaveHero);
                    heartHero.addEventListener('click', addFaveHero);
                }
            }
        }).fail(function(xhr, status, error){
            document.querySelector('.error').innerText("Error deleting recipe from favorites.")
        })
    }
}
function deleteFaveHero(e) {
    document.querySelector('.error').innerText = "";
    const hero_recipe_id = e.currentTarget.id;
    const recipe_id = hero_recipe_id.slice(0, -3);
    if (recipe_id) {
        $.ajax({
            type: 'DELETE',
            url: 'recipes/deleteFavorite',
            data: {
                recipe_id: recipe_id,
            }
        }).done(function(result){
            console.log("deleted");
            // remove recipeTile
            const tile = document.getElementsByClassName(result.recipe_id);
            const title = document.getElementById(result.recipe_id);
            if (tile[0] !== undefined ) {
                if (title && !title.attributes[2]) {
                    tile[0].parentNode.removeChild(tile[0]);
                }
            }
            //renderFavorites(result);
            const heart = document.getElementById(result.recipe_id);
            if (heart) {
                if (heart.classList.contains('favorited')) {
                    heart.classList.remove('favorited');
                    heart.removeEventListener('click', removeFaveSearch);
                    heart.addEventListener('click', addFave);
                }
            }
            const heartHero = document.getElementById(result.recipe_id + "fav");
            if (heartHero.classList.contains('favorited')) {
                heartHero.classList.remove('favorited')
                heartHero.removeEventListener('click', deleteFaveHero);
                heartHero.addEventListener('click', addFaveHero);
            }
        }).fail(function(xhr, status, error){
            document.querySelector('.error').innerText("Error deleting recipe from favorites.");
        })
    }
}
// delete recipe from favorite in database when search result is showing.
function removeFaveSearch(e) {
    document.querySelector('.error').innerText = "";
    const recipe_id = e.currentTarget.id;
    if (recipe_id) {
        $.ajax({
            type: 'DELETE',
            url: 'recipes/deleteFavoriteSearch',
            data: {
                recipe_id: recipe_id,
            }
        }).done(function(result){
            console.log("deleted");
            const heart = document.getElementById(result.recipe_id);
            if (heart) {
                if (heart.classList.contains('favorited')) {
                    heart.classList.remove('favorited');
                    heart.removeEventListener('click', removeFaveSearch);
                    heart.addEventListener('click', addFave);
                }
            }
            const heartHero = document.getElementById(result.recipe_id + "fav");
            if (heartHero) {
                heartHero.classList.remove('favorited')
                heartHero.removeEventListener('click', deleteFaveHero);
                heartHero.addEventListener('click', addFaveHero);
            }
        }).fail(function(xhr, status, error){
            document.querySelector('.error').innerText("Error deleting recipe from favorites.");
        })
    }
}
// deliver list items one at a time from F2F list to renderRecipes then display on page
function renderList(list) {
    var recipes = list.map(recipe => {
        return renderRecipes(recipe);
    });
    console.log(recipes);
    var ul = document.querySelector('.recipeList');
    $("li").remove();
    recipes.forEach(recipe => {
        ul.appendChild(recipe);
    })
    
            
}

// deliver list items individually from favorite table to renderFavoriteList then display on page
function renderFavorites(list) {
    var recipes = list.map(recipe => {
        return renderFavoriteList(recipe);
    })
    console.log(recipes);
    var ul = document.querySelector('.recipeList');
    $("li").remove();
    recipes.forEach(recipe => {
        ul.appendChild(recipe);
    })

}
// turn each list item from F2F into recipe tile
function renderRecipes(recipe) {
        const li = createRecipeTile(recipe);
        const faveButton = createFaveButton(recipe);
        var image_url = document.createAttribute("data_image");
            image_url.value = recipe['image_url'];
            faveButton.setAttributeNode(image_url);
        var title = document.createAttribute("data_title");
            title.value = recipe['title'];
            faveButton.setAttributeNode(title);
        faveButton.addEventListener('click', addFave); 
        var cls2 = document.createAttribute("class");
            cls2.value = 'favorite';
            faveButton.setAttributeNode(cls2);
            // add favorite button to tile
        li.appendChild(faveButton);
        return li;
}

// creates recipe tiles from individual favorite recipes
// same as render recipes except faveButton event removes from favorites.
// also has data_id and recipe_id for ad
function renderFavoriteList(recipe) {
    const li = createRecipeTile(recipe);
    const faveButton = createFaveButton(recipe);
    var cls2 = document.createAttribute("class");
        cls2.value = 'favorite favorited'; // DIFFERENT
        faveButton.setAttributeNode(cls2);
    li.appendChild(faveButton);
    faveButton.addEventListener('click', removeFave);
    return li;
    
    
}
function createRecipeTile(recipe) {
    var li = document.createElement("li"); 
        // create and add class to tile
        var cls = document.createAttribute("class"); 
            cls.value = 'recipeTile ' + recipe['recipe_id'];
            li.setAttributeNode(cls);
        // add background image to tile
        li.style.backgroundImage = "url(" + recipe['image_url'] + ")";
        li.style.backgroundSize = "cover";
        li.style.backgroundPosition = "center center";
        var viewButton = document.createElement('button');
        var text = document.createTextNode(recipe['title']);
            viewButton.appendChild(text);
        viewButton.addEventListener('click', viewRecipe);
        var cls3 = document.createAttribute("class");
            cls3.value = 'viewButton';
            viewButton.setAttributeNode(cls3);
        var rid = document.createAttribute("data_id");
            rid.value = recipe['recipe_id'];
            viewButton.setAttributeNode(rid);
        // add view recipe button to tile
        li.appendChild(viewButton);
        // return tile to calling function
        return li;
}
function createFaveButton(recipe) {
    var faveButton = document.createElement("button"); // favorite button
    var id = document.createAttribute("id");
        id.value = recipe['recipe_id'];
        faveButton.setAttributeNode(id); 
    var span = document.createElement('span');
    var fa = document.createAttribute("class");
        fa.value = "fa fa-heart"
        span.setAttributeNode(fa);
        faveButton.appendChild(span);
    return faveButton;
}



