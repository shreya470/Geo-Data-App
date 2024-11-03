const express = require("express");
const JsonDatadb = require("./../routes/model");
const Filename = require("./filename");
const User = require("./user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/mymap/fetch', async (req, res) => {
    try {
      const jsonData = await JsonDatadb.findOne({ name: req.body.name });
      if (jsonData) {
        res.json({ success: true, data: jsonData.data });
      } else {
        res.status(404).json({ success: false, message: 'File not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ success: false, message: 'Error fetching data' });
    }
  });

  router.post('/mymap/save', async (req, res) => {
    try {
        // Check if a file with the same name already exists
        const existingFile = await JsonDatadb.findOne({ name: req.body.name });
        if (existingFile) {
            return res.status(400).json({ success: false, message: 'File with the same name already exists' });
        }

        const jsonData = new JsonDatadb({ data: req.body.jsonData, name: req.body.name });
        await jsonData.save();
        const fname = new Filename({ name: req.body.name });
        await fname.save();
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving data' });
    }
});

router.get('/get-filenames', async (req, res) => {
    try {
      // Fetch all objects from the Filename collection
      const filenames = await Filename.find();
      res.json(filenames); // Return the fetched data as JSON
    } catch (error) {
      console.error('Error fetching filenames:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ msg: "User with same email already exists" });
      }
  
      const hashPassword = await bcryptjs.hash(password, 8);
      let user = new User({
        email: email,
        password: hashPassword,
        name: name,
        phone: phone,
        dob: new Date()
      });
      user = await user.save();
       res.json({ user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  // SIGNIN
  router.post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      const user = await User.findOne({ email: email });
      console.log(`User = ${user}`);
      if (!user) {
        return res
          .status(400)
          .json({ msg: "User with this email does not exist!" });
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" });
      }
      const token = jwt.sign({ id: user._id }, "passwordKey");
      console.log(user._id);
      console.log(token);
      res.json({ ...user._doc, token: token });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // DELETE a specific map by name
  router.delete('/mymap/delete', async (req, res) => {
    try {
        const { name } = req.body;
        await JsonDatadb.deleteOne({ name }); // Delete from JsonDatadb
        await Filename.deleteOne({ name }); // Delete from Filename collection
        res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, message: 'Error deleting file' });
    }
});

module.exports = router;