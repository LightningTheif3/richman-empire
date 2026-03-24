let playerCash = 0;
const cashDisplayElement = document.getElementById("cash-display");
const currentPlayer = localStorage.getItem("currentPlayer");

// --- REDIRECT IF NOT LOGGED IN ---
if (!currentPlayer && !window.location.href.includes("Login.html")) {
  window.location.href = "Login.html";
}

// --- DISPLAY NAME & INITIAL CASH ---
if (document.getElementById("player-name") && currentPlayer) {
  document.getElementById("player-name").textContent =
    currentPlayer + "'s Empire";
}

// Fetch the latest cash from the server immediately on every page load
async function syncWithDatabase() {
  if (!currentPlayer) return;

  // We reuse the /login route with a special flag to just get data
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentPlayer, password: "LOAD_ONLY" }),
  });

  const result = await response.json();
  if (result.success) {
    playerCash = result.cash;
    if (cashDisplayElement) cashDisplayElement.textContent = "$" + playerCash;
  }
}

syncWithDatabase();

// Run the load function immediately
loadPlayerData();

function earnMoney() {
  playerCash += 1;
  cashDisplayElement.textContent = "$" + playerCash;
}

// --- DATABASE AUTO-SAVE (Runs every 5 seconds) ---
setInterval(async () => {
  const currentPlayer = localStorage.getItem("currentPlayer");

  if (currentPlayer && document.getElementById("game-container")) {
    await fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentPlayer, cash: playerCash }),
    });
    console.log("Game auto-saved to database!");
  }
}, 5000);

// --- THE BOUNCER & NAME TAG ---
const playerNameDisplay = document.getElementById("player-name");

if (playerNameDisplay && currentPlayer) {
  playerNameDisplay.textContent = currentPlayer + "'s Empire";
}

if (document.getElementById("game-container") && !currentPlayer) {
  window.location.href = "Login.html";
}

// --- LOGIN AND REGISTER FUNCTIONS ---
async function loginAccount() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass }),
  });

  const result = await response.json();

  if (result.success) {
    localStorage.setItem("currentPlayer", user);
    localStorage.setItem("currentCash", result.cash); // Save their loaded money!
    window.location.href = "Richman Empire.html";
  } else {
    errorMsg.textContent = result.message;
    errorMsg.style.display = "block";
    errorMsg.style.color = "red";
  }
}

async function createAccount() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass }),
  });

  const result = await response.json();

  errorMsg.textContent = result.message;
  errorMsg.style.display = "block";

  if (result.success) {
    errorMsg.style.color = "green";
  } else {
    errorMsg.style.color = "red";
  }
}

let cashPerSecond = 0;

// This runs every 1 second to give passive income
setInterval(() => {
  if (cashPerSecond > 0) {
    playerCash += cashPerSecond;
    if (cashDisplayElement) {
      cashDisplayElement.textContent = "$" + playerCash;
    }
  }
}, 1000);

function buyBusiness(name, cost, earnings) {
  if (playerCash >= cost) {
    playerCash -= cost;
    cashPerSecond += earnings;
    cashDisplayElement.textContent = "$" + playerCash;
    alert("You bought a " + name + "!");
  } else {
    alert("Not enough cash!");
  }
}

let stockPrice = 50;
let userStocks = 0;

// Make the stock price bounce every 3 seconds
setInterval(() => {
  let change = Math.floor(Math.random() * 11) - 5; // Random number between -5 and +5
  stockPrice += change;
  if (stockPrice < 1) stockPrice = 1; // Don't let it hit $0

  const priceTag = document.getElementById("stock-price-display");
  if (priceTag) priceTag.textContent = "Current Price: $" + stockPrice;
}, 3000);

function buyStock() {
  if (playerCash >= stockPrice) {
    playerCash -= stockPrice;
    userStocks++;
    updateStockUI();
  }
}

function sellStock() {
  if (userStocks > 0) {
    playerCash += stockPrice;
    userStocks--;
    updateStockUI();
  }
}

function updateStockUI() {
  if (cashDisplayElement) cashDisplayElement.textContent = "$" + playerCash;
  const stockOwnedTag = document.getElementById("stocks-owned");
  if (stockOwnedTag) stockOwnedTag.textContent = "Stocks Owned: " + userStocks;
}
