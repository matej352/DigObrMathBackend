const bcrypt = require("bcrypt");
const { Consts } = require("../../helpers/consts");
const {
  usernameSchema,
  passwordSchema,
} = require("../../joi-validator/schemas");

const UserModel = require("../../models/UserModel");

const registration = async (req, res) => {
  try {
    const { username, password, repeatPassword } = req.body;

    // Validate username
    console.log("aaa");
    const usernameValidation = usernameSchema.validate(username);
    console.log("bbb");

    if (usernameValidation.error) {
      return res
        .status(400)
        .json({ error: usernameValidation.error.message, field: "username" });
    }
    // Validate password
    const passwordValidation = passwordSchema.validate(password);
    if (passwordValidation.error) {
      return res
        .status(400)
        .json({ error: passwordValidation.error.message, field: "password" });
    }
    // Validate repeated password
    const repeatedPasswordValidation = passwordSchema.validate(repeatPassword);
    if (passwordValidation.error) {
      return res.status(400).json({
        error: repeatedPasswordValidation.error.message,
        field: "repeatPassword",
      });
    }

    if (password !== repeatPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const isUserAvailable = await UserModel.findOne({ username });
    if (isUserAvailable) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });
    return res.status(200).json();
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const test = async (req, res) => {
  try {
    console.log("req.user ", req.user);
    console.log("--------test--------");
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { registration, test };
