import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

// Inline Task Schema definition matching your structure
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  stage: String,
  dueDate: Date,
});
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

// Inline Activity Schema definition to save logs cleanly
const ActivitySchema = new mongoose.Schema({
  action: String,
  taskTitle: String,
  from: String,
  to: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'activities' });
const Activity = mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

// ==========================================
// PATCH: Updates task stage AND writes logs
// ==========================================
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Updated to Promise type for Next.js 15/16
) {
  try {
    await connectDB();
    
    // Await the params before extracting the id
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    const body = await req.json();

    // 1. Find the current task before modifying it to know its old stage status
    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    const oldStage = existingTask.stage;
    const newStage = body.stage;

    // 2. Perform the task update in MongoDB
    const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });

    // 3. Generate and save the activity feed entry if it was a drag operation
    if (oldStage !== newStage) {
      await Activity.create({
        action: "moved",
        taskTitle: existingTask.title,
        from: oldStage,
        to: newStage,
        createdAt: new Date()
      });
    }

    return Response.json(updatedTask);
  } catch (error) {
    console.error("PATCH Error:", error);
    return Response.json({ message: "Failed to update task step layout" }, { status: 500 });
  }
}

// ==========================================
// DELETE: Deletes task AND adds a deletion log
// ==========================================
export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Updated to Promise type for Next.js 15/16
) {
  try {
    await connectDB();
    
    // Await the params before extracting the id
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    // Delete the task doc
    await Task.findByIdAndDelete(id);

    // Create a clean deletion log tracker entry
    await Activity.create({
      action: "deleted",
      taskTitle: existingTask.title,
      from: null,
      to: null,
      createdAt: new Date()
    });

    return Response.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return Response.json({ message: "Failed to delete target task document" }, { status: 500 });
  }
}