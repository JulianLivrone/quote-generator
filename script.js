const quoteContainer = document.getElementById("quote-container");
const searchBar = document.getElementById("searchBar");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const categoryText = document.getElementById("category");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const quotesFilteredBtn = document.getElementById("quotesFiltered-button");
const selectCategory = document.getElementById("selectCategory");
const quotesFilteredContainer = document.getElementById(
  "quotesFiltered-container"
);
const quotesFilteredList = document.getElementById("quotesFiltered-list");
const randomQuoteBtn = document.getElementById("randomQuote-button");

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
  let apiQuotesFiltered = apiQuotes;
  if (!(apiCategory === "no category")) {
    apiQuotesFiltered = apiQuotes.filter((quote) => quote.tag === apiCategory);
  }
  // Pick a random quote from apiQuotes array
  const quote =
    apiQuotesFiltered[Math.floor(Math.random() * apiQuotesFiltered.length)];
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
  // Set quote category
  categoryText.textContent = quote.tag;
  // Set quote and hide loader
  quoteText.textContent = quote.text;
  removeLoadingSpinner();
}

// Create option tag for category
function createOption(category) {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  selectCategory.appendChild(option);
}

// Create categories for selecting quotes
function createSelectCategoryOptions(categories) {
  //Add the "no category" option to select
  createOption("no category");
  // Add categories option for select dynamically
  categories.forEach((category) => {
    createOption(category);
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

// Create <li> for every quote filtered by author and add it to quotes filtered list <ul>
function generateItemsForQuotesFilteredByAuthorList(quotesFilteredByAuthor) {
  quotesFilteredList.textContent = "";
  quotesFilteredByAuthor.forEach((quote) => {
    // Create quote text element
    const quoteText = document.createElement("span");
    quoteText.textContent = quote.text;
    quoteText.classList.add("quoteFiltered-text");
    // Create quote author element
    const quoteAuthor = document.createElement("span");
    quoteAuthor.textContent = quote.author;
    quoteAuthor.classList.add("quoteFiltered-author");
    // Create quote category element
    const quoteCategory = document.createElement("span");
    quoteCategory.textContent = quote.tag;
    quoteCategory.classList.add("quoteFiltered-category");
    // Create list item element with three previous elements as children
    const listItem = document.createElement("li");
    listItem.append(quoteText, quoteAuthor, quoteCategory);
    listItem.classList.add("quotesFiltered-item");
    // Add list item element inside quotes filtered list
    quotesFilteredList.appendChild(listItem);
  });
}

// Event listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);
selectCategory.addEventListener("change", (e) => {
  apiCategory = e.target.value;
});
searchBar.addEventListener("input", (e) => {
  const quotesFilteredByAuthor = apiQuotes.filter((apiQuote) => {
    if (e.target.value === "" || e.target.value === " ") {
      return false;
    } else {
      return apiQuote.author.includes(e.target.value) === true;
    }
  });
  generateItemsForQuotesFilteredByAuthorList(quotesFilteredByAuthor);
});
randomQuoteBtn.addEventListener("click", () => {
  quotesFilteredContainer.style.display = "none";
  quoteContainer.style.display = "block";
});
quotesFilteredBtn.addEventListener("click", () => {
  quoteContainer.style.display = "none";
  quotesFilteredContainer.style.display = "block";
});
// On load
getQuotes();
