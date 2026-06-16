import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import ActivityLog from "@/models/ActivityLog";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        
        const oldTask = await Task.findById(id);
        const task = await Task.findByIdAndUpdate(id, body, { new: true });

        if (body.stage && oldTask && oldTask.stage !== body.stage) {
            await ActivityLog.create({
                action: "moved",
                taskTitle: task.title,
                from: oldTask.stage,
                to: body.stage,
            });
        }

        return Response.json(task);
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to update task" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const task = await Task.findById(id);
        await Task.findByIdAndDelete(id);

        if (task) {
            await ActivityLog.create({
                action: "deleted",
                taskTitle: task.title,
                from: task.stage,
                to: null,
            });
        }

        return Response.json({ message: "Task deleted" });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to delete task" },
            { status: 500 }
        );
    }
}