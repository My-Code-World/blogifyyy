const { Router } = require("express");
const User = require("../models/user");
const Blog = require("../models/blog")
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("signin", {
        error: "Incorrect Email or Password",
      });
    }
    const blogs = await Blog.find();
    
    return res.cookie("token", token).render("home", { username: user.fullName, blogs: blogs });
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
