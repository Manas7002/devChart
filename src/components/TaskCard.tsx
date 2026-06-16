type TaskCardProps = {
    title: string;
    description: string;
    priority: string;
    completion: boolean;
    dueDate?: string | null;
};

const TaskCard = ({ title, description, priority, completion, dueDate }: TaskCardProps) => {
    const bgClass =
        priority.toLowerCase() === "high"
            ? "bg-red-400"
            : priority.toLowerCase() === "medium"
            ? "bg-yellow-400"
            : "bg-green-400";

    const isOverdue = dueDate && !completion && new Date(dueDate) < new Date();

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className={`flex h-auto w-full self-start flex-col rounded-2xl border-2 ${isOverdue ? "border-red-500" : "border-black"} overflow-hidden shrink-0`}>
            <div className={`p-3 text-xl font-bold text-white ${bgClass === "bg-red-400" ? "bg-red-600" : bgClass === "bg-yellow-400" ? "bg-yellow-600" : "bg-green-700"}`}>
                <h2>{title}</h2>
            </div>
            <div className={`p-3 ${bgClass}`}>
                <div className="rounded-xl border border-black bg-white bg-opacity-30 p-3 text-sm break-words text-black">
                    {description}
                </div>
                {dueDate && (
                    <div className={`mt-2 text-xs font-semibold ${isOverdue ? "text-red-800" : "text-gray-800"}`}>
                        {isOverdue ? "⚠️ Overdue: " : "📅 Due: "}
                        {formatDate(dueDate)}
                    </div>
                )}
                {completion && (
                    <div className="mt-2 text-xs font-bold text-green-900">✅ Completed</div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;