const express = require("express");
const mongoose = require("mongoose"); // The new database tool!
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// --- 1. CONNECT TO THE DATABASE ---
// Paste your connection string here.
// MAKE SURE to replace <password> with your actual database password!
const mongoURI =
  "mongodb+srv://lightningthief3:sEOga04Fbsz37W4g@cluster0.c2sjamf.mongodb.net/?appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Vault!"))
  .catch((err) => console.log("Database connection failed:", err));

// --- 2. DEFINE WHAT A PLAYER LOOKS LIKE ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cash: { type: Number, default: 0 },
});
const User = mongoose.model("User", UserSchema);

// --- 3. ROUTES ---
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Login.html");
});

// CREATE ACCOUNT
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.json({ success: false, message: "Cannot be blank!" });

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser)
      return res.json({ success: false, message: "Name already taken!" });

    // Save new user directly to MongoDB!
    await User.create({ username: username, password: password, cash: 0 });
    res.json({
      success: true,
      message: "Account created! You can now log in.",
    });
  } catch (error) {
    res.json({ success: false, message: "Server error creating account." });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    // Allow login if password matches OR if we are just reloading data
    if (user && (user.password === password || password === "LOAD_ONLY")) {
      res.json({ success: true, message: "Welcome back!", cash: user.cash });
    } else {
      res.json({ success: false, message: "Incorrect username or password!" });
    }
  } catch (error) {
    res.json({ success: false, message: "Server error logging in." });
  }
});

// --- SAVE MONEY ---
app.post("/save", async (req, res) => {
  const { username, cash } = req.body;

  try {
    // Find the player and update their cash amount
    await User.findOneAndUpdate({ username: username }, { cash: cash });
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: "Error saving game." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Richman Empire Server running on port ${port}`);
});
