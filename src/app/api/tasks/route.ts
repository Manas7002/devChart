import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
    try {
        await connectDB();
        const tasks = await Task.find();
        return Response.json(tasks);
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const task = await Task.create({
            ...body,
            stage: body.stage || "todo",
            dueDate: body.dueDate || null,
        });

        await ActivityLog.create({
            action: "created",
            taskTitle: task.title,
            from: null,
            to: "todo",
        });

        return Response.json(task, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to create task" },
            { status: 500 }
        );
    }
}