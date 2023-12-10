const bcrypt = require("bcrypt");
const { Consts } = require("../../helpers/consts");
const openai = require("../../../config/openai");

const UserModel = require("../../models/UserModel");
const TaskModel = require("../../models/TaskModel");

const getMathTask = async (req, res) => {
  try {
    const hard = !!req.query.hard;
    const easy = !!req.query.easy;

    const taskId = req.query.taskId;

    const taskName = await TaskModel.findOne({ _id: taskId });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: hard
            ? taskName.difficultQueryText
            : easy
            ? taskName.easyQueryText
            : taskName.regularQueryText,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    const task = JSON.parse(completion.choices[0].message.content)?.task;

    if (!task) {
      return res.status(400).json({ error: "task not found" });
    }

    return res.status(200).json({
      task,
      hardness: !hard && !easy ? "regular" : hard ? "hard" : "easy",
    });
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getMathTask,
};
