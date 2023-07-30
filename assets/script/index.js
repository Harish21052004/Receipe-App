let procedure;
let categorieslist = document.getElementById("categorieslist"),
arealist = document.getElementById("arealist"),
closePopup = document.getElementById("closePopup"),
popup = document.getElementById("popup"),
receipeDatas = document.getElementById("receipeDatas"),
savedReceipes = document.getElementById("savedReceipes");
let val = [];

async function callByCategories(val){
  await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${val}`)
  .then(response => response.json())
  .then(data => {
    const recipes = data.meals;
   // console.log(recipes);

    categorieslist.innerHTML = "";
    
    if (recipes) {
     recipes.forEach(element => {
      categorieslist.innerHTML += `<div class="receipedata" id="category" data-aos="fade-up" data-aos-duration="1000">
                                   <div class="image">
                                   <img src="${element.strMealThumb}" alt="image">
                                   </div>
                                   <div class="name" onclick="showDetails(${element.idMeal})">${element.strMeal} </div>
                                   </div>`    
     });
       
    } else {
      alert('No recipes found for the given category.');
    }
  })
  .catch(error => alert('Error:', error));
}

async function callByArea(val){
  await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${val}`)
  .then(response => response.json())
  .then(data => {
    // 'data' will contain the recipe results
    const recipes = data.meals;
   // console.log(recipes);

    arealist.innerHTML = "";
    
    if (recipes) {
      // Process and display the recipes
     recipes.forEach(element => {
      arealist.innerHTML += `<div class="receipedata" id="area" data-aos="fade-up"  data-aos-duration="1000">
                                   <div class="image">
                                   <img src="${element.strMealThumb}" alt="image">
                                   </div>
                                   <div class="name" onclick="showDetails(${element.idMeal})">${element.strMeal} </div>
                                   </div>`    
     });
       
    } else {
      alert('No recipes found for the given category.');
    }
  })
  .catch(error => alert('Error:', error));
}

async function showDetails(value){
  popup.style.display = "flex"; 
  //console.log(value);

  await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${value}`)
  .then(response => response.json())
  .then(data => {
    const recipes = data.meals;
    //console.log(recipes); 
    
    popup.innerHTML = `
          <section class="display">
          <div class="close">
            <i class="fas fa-times" id="closePopup" onclick = "hidedetails()"></i>
          </div>
          <div class="title">${recipes[0].strMeal}</div>
          <div class="image"><img src="${recipes[0].strMealThumb}" alt="thumbnail"></div>
          <div class="mealcategory">Meal category : <span>${recipes[0].strCategory}</span></div>
          <div class="mealarea">Meal area : <span>${recipes[0].strArea}</span></div>
      
          <div class="instructions">
           <span id="instructions">${recipes[0].strInstructions}</span> <a href="${recipes[0].strSource}" target="_blank" >Source</a>
          </div>
          <div class="video"><a href=" ${recipes[0].strYoutube}" target="_blank" >Watch on YouTube</a></div>  

          <div class="links">
            <div class="share-links">
              <i class="fas fa-volume-up" onclick="speak()"></i>   
              <i class="fab fa-twitter" onclick="shareBtnByTwitter()"></i>   
              <i class="fab fa-facebook" onclick="shareBtnByFaceBook()"></i>
              <i class="fab fa-whatsapp" onclick="shareBtnByWhatsapp()"></i>
              <i class="far fa-copy" onclick="copyText()"></i> 
              <i class="fas fa-volume-mute" onclick="disableSpeak()"></i>
            </div>
        </section>    
    `

    procedure = instructions.innerText;    
  })
  .catch(error => alert('Error:', error));
}


function hidedetails(){
  popup.style.display = "none"; 
  if ('speechSynthesis' in window) {
    var synthesis = window.speechSynthesis;
    synthesis.cancel();

  } else {
    alert('Text-to-speech not supported.');
  }
}


async function searchByReceipe(){
  let receipe_Name = document.getElementById("receipe-name").value;
  receipeDatas.innerHTML = " ";
  const api = `https://api.edamam.com/api/recipes/v2?app_id=3c1e7553&app_key=13337f7fcc79ed32dcc6fafb958a39ed&type=public&q=${receipe_Name}`;

  await fetch(`${api}`)
  .then(response => response.json())
  .then(data => {
    receipes = data.hits;
    //console.log(receipes);
    for(let i = 0; i<receipes.length;i++){
      receipeDatas.innerHTML += `<div id="saveReceipe">
                                 <div class="receipeContainer" data-aos="fade-up"  data-aos-duration="500">
                                 <div class="image">
                                   <img src="${receipes[i].recipe.images.REGULAR.url}" alt="receipe">
                                 </div>
                                 <div class="receipename">
                                   <p> <a href ="${receipes[i].recipe.url}" target="_blank">${receipes[i].recipe.label} </a> </p>
                                 </div>
                                </div>
      </div>`
    }
  })
  .catch(error => alert('Error:', error));
}

function speak(){
 let instructions = document.getElementById("instructions");
 let speech = new SpeechSynthesisUtterance(`${instructions.innerText}`);
 speechSynthesis.speak(speech);
}

function disableSpeak(){
  if ('speechSynthesis' in window) {
    var synthesis = window.speechSynthesis;
    synthesis.cancel();

  } else {
    alert('Text-to-speech not supported.');
  }
}

function copyText(){
  let instructions = document.getElementById("instructions").innerText;
  var tempInput = document.createElement("input");
  tempInput.value = instructions;
  document.body.appendChild(tempInput);

  // Select the text in the input element
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Remove the temporary input element
  document.body.removeChild(tempInput);

  // Optional: Provide feedback to the user
 alert(`Text copied to clipBoard `);
}

function shareBtnByTwitter(){
  let instructions = document.getElementById("instructions").innerText;
  let tweetUrl = `https://twitter.com/intent/tweet?url=${instructions.innerText}`
  window.open(tweetUrl,"_blank");
}

function shareBtnByFaceBook(){
  let instructions = document.getElementById("instructions").innerText;
  var shareURL = "https://www.facebook.com/sharer/sharer.php?u=" + instructions;
  window.open(shareURL,"_blank");
}

function shareBtnByWhatsapp(){
  let instructions = document.getElementById("instructions").innerText;
  var url = "https://wa.me/?text=" + instructions;
  window.open(url,"_blank");
}

function callParent(){
  let saveReceipe = document.getElementById("saveReceipe");
  let value = saveReceipe.innerHTML;
  console.log(value);
}

callByCategories("Chicken");
callByArea("Chinese");