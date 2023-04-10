const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const categoryText = document.getElementById("category");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const selectCategory = document.getElementById("selectCategory");

let apiQuotes = [];
let apiCategory = "no category";

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}

// Show new quote
function newQuote() {
  showLoadingSpinner();
  // Filter quote by category selected
  let copia = apiQuotes;
  if (!(apiCategory === "no category")) {
    copia = apiQuotes.filter((quote) => quote.tag === apiCategory);
  }
  console.log(copia);
  // Pick a random quote from apiQuotes array
  const quote = copia[Math.floor(Math.random() * copia.length)];
  // Check if author field is blank and replace it with 'Unknown'
  if (!quote.author) {
    authorText.textContent = "Unknown";
  } else {
    authorText.textContent = quote.author;
  }
  // Check quote length to determine styling
  if (quote.text.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
  // Set quote and hide loader
  quoteText.textContent = quote.text;
  // Set quote category
  categoryText.textContent = quote.tag;
  removeLoadingSpinner();
}

// Create categories for selecting quotes
function createSelectCategoryOptions(categories) {
  //Add the no category option to select
  const option = document.createElement("option");
  option.value = "no category";
  option.textContent = "no category";
  selectCategory.appendChild(option);
  // Add categories for select dynamically
  categories.forEach((categorie) => {
    const option = document.createElement("option");
    option.value = categorie;
    option.textContent = categorie;
    selectCategory.appendChild(option);
  });
}

// Get quotes from API
async function getQuotes() {
  showLoadingSpinner();
  const apiUrl = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
  try {
    const response = await fetch(apiUrl);
    apiQuotes = await response.json();
    const categories = [];
    apiQuotes.forEach((apiQuote) => {
      if (!categories.includes(apiQuote.tag)) {
        categories.push(apiQuote.tag);
      }
    });
    createSelectCategoryOptions(categories);
    newQuote();
  } catch (error) {
    alert("There was a problem with the API");
  }
}

// Tweet quote
function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
  window.open(twitterUrl, "_blank");
}

// Event listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);
selectCategory.addEventListener("change", (e) => {
  apiCategory = e.target.value;
});

// On load
getQuotes();
