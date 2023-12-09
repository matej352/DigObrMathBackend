const { Consts } = require("../../helpers/consts");

const TaskModel = require("../../models/TaskModel");

const getMathTaskTypes = async (req, res) => {
  try {
    const classNumber = req.query.class;
    const taskTypes = await TaskModel.find({ class: classNumber });

    return res.status(200).json({ taskTypes });
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getMathTaskTypes,
};
