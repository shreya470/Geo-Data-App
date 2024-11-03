const mongoose = require("mongoose");

//schema for JSON
const schema = new mongoose.Schema({
    name: String,
  });

module.exports = new mongoose.model("filename",schema);