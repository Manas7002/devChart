import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    stage: {
        type: String,
        enum: ["todo", "inprogress", "done"],
        default: "todo",
    },
    dueDate: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;