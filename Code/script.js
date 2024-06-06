// @ts-nocheck
var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "main.html"
        })
        .when("/recipe", {
            templateUrl: "search-recipe.html",
            controller: "recipeControl"
        })
        .when("/foodcheck", {
            templateUrl: "foodCheck.html",
            controller: "foodcheckControl"
        })
        .when("/nutrition", {
            templateUrl: "cookingredient-nutrition.html",
            controller: "cookingredient-nutritionControl"
        })
        .when("/health", {
            templateUrl: "healthingredient.html",
            controller: "healthingredientControl"
        })
        .when("/aboutus", {
            templateUrl: "aboutus.html"
        })
        .when("/ingredients", {
            templateUrl: "search-ingredient.html",
            controller: "ingrSearchControl"
        })
        .when("/autoingredient", {
            templateUrl: "auto-ingredient.html",
            controller: "autoingrControl"
        });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller("recipeControl", function () {
    //style
    let kotak = `
        margin-bottom: 20px;
        line-height: 1.42857143;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
        padding:5px;`;
    // end of style

    function showRecipe() {
        $('#recipeResult').html('');
        $.ajax({
            url: 'https://api.edamam.com/api/recipes/v2',
            type: 'get',
            dataType: 'json',
            data: {
                'type': 'public',
                'q': $('#cariResep').val(),
                'app_id': '0b32494c',
                'app_key': 'd47be574d014462a0404a9f65fe4982f'
            },
            success: function (result) {
                let hasil = result.hits;
                console.log(hasil);
                if (result.to > 0) {
                    $.each(hasil, function (i, data) {
                        var recipe = data.recipe;
                        // var ingr = recipe.ingredientLines;
                        // console.log(i);
                        $('#recipeResult').append(`
                        <div class="row" style="`+ kotak + `">
                            <h2 class="jedaatas" style="color: green;">`+ recipe.label + `</h2>
                            <ul class="col-sm-9 list-group-item list-unstyled">
                                <li class="jedabawah">Ingredients
                                    <ul id=`+ i + `>
                                    </ul>
                                </li>
                                <li class="jedabawahdikit">Cuisine type = `+ recipe.cuisineType[0] + `</li>
                                <li class="jedabawahdikit">Dish type = `+ recipe.dishType[0] + `</li>
                                <li class="jedabawahdikit">Meal type = `+ recipe.mealType[0] + `</li>
                                <li class="jedabawahdikit">Read more at <a href="`+ recipe.url + `" target="_blank">` + recipe.source + `</a></li>
                            </ul>
                            
                            <div class="col-sm-3">
                                <img src="`+ recipe.image + `" class="img-fluid float-end" >
                            </div>
                        </div>
                        `);
                        $.each(recipe.ingredientLines, function (x, bahan) {
                            $('#' + i).append('<li>' + bahan + '</li>')
                        })
                    })
                } else {
                    $('#recipeResult').html('<h1 class="text-center jedabawah">No recipe found !!!</h1><p class="text-center">Search other recipes</p>');
                }
            }
        });
    };

    $('#tombolResep').on('click', function () {
        showRecipe();
    });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller("foodcheckControl", function () {
    //style
    let kotak = `
    margin-right:2%;
    margin-left:2%;
    margin-bottom: 20px;
    line-height: 1.42857143;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
    padding:5px;`;
    // end of style

    function showHealth() {
        $('#analysisresult').html('');
        $.ajax({
            url: 'https://api.edamam.com/api/recipes/v2',
            type: 'get',
            dataType: 'json',
            data: {
                'type': 'public',
                'q': $('#analysis').val(),
                'app_id': '0b32494c',
                'app_key': 'd47be574d014462a0404a9f65fe4982f'
            },
            success: function (result) {
                let hasil = result.hits;
                if (result.to > 0) {
                    $.each(hasil, function (i, data) {
                        var recipe = data.recipe;
                        $('#analysisresult').append(`
                        <div class="col-sm-4" style="float:left;">
                            <div class ="row" style="`+ kotak + `;">
                                
                                <h2 class="jedaatas" style="color: green;">`+ recipe.label + `</h2>
                                <div class="col-sm-3">
                                    <img src="`+ recipe.image + `" class="img-fluid float-end" alt="...">
                                </div>
                                <ul class="col-sm-9 list-group-item list-unstyled ">
                                        <li class="analisis">`+ recipe.calories + " Calories " + `</li>
                                        <li class="analisis">Diet Categories = `+ recipe.dietLabels[0] + `</li>
                                        <li class="analisis">Health Status = `+ recipe.healthLabels[0] + `</li>
                                </ul>  

                            </div>
                            </div>
                    `);
                    })
                } else {
                    $('#analysisresult').html('<h1 class="text-center jedabawah">No recipe found !!!</h1><p class="text-center">Search other recipes</p>');
                }
            }
        });
    };

    $('#tombolanalysis').on('click', function () {
        showHealth();
    });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller("cookingredient-nutritionControl", function () {
    //style
    let kotak = `
        margin-bottom: 20px;
        line-height: 1.42857143;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
        padding:5px;`;
    // end of style

    function showNutrition() {
        $('#total').html('');
        $('#detailtable').html('');
        let text = $('#ingredients').val();
        let ingredient = text.split(", ");
        let lngth = ingredient.length;
        let count = 0;
        let error = 0;
        let totalcalories = 0, totalweight = 0, totalfat = 0, totalcholestrol = 0, totalcarbo = 0, totalprotein = 0;

        $('#total').html(`
            <div class="row">
                <div class="col-sm-6 offset-sm-3" style="`+ kotak + `">
                    <div class="col-sm jedabawah">
                        <h2 class="text-center" style="color: green;">Total Nutrients</h2>
                    </div>
                    <div class="col-sm-10 offset-sm-1" id="totalnutrient">
                    </div>
                </div>
            </div>
        `)

        $('#detailtable').html(`
            <div class="row">
                <div style="`+ kotak + `">
                    <div class="col-sm jedabawah">
                        <h2 class="text-center" style="color: green;">Details</h2>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-borderless">
                            <thead>
                                <tr>
                                    <th class="text-center">Ingredient</th>
                                    <th class="text-center">Calories</th>
                                    <th class="text-center">Weight</th>
                                    <th class="text-center">Fat</th>
                                    <th class="text-center">Cholestrol</th>
                                    <th class="text-center">Carbohydrate</th>
                                    <th class="text-center">Protein </th>
                                </tr>
                            </thead>
                            <tbody id="isi">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `);

        $.each(ingredient, function (i, ingr) {
            count += 1;
            $.ajax({
                url: 'https://api.edamam.com/api/nutrition-data',
                type: 'get',
                dataType: 'json',
                data: {
                    'app_id': 'cddab7a0',
                    'app_key': '616b339d12bdaf0ce66a3810912eb226',
                    'nutrition-type': 'cooking',
                    'ingr': ingr
                },
                success: function (result) {
                    if (result.calories > 0 || result.totalWeight > 0) {
                        let nutrient = result.totalNutrients;

                        $('#isi').append(`
                            <tr>
                                <td class="text-center">`+ ingr + `</td>
                                <td class="text-center">`+ result.calories + ` kcal</td>
                                <td class="text-center">`+ result.totalWeight + ` g</td>
                                <td class="text-center">`+ nutrient.FAT.quantity + ` ` + nutrient.FAT.unit + `</td>
                                <td class="text-center">`+ nutrient.CHOLE.quantity + ` ` + nutrient.CHOLE.unit + `</td>
                                <td class="text-center">`+ nutrient.CHOCDF.quantity + ` ` + nutrient.CHOCDF.unit + `</td>
                                <td class="text-center">`+ nutrient.PROCNT.quantity + ` ` + nutrient.PROCNT.unit + `</td>
                            </tr>
                    `);
                        totalcalories += result.calories;
                        totalweight += result.totalWeight;
                        totalfat += nutrient.FAT.quantity;
                        totalcholestrol += nutrient.CHOLE.quantity;
                        totalcarbo += nutrient.CHOCDF.quantity;
                        totalprotein += nutrient.PROCNT.quantity;
                        $('#totalnutrient').html(`
                        <dl class="row">
                            <dt class="col-sm-5">Total Calories</dt>
                            <dd class="col-sm-6 offset-sm-1">`+ totalcalories + ` kcal</dd>

                            <dt class="col-sm-5">Total Weight</dt>
                            <dd class="col-sm-6 offset-sm-1">`+ totalweight + ` g</dd>

                            <dt class="col-sm-5">Total Fat</dt>
                            <dd class="col-sm-6 offset-sm-1">`+ totalfat + ` g</dd>

                            <dt class="col-sm-5">Total Cholestrol</dt>
                            <dd class="col-sm-6 offset-sm-1">`+ totalcholestrol + ` mg</dd>

                            <dt class="col-sm-5">Total Carbohydrate</dt>
                            <dd class="col-sm-6 offset-sm-1">`+ totalcarbo + ` g</dd>

                            <dt class="col-sm-5">Total Protein</dt>
                            <dd class="col-sm-6 offset-sm-1">`+ totalprotein + ` g</dd>
                        </dl>
                    `);
                    } else {
                        error = 1;
                        if (error == 1 && count == lngth) {
                            if (totalcalories == 0 && totalweight == 0) {
                                $('#total').html('<h1 class="text-center jedabawah">Result Not Found!!!</h1><p class="text-center">Try Again</p>');
                                $('#detailtable').html('');
                            }
                        }
                    }
                }
            });
        });

    };

    $('#checkIngredient').on('click', function () {
        showNutrition();
    })

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.controller("ingrSearchControl", function () {
    //style
    let kotak = `
        margin-bottom: 20px;
        line-height: 1.42857143;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
        padding:5px;`;

    // end of style

    function showIngr() {
        $('#hasilsearch').html('');
        $.ajax({
            url: 'https://api.edamam.com/api/food-database/v2/parser',
            type: 'get',
            dataType: 'json',
            data: {
                'app_id': '2f9bc4b5',
                'app_key': 'e0243a346322e292e17059697717f5f5',
                'type': 'public',
                'ingr': $('#cariIngr').val(),
                'nutrition-type': 'cooking'
            },
            success: function (result) {
                console.log(result);
                let hasil = result.hints;
                // console.log(hasil);

                if (hasil.length > 0) {
                    $.each(hasil, function (i, data) {
                        var food = data.food;
                        $('#hasilsearch').append(`
                            <div class="col-sm-6" >
                                <div class ="row"style="`+ kotak + `">
                                    <h2 class="jedaatas" style="color: green;">`+ food.label + `</h2>
                                    <div class="col-sm-3">
                                        <img src="`+ food.image + `" class="img-fluid float-end">
                                    </div>
                                    <ul class="col-sm-9 list-group-item list-unstyled">
                                        <li class="jedabawahdikit">Energy = `+ food.nutrients.ENERC_KCAL + 'kcal' + `</li>
                                        <li class="jedabawahdikit">Carbohydrate = `+ food.nutrients.CHOCDF + 'g' + `</li>
                                        <li class="jedabawahdikit">Fat = `+ food.nutrients.FAT + 'g' + `</li>
                                        <li class="jedabawahdikit">Protein = `+ food.nutrients.PROCNT + 'g' + `</li>
                                        <li class="jedabawahdikit">Category = `+ food.category + `</li>
                                    </ul>
                                </div>
                            </div>


                        `);
                    })
                } else {
                    $('#hasilsearch').html('<h1 class="text-center jedabawah">No ingredients found !!!</h1><p class="text-center">Search other ingredient</p>');
                }

            }
        });
    };

    $('#tombolSearch').on('click', function () {
        showIngr();
    });

});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.controller("autoingrControl", function () {
    function findIngr() {
        $('#hasilsearch').html('');
        $.ajax({
            url: 'https://api.edamam.com/auto-complete',
            type: 'get',
            dataType: 'json',
            data: {
                'app_id': '2f9bc4b5',
                'app_key': 'e0243a346322e292e17059697717f5f5',
                'q': $('#cariIngr').val()
            },
            success: function (result) {
                console.log(result);
                console.log(result.length);
                $('#hasilsearch').append(` 
                    <div class ="row">
                        <h2 class="text-center"> All ingredients that contains word ` + $('#cariIngr').val() + ` : </h2>
                        
                    </div>
                    </br>
                `);
                if (result.length > 0) {
                    $.each(result, function (i, data) {
                        $('#hasilsearch').append(`
                            <div class ="row">

                                    <p class="text-center"> ` + data + ` </p>


                            </div>
                        `);

                    })
                } else {
                    $('#hasilsearch').html('<h1 class="text-center jedabawah">No ingredients found !!!</h1><p class="text-center">Search other ingredient</p>');
                }

            }
        });
    };

    $('#tombolSearch').on('click', function () {
        findIngr();
    });

});