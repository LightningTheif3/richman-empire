let playerCash = 0;
const cashDisplayElement = document.getElementById("cash-display");

// --- LOAD SAVED CASH ON START ---
if (cashDisplayElement && localStorage.getItem("currentCash")) {
  playerCash = parseInt(localStorage.getItem("currentCash"));
  cashDisplayElement.textContent = "$" + playerCash;
}

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
const currentPlayer = localStorage.getItem("currentPlayer");
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
