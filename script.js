let playerCash = 0;
const cashDisplayElement = document.getElementById("cash-display");
function earnMoney() {
  playerCash += 1;
  cashDisplayElement.textContent = "$" + playerCash;
}

// --- THE BOUNCER & NAME TAG ---
// This runs immediately when any page loads
const currentPlayer = localStorage.getItem("currentPlayer");
const playerNameDisplay = document.getElementById("player-name");

// If we are on the game page and they have a name, show it!
if (playerNameDisplay && currentPlayer) {
  playerNameDisplay.textContent = currentPlayer + "'s Empire";
}

// If we are on the game page but they AREN'T logged in, kick them out!
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
    localStorage.setItem("currentPlayer", user); // Save their name
    window.location.href = "Richman Empire.html"; // Send to game
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

  // Make the text green if successful, red if it failed
  if (result.success) {
    errorMsg.style.color = "green";
  } else {
    errorMsg.style.color = "red";
  }
}
