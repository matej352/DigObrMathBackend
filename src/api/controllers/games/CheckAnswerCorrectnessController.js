const openai = require("../../../config/openai");

const AnswerModel = require("../../models/AnswerModel");

const checkTaskCorrectness = async (req, res) => {
  try {
    const { task, answer, logId, taskType } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: `Is ${answer} the right solution to the task ${task} ! Set the key of the JSON to 'correctness' and the value to boolean depending on task correctness.`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    const correctness = JSON.parse(
      completion.choices[0].message.content
    )?.correctness;

    console.log("correctness: ", completion.choices[0].message, correctness);

    if (correctness !== true && correctness !== false) {
      return res
        .status(400)
        .json({ error: "problems with openai request and answer format" });
    }

    if (logId) {
      await AnswerModel.updateOne({ _id: logId }, { correctness });
    } else {
      await AnswerModel.create({
        task,
        answer,
        correctness,
        user: req.user._id,
        taskType,
        hintUsed: false,
      });
    }

    return res.status(200).json({
      correctness,
    });
  } catch (error) {
    console.error("error: ", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  checkTaskCorrectness,
};
