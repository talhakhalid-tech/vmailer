const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use("/", require("./routes/index.js"));

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
