let playerCash = 0;
const cashDisplayElement = document.getElementById("cash-display");
function earnMoney() {
  playerCash += 1;
  cashDisplayElement.textContent = "$" + playerCash;
}

async function attemptLogin() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

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
    const errorMsg = document.getElementById("error-msg");
    errorMsg.textContent = result.message;
    errorMsg.style.display = "block";
  }
}
