const bcrypt = require("bcrypt");
const { Consts } = require("../../helpers/consts");
const {
  usernameSchema,
  passwordSchema,
} = require("../../joi-validator/schemas");
const { generateAccessToken } = require("../../helpers/functions");

const UserModel = require("../../models/UserModel");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate username
    const usernameValidation = usernameSchema.validate(username);
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

    const user = await UserModel.findOne({ username });

    let accessToken;

    if (user && (await bcrypt.compare(password, user.password))) {
      accessToken = generateAccessToken();

      // Update user's access token in the database
      user.accessToken = accessToken;
      await user.save();
    } else {
      return res
        .status(401)
        .json({ error: Consts.NOT_VALID_USERNAME_OR_PASSWORD });
    }

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    return res.status(200).json({ ...userWithoutPassword, accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ error: Consts.SOMETHING_WENT_WRONG, details: error });
  }
};

module.exports = {
  login,
};
