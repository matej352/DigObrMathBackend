const bcrypt = require("bcrypt");
const { Consts } = require("../../helpers/consts");
const openai = require("../../../config/openai");

const AnswerModel = require("../../models/AnswerModel");

const getHelp = async (req, res) => {
  try {
    const task = req.query.task;
    const taskType = req.query.taskType;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to answer as text.",
        },
        {
          role: "user",
          content: `How to solve task: ${task}. Just give hint and first step. Do not solve it.`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
    });

    const log = await AnswerModel.create({
      taskType,
      hintUsed: true,
      task,
      user: req.user._id,
    });

    return res
      .status(200)
      .json({ help: completion.choices[0].message.content, logId: log._id });
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  getHelp,
};
