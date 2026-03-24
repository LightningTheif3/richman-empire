const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(__dirname));

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  fs.readFile("users.json", "utf8", (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }

    const existingUser = users.find((u) => u.username === username);

    if (existingUser) {
      if (existingUser.password === password) {
        res.json({ success: true, message: "Welcome back to the Empire!" });
      } else {
        res.json({ success: false, message: "Incorrect password!" });
      }
    } else {
      users.push({ username: username, password: password, cash: 0 });

      fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
        res.json({ success: true, message: "New account created!" });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Richman Empire Server running at http://localhost:${port}`);
});
