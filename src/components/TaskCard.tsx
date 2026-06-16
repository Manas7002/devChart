"use client";

type TaskCardProps = {
    id: string; // Passed down from dashboard map context
    title: string;
    description: string;
    priority: string;
    completion: boolean;
    dueDate?: string | null;
};

const TaskCard = ({ id, title, description, priority, completion, dueDate }: TaskCardProps) => {
    const isOverdue = dueDate && !completion && new Date(dueDate) < new Date();

    const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
        high: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "High" },
        medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", label: "Medium" },
        low: { color: "#10b981", bg: "rgba(16,185,129,0.1)", label: "Low" },
    };

    const p = priorityConfig[priority.toLowerCase()] || priorityConfig.low;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                window.location.reload(); // Re-fetch layout updates immediately
            } else {
                alert("Failed to delete the task.");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div style={{
            background: "rgba(255,255,255,0.03)",
            border: isOverdue ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            padding: "14px",
            cursor: "grab",
            transition: "all 0.2s",
            boxShadow: isOverdue ? "0 0 12px rgba(239,68,68,0.1)" : "none",
        }}>
            {/* Priority badge */}
            <div style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: p.bg, border: `1px solid ${p.color}30`,
                borderRadius: "100px", padding: "3px 10px",
                marginBottom: "10px",
            }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: p.color }} />
                <span style={{ fontSize: "11px", fontWeight: 700, color: p.color }}>{p.label}</span>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "8px", lineHeight: 1.4 }}>
                {title}
            </h3>

            {/* Description */}
            <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6, marginBottom: "10px" }}>
                {description}
            </p>

            {/* Footer row containing due date and delete layout */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
                {dueDate ? (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        fontSize: "11px", fontWeight: 600,
                        color: isOverdue ? "#ef4444" : "#6b7280",
                    }}>
                        {isOverdue ? "⚠️ Overdue:" : "📅"}
                        {formatDate(dueDate)}
                    </div>
                ) : (
                    <div style={{ fontSize: "11px", color: "#374151" }}>No due date</div>
                )}

                {/* Styled Delete button */}
                <button
                    onClick={handleDelete}
                    style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                    Delete
                </button>
            </div>

            {/* Completed badge */}
            {completion && (
                <div style={{
                    marginTop: "10px", paddingTop: "10px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "11px", fontWeight: 700, color: "#10b981",
                }}>
                    ✅ Completed
                </div>
            )}
        </div>
    );
};

export default TaskCard;