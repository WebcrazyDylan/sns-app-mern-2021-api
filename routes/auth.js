const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const exitName = await User.findOne({ username: req.body.username });
    if (exitName) {
      return res.status(406).json({ message: "Username already exists !" });
    }
    const exitEmail = await User.findOne({ email: req.body.email });
    if (exitEmail) {
      return res.status(406).json({ message: "Email already exists !" });
    }

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(406).json({ message: "Wrong user or password !" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(406).json({ message: "Wrong password or user !" });
    }

    res.status(200).json(user);
  } catch (err) {
    // console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
