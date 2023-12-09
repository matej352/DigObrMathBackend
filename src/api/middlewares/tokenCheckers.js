const { Consts } = require("../helpers/consts");

const UserModel = require("../models/UserModel");

const tokenChecker = async (req, res, next) => {
  let accessToken = req.headers.accesstoken;

  if (!accessToken) return res.status(401).json();

  const user = await UserModel.findOne({ accessToken });

  if (user) {
    req.user = user;
    next();
  } else return res.status(401).json();
};

module.exports = { tokenChecker };
