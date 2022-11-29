var express = require("express");
var router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const alowedextentions = [".png", ".pdf", ".jpeg", ".jpg", ".mp4"];
  const fileExtention = path.extname(file.originalname);
  cb(null, alowedextentions.includes(fileExtention));
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

/* GET users listing. */
router.post("/add", async (req, res, next) => {
  const userCheck = await User.findOne({ email: req.body.email });
  if (userCheck !== null)
    return res.status(400).json({ message: "user E-mail exists" });

  if (req.body.password.length < 5)
    return res.status(400).send("password too short");

  req.body.password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create(req.body);
  res.send(user);
});

// login user

router.post("/login", async (req, res, next) => {
  try {
    const userCheck = await User.findOne({ email: req.body.email });
    if (
      userCheck === null ||
      !bcrypt.compareSync(req.body.password, userCheck.password)
    )
      return res.status(400).json({ message: "wrong credentials" });

    const createdToken = jwt.sign(userCheck.toJSON(), "secret", {
      expiresIn: "6h",
    });
    return res.status(200).json({ token: createdToken, role: userCheck.role });
  } catch (e) {
    console.log(e);
  }
});

//delete user route
router.delete("/delete/:id", async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.send(user);
});

// update user route
router.put("/update/:id", async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body);
  res.send(user);
});

// get all users route
router.get("/all", async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

router.post("/adduser", upload.single("image"), async (req, res) => {
  try {
    const usercheck = await User.findOne({ email: req.body.email });
    if (usercheck !== null) {
      return res.status(401).json({ message: "EMAIL_EXISTS" });
    }
    let rand = (Math.random() + 1).toString(36).substring(7);
    const hashedpassword = await bcrypt.hash(rand, 10);
    const myUser = req.body;
    myUser.password = hashedpassword;
    if (req.file) {
      myUser.image = req?.file.filename;
    }

    const registreduser = await User.create(myUser);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const template = fs.readFileSync(path.resolve("./views", "mail.html"), {
      encoding: "utf-8",
    });

    // 24h timestamp
    const timestamp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
    const html = ejs.render(template, {
      name: req.body.name,
      id: registreduser._id,
      timestamp: timestamp,
    });

    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "TMA - Welcome to 3S",
      html: html,
    });

    res.json(registreduser);
  } catch (e) {
    console.log(e);
  }
});

router.post("/resetpasswordrequest", async (req, res) => {
  try {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { password: hashedpassword }
    );
    res.json(user);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
