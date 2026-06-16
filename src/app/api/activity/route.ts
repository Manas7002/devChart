import connectDB from "@/lib/mongodb";
import ActivityLog from "@/models/ActivityLog";

export async function GET() {
    try {
        await connectDB();
        const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20);
        return Response.json(logs);
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to fetch activity logs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const log = await ActivityLog.create(body);
        return Response.json(log, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to create activity log" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await connectDB();
        await ActivityLog.deleteMany({});
        return Response.json({ message: "Activity log cleared" });
    } catch (error) {
        console.log(error);
        return Response.json({ message: "Failed to clear activity log" }, { status: 500 });
    }
}