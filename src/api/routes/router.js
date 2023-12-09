const express = require("express");
const router = express.Router();

//-------------------  middlewares -------------------
const { tokenChecker } = require("../middlewares/tokenCheckers");

//-------------------  controllers -------------------
const { login } = require("../controllers/login/LoginController");
const {
  registration,
  test,
} = require("../controllers/registration/RegistrationController");
const {
  getMathTask,
} = require("../controllers/games/GetMathTaskByTypeController");
const {
  getMathTaskTypes,
} = require("../controllers/games/GetAvailableTasksController");
const { getHelp } = require("../controllers/games/GetHelpController");
const {
  checkTaskCorrectness,
} = require("../controllers/games/CheckTaskCorrectnessController");

//-------------------  routes -------------------

router.post("/login", login);
router.post("/register", registration);
router.get("/new-task", /*tokenChecker,*/ getMathTask);
router.get("/task-types", tokenChecker, getMathTaskTypes);
router.get("/help", tokenChecker, getHelp);
router.post("/task-correctness", /*tokenChecker,*/ checkTaskCorrectness);

router.get("/test", tokenChecker, test);

module.exports = router;
