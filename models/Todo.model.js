const { Schema, model } = require("mongoose");

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    isUrgent: Boolean,
    image: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const Todo = model("Todo", todoSchema);

module.exports = Todo;
