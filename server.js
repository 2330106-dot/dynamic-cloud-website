const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <h1>Dynamic Cloud Website</h1>
    <form method="POST" action="/greet">
      <input type="text" name="username" placeholder="Enter your name" required />
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/greet", (req, res) => {
  const name = req.body.username;
  res.send(`<h2>Hello ${name}! 🚀 Your website is running on cloud!</h2>
            <a href="/">Go Back</a>`);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});