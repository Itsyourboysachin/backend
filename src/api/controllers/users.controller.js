const userModel = require("../models/users.model");
const bcrypt = require("bcryptjs");
const config = require("../../config/auth.config");
const randomstring = require("randomstring");
var jwt = require("jsonwebtoken");
const { sendEmail, sendVerifyEmail } = require("../../config/email.config");

const validatePassword = (password) => {
  const errors = [];

  if (password.length <= 8) {
    errors.push("Password must be exactly 8 characters long.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (@$!%*?&)."
    );
  }

  return errors.length > 0 ? errors : null;
};

const validateEmail = (email) => {
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_PATTERN.test(email)) {
    return "Invalid email format.";
  }
  return null;
};

const validatePhone = (phone) => {
  const PHONE_PATTERN = /^\d{10}$/;
  if (!PHONE_PATTERN.test(phone)) {
    return "Phone number must be exactly 10 digits long.";
  }
  return null;
};

const signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!(name && email && password)) {
      return res
        .status(400)
        .json({ message: `All fields are required`, status: 400 });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError, status: 400 });
    }

    const phoneError = validatePhone(phoneNumber);
    if (phoneError) {
      return res.status(400).json({ message: phoneError, status: 400 });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors) {
      return res
        .status(400)
        .json({ message: passwordErrors.join(" "), status: 400 });
    }

    const userExist = await userModel.findOne({ email: email }).select("_id");
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Email already in use", status: 400 });
    }

    const newUser = new userModel({
      name,
      email,
      phoneNumber,
      password: bcrypt.hashSync(password, 8),
      role,
    });

    await newUser.save();

    sendVerifyEmail(name, email, newUser._id);

    return res.status(200).json({
      message: "User registered successfully. Please verify your email!",
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const signin = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User Not found.", status: 404 });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 }); // 24 hours

    await userModel.findByIdAndUpdate(user._id, { token: token });

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const update = async (req, res) => {
  try {
    // Handle file upload
    if (req.file) {
      const file = req.file;
      const filePath = `/uploads/${file.filename}`;
      req.body.profilePhoto = filePath; // update profilePhoto field with uploaded file path
    }

    delete req.body.password;
    const result = await userModel.findByIdAndUpdate(
      { _id: req.body._id || req.body.id },
      req.body
    );
    res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const deleteById = async (req, res) => {
  try {
    const result = await userModel.findByIdAndDelete({
      _id: req.query._id || req.query.id,
    });
    res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const findById = async (req, res) => {
  try {
    const result = await userModel.findById({
      _id: req.query._id || req.query.id,
    });
    res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const findAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const query = {};
    const result = await userModel
      .find(query)
      .limit(limit)
      .skip(limit * page);
    const totalRecords = await userModel.countDocuments(query);
    res.status(200).json({ result, totalRecords });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message, message: "Internal server error." });
  }
};

const reset_password = async (req, res) => {
  try {
    const token = req.body.token;
    const tokenData = await userModel.findOne({ token: token });
    if (tokenData) {
      const newPassword = bcrypt.hashSync(req.body.newPassword, 8);
      const UserData = await userModel.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPassword, token: "" } },
        { new: true }
      );
      res.status(200).send({
        success: true,
        massage: "User password has been reset successfully",
        data: UserData,
      });
    } else {
      res.status(200).send({
        success: false,
        massage: "Unauthorized.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const sendResetPasswordMail = async (name, email, token) => {
  try {
    const html = `<p> Hi ${name}, please copy the link <a href="https://abc.com/reset-password?token=${token}"> reset your password </a>.</p>`;
    await sendEmail(email, "For Reset password", html);
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await userModel.findOne({ email: email });
    if (userData) {
      const randomString = randomstring.generate();
      await userModel.updateOne(
        { email: email },
        { $set: { token: randomString } }
      );
      sendResetPasswordMail(userData.name, userData.email, randomString);
      res.status(200).send({
        success: true,
        massage: "Please check your inbox and reset your password",
      });
    } else {
      res.status(200).send({
        success: true,
        massage: "This email does not exist",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, status: 500 });
  }
};

const verifymail = async (req, res) => {
  try {
    const verifiedMail = await userModel.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );
    console.log(verifiedMail);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  signup,
  signin,
  update,
  deleteById,
  findById,
  findAll,
  reset_password,
  forgotPassword,
  verifymail,
};
