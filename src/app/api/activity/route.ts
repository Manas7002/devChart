import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Simple inline schema definition to match your database collection
const ActivitySchema = new mongoose.Schema({
  action: String,
  taskTitle: String,
  from: String,
  to: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'activities' });

const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

// GET: Fetch all logs
export async function GET() {
  try {
    await connectDB();
    const logs = await Activity.find().sort({ createdAt: -1 }).limit(30);
    return Response.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return Response.json({ message: "Failed to fetch logs" }, { status: 500 });
  }
}

// DELETE: Wipe out previous logs to start fresh
export async function DELETE() {
  try {
    await connectDB();
    await Activity.deleteMany({}); // Clears all entries in the collection
    return Response.json({ message: "Activity history cleared cleanly" });
  } catch (error) {
    console.error("Error clearing logs:", error);
    return Response.json({ message: "Failed to clear activity log" }, { status: 500 });
  }
}