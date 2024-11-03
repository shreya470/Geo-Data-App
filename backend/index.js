const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const bodyParser = require("body-parser");


app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({
  origin: 'http://localhost:3000' // Replace with your allowed origin
}));
app.use(bodyParser.json());

// Connecting with database
mongoose
  .connect("mongodb+srv://shreyanigwal001:o1t0ewQkcKZNopRH@cluster0.mafew.mongodb.net/?retryWrites=true&w=majority" || "mongodb://localhost:27017/blogsite")
  .then(() => console.log("Connection successful..."))
  .catch((err) => console.log(err));


app.use("/",require("./routes/nav"));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});