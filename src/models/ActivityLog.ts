import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    taskTitle: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        default: null,
    },
    to: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ActivityLog = mongoose.models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);
export default ActivityLog;