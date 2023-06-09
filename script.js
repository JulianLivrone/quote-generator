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
const searchButton = document.getElementById("searchButton");

const progressBar = document.getElementById("progress-bar");
let timer;

let apiQuotes = [];
let apiCategory = "no category";
let searchValue = "";

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
  // Reset the timer if it is running
  if (timer) {
    clearInterval(timer);
  }
  // Reset the progress bar
  progressBar.style.width = "100%";
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
  // Start the timer and set progress bar
  let timeLeft = 100;
  progressBar.style.width = "0%";
  timer = setInterval(() => {
    timeLeft--;
    const progress = 100 - (timeLeft / 100) * 100;
    progressBar.style.width = `${progress}%`;
    if (timeLeft === 0) {
      clearInterval(timer);
      newQuote();
    }
  }, 100);
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
    console.log(error);
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

function searchByAuthor() {
  const quotesFilteredByAuthor = apiQuotes.filter((apiQuote) => {
    if (searchValue === "" || searchValue === " ") {
      return false;
    } else {
      return (
        apiQuote.author.toLowerCase().includes(searchValue.toLowerCase()) ===
        true
      );
    }
  });
  generateItemsForQuotesFilteredByAuthorList(quotesFilteredByAuthor);
}

// Event listeners
newQuoteBtn.addEventListener("click", newQuote);
twitterBtn.addEventListener("click", tweetQuote);
selectCategory.addEventListener("change", (e) => {
  apiCategory = e.target.value;
});
searchBar.addEventListener("input", (e) => {
  searchValue = e.target.value;
});
searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchByAuthor();
  }
});
searchButton.addEventListener("click", searchByAuthor);
randomQuoteBtn.addEventListener("click", () => {
  searchValue = "";
  searchByAuthor();
  searchBar.value = "";
  quotesFilteredContainer.style.display = "none";
  quoteContainer.style.display = "block";
});
quotesFilteredBtn.addEventListener("click", () => {
  quoteContainer.style.display = "none";
  quotesFilteredContainer.style.display = "block";
});
// On load
getQuotes();
