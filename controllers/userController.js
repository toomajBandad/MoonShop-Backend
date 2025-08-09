const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Validator = require("../validators/validators");
const jwt = require("jsonwebtoken");
const brevo = require("@getbrevo/brevo");
const bcrypt = require("bcrypt");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "user identified correctly", user: user });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User did not find !" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ msg: "error : username, password or email not existed" });
    }
    if (!Validator.passwordValidator(password)) {
      return res.status(400).json({ msg: "password is not acceptable" });
    }
    if (!Validator.emailValidator(email)) {
      return res.status(400).json({ msg: "email format is not acceptable" });
    }

    const [emailDuplicate, usernameDuplicate] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
    ]);

    if (emailDuplicate) {
      return res.status(400).json({
        msg: "Email Duplicated : This user has been registered before with this Email",
      });
    }

    if (usernameDuplicate) {
      return res.status(400).json({
        msg: "Username Duplicated : This user has been registered before with this Username",
      });
    }

    //Bcrypy Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Creating new user
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
    });

    //Sign User and create Token
    const token = jwt.sign(
      {
        username: newUser.username,
        email: newUser.email,
      },
      process.env.JWT_SECRET
    );

    const cart = await Cart.create({
      //create user empty cart
      userId: newUser._id,
      items: [],
    });

    res.status(201).json({
      token: token,
      token_type: "Bearer",
      msg: "User created successfully",
      user: newUser,
      cart,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const sendMail = async (req, res) => {
  const { userId, type, subject } = req.body;

  if (!userId || !type || !subject) {
    return res
      .status(404)
      .json({ message: "error in userId or type or subject" });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const apiInstance = new brevo.TransactionalEmailsApi();
  let apiKey = apiInstance.authentications["apiKey"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = subject;
  {
    type === "Welcome"
      ? (sendSmtpEmail.htmlContent = ` 
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px; border-radius: 8px;">
        <h1 style="color: #01796f;">Hello ${user.username} 👋</h1>
        <p>Welcome aboard!</p>
        <p>Thanks for signing up—your journey with us starts now, and we're excited to have you as part of our community.</p>
        <ul>
          <li>🔒 Member-only features</li>
          <li>📢 News and updates</li>
          <li>💬 Personalized support</li>
        </ul>
        <p>Just hit reply if you need anything. We're here for you!</p>
        <p style="margin-top: 20px;">Cheers,<br><strong>The Team 🚀</strong></p>
      <small style="color: #888;">You received this email because you signed up for our service.</small>
      </div>
`)
      : (sendSmtpEmail.htmlContent = `<p>Information from Casa verde!</p>`);
    // ? (sendSmtpEmail.htmlContent = `<h1>Hello ${user.username} 👋</h1><p>Thanks for signing up!</p>`)
  }
  sendSmtpEmail.sender = {
    name: "Casa Verde",
    email: "tbandad@gmail.com",
  };
  sendSmtpEmail.to = [{ email: user.email, name: user.username }];
  sendSmtpEmail.replyTo = {
    name: "Casa Verde",
    email: "tbandad@gmail.com",
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      res.send("Email sent successfully via Brevo API");
    },
    function (error) {
      console.error(error);
      res.status(500).send("Error sending email");
    }
  );
};

const updateUser = async (req, res) => {
  try {
    const updateFields = {};

    // Only add fields that are present in req.body
    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.password) {
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    if (req.body.addressesList)
      updateFields.addressesList = req.body.addressesList;
    if (req.body.creditBalance !== undefined)
      updateFields.creditBalance = req.body.creditBalance;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    return res.status(200).json({ msg: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User did not find !" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "error with email or password" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(403).json({ msg: "User did not find !" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "password Error" });
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      return res.status(400).json({ msg: "cart Error" });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    res.json({ msg: "Login successfully", token, user, cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getUsers,
  getMe,
  getUserById,
  createUser,
  sendMail,
  updateUser,
  deleteUser,
  loginUser,
};
