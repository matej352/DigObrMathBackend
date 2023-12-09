const crypto = require("crypto");
const { Consts } = require("./consts");
const { default: mongoose } = require("mongoose");

const createSHA256Hash = async (string) => {
  const hash = await crypto.createHash("sha256").update(string).digest("hex");
  return hash;
};

const checkField = (value, type) => {
  if (type === "array" && !Array.isArray(value)) {
    return Consts.NOT_VALID_DATA_TYPE;
  } else if ((!value && value !== 0) || value.length === 0) {
    return Consts.MISSING_FIELD;
  } else if (type !== "array" && typeof value !== type) {
    return Consts.NOT_VALID_DATA_TYPE;
  }
  return;
};

const transformLogData = (logObj) => {
  let log = JSON.parse(JSON.stringify(logObj));
  log.logID = log._id.toString();
  delete log._id;

  if (!log.video) log.video = {};
  log.video.videoCreatedAt = log.video.createdAt || "video deleted";
  log.video.videoUpdatedAt = log.video.updatedAt || "video deleted";
  delete log.video.createdAt;
  delete log.video.updatedAt;

  if (!log.user) log.user = {};
  log.user.userCreatedAt = log.user?.createdAt || "user deleted";
  log.user.userUpdatedAt = log.user?.updatedAt || "user deleted";
  log.userID = log.user._id?.toString();
  delete log.user.createdAt;
  delete log.user.updatedAt;
  delete log.user._id;

  log.logCreatedAt = log.createdAt;
  log.logUpdatedAt = log.updatedAt;
  delete log.createdAt;
  delete log.updatedAt;

  const newData = {
    ...log, // Copy existing root-level properties
    ...log.video, // Copy properties from the "video" object
    ...log.user, // Copy properties from the "user" object
  };

  delete newData.video;
  delete newData.user;

  return newData;
};

const transformVideoData = (videoObj) => {
  let video = JSON.parse(JSON.stringify(videoObj));
  video.videoID = video._id.toString();
  delete video._id;

  video.categoryID = video.category._id.toString();
  video.categoryName = video.category.name;

  delete video.category;

  let countFalse = 1;
  for (const answer of video.answers) {
    if (answer.isCorrect) video.answerR = answer.option;
    else {
      video["answerW" + countFalse++] = answer.option;
    }
  }

  return video;
};

const makeObjIDs = (ids) => {
  var oids = [];
  ids.forEach(function (item) {
    oids.push(new mongoose.Types.ObjectId(item));
  });
  return oids;
};

const generateAccessToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 32;
  let accessToken = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    accessToken += characters.charAt(randomIndex);
  }

  return accessToken;
};

module.exports = {
  createSHA256Hash,
  checkField,
  transformLogData,
  transformVideoData,
  makeObjIDs,
  generateAccessToken,
};
