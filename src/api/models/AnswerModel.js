const mongoose = require("mongoose");

const taskModelSchema = mongoose.Schema(
  {
    taskType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    correctness: {
      type: Boolean,
    },
    hintUsed: {
      type: Boolean,
      default: false,
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Answer", taskModelSchema);
