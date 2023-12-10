const mongoose = require("mongoose");

const taskModelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    class: {
      type: Number,
      required: true,
    },
    regularQueryText: {
      type: String,
      required: true,
    },
    easyQueryText: {
      type: String,
      required: true,
    },
    difficultQueryText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskModelSchema);
