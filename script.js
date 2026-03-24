// --- 1. GLOBAL VARIABLES ---
let playerCash = 0;
let cashPerSecond = 0;
let stockPrice = 50;
let userStocks = 0;

const cashDisplayElement = document.getElementById("cash-display");
const currentPlayer = localStorage.getItem("currentPlayer");

// --- 2. INITIALIZATION & REDIRECTS ---
if (!currentPlayer && !window.location.href.includes("Login.html")) {
  window.location.href = "Login.html";
}

if (document.getElementById("player-name") && currentPlayer) {
  document.getElementById("player-name").textContent =
    currentPlayer + "'s Empire";
}

// Fetch the latest cash from the server immediately on every page load
async function syncWithDatabase() {
  if (!currentPlayer) return;

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

// --- 3. CORE ACTIONS ---
function earnMoney() {
  playerCash += 1;
  if (cashDisplayElement) cashDisplayElement.textContent = "$" + playerCash;
}

async function saveGame() {
  const user = localStorage.getItem("currentPlayer");
  if (user) {
    await fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, cash: playerCash }),
    });
    console.log("Game saved!");
  }
}

// --- 4. PASSIVE INCOME SYSTEM ---
setInterval(() => {
  if (cashPerSecond > 0) {
    playerCash += cashPerSecond;
    if (cashDisplayElement) cashDisplayElement.textContent = "$" + playerCash;
  }
}, 1000);

// --- 5. BUSINESS SYSTEM ---
function buyBusiness(name, cost, earnings) {
  if (playerCash >= cost) {
    playerCash -= cost;
    cashPerSecond += earnings;
    if (cashDisplayElement) cashDisplayElement.textContent = "$" + playerCash;
    saveGame();
    alert("Success! You bought a " + name);
  } else {
    alert("You need more cash!");
  }
}

// --- 6. STOCK SYSTEM ---
setInterval(() => {
  let change = Math.floor(Math.random() * 11) - 5; // -5 to +5
  stockPrice += change;
  if (stockPrice < 1) stockPrice = 1;

  const priceTag = document.getElementById("stock-price-display");
  if (priceTag) priceTag.textContent = "Current Price: $" + stockPrice;
}, 3000);

function buyStock() {
  if (playerCash >= stockPrice) {
    playerCash -= stockPrice;
    userStocks++;
    updateStockUI();
    saveGame();
  } else {
    alert("Not enough cash!");
  }
}

function sellStock() {
  if (userStocks > 0) {
    playerCash += stockPrice;
    userStocks--;
    updateStockUI();
    saveGame();
  } else {
    alert("You don't have any stocks to sell!");
  }
}

function updateStockUI() {
  if (cashDisplayElement) cashDisplayElement.textContent = "$" + playerCash;
  const stockOwnedTag = document.getElementById("stocks-owned");
  if (stockOwnedTag) stockOwnedTag.textContent = "Stocks Owned: " + userStocks;
}

// --- 7. AUTHENTICATION ---
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
    window.location.href = "Richman Empire.html";
  } else {
    errorMsg.textContent = result.message;
    errorMsg.style.display = "block";
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
  errorMsg.style.color = result.success ? "green" : "red";
}

// --- 8. AUTO-SAVE INTERVAL ---
setInterval(saveGame, 5000);
