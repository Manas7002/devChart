"use client";

import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  stage: "todo" | "inprogress" | "done";
  dueDate: string | null;
};

type ActivityLog = {
  _id: string;
  action: string;
  taskTitle: string;
  from: string | null;
  to: string | null;
  createdAt: string;
};

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#6366f1", glow: "rgba(99,102,241,0.3)" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { id: "done", label: "Done", color: "#10b981", glow: "rgba(16,185,129,0.3)" },
];

const stageLabel: Record<string, string> = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingLogs, setRefreshingLogs] = useState(false);

  async function fetchTasks() {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function fetchLogs() {
    setRefreshingLogs(true);
    try {
      const response = await fetch("/api/activity");
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setTimeout(() => setRefreshingLogs(false), 400);
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, []);

  async function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStage = destination.droppableId as Task["stage"];
    
    // Instantly move the task on screen so the UI feels fast and responsive
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, stage: newStage } : t))
    );

    try {
      // Wait for the backend update to finish processing completely
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (response.ok) {
        // Give the backend a brief moment to finish saving the log document, then refresh the feed
        setTimeout(async () => {
          await fetchLogs();
          await fetchTasks(); // Cleanly sync task numbers/counters
        }, 300);
      }
    } catch (error) {
      console.error("Error saving drag drop change:", error);
    }
  }

  const handleClearAllLogs = async () => {
    if (!confirm("Are you sure you want to clear all activity history? This cannot be undone.")) return;
    try {
      const res = await fetch("/api/activity", { method: "DELETE" });
      if (res.ok) {
        setLogs([]); // Immediately wipe from view state
      } else {
        alert("Failed to clear historical records.");
      }
    } catch (error) {
      console.error("Error clearing feed records:", error);
    }
  };

  const getColumnTasks = (stage: string) => tasks.filter((t) => t.stage === stage);

  const getLogMessage = (log: ActivityLog) => {
    if (log.action === "created") return `✅ "${log.taskTitle}" was created`;
    if (log.action === "moved") return `🔀 "${log.taskTitle}" moved from ${stageLabel[log.from!]} to ${stageLabel[log.to!]}`;
    if (log.action === "deleted") return `🗑️ "${log.taskTitle}" was deleted`;
    return "";
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.stage === "done").length;
  const overdueTasks = tasks.filter((t) => t.dueDate && t.stage !== "done" && new Date(t.dueDate) < new Date()).length;

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "32px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-1px" }}>Dashboard</h1>
            <p style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>Manage and track your team's tasks</p>
          </div>
          <Link href="/create-task">
            <button style={{
              padding: "10px 24px", borderRadius: "12px", fontSize: "14px",
              fontWeight: 700, color: "#000", background: "linear-gradient(135deg, #2dd4bf, #34d399)",
              border: "none", cursor: "pointer",
              boxShadow: "0 0 20px rgba(45,212,191,0.3)",
            }}>
              + New Task
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px", maxWidth: "400px" }}>
          {[
            { label: "Total Tasks", value: totalTasks, color: "#2dd4bf", glow: "rgba(45,212,191,0.2)" },
            { label: "Completed", value: doneTasks, color: "#10b981", glow: "rgba(16,185,129,0.2)" },
            { label: "Overdue", value: overdueTasks, color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px", padding: "20px",
              boxShadow: `0 0 20px ${s.glow}`,
            }}>
              <div style={{ fontSize: "32px", fontWeight: 900, color: s.color, textShadow: `0 0 20px ${s.color}` }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", gap: "24px" }}>
          {loading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
              <p style={{ color: "#4b5563" }}>Loading tasks...</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {COLUMNS.map((col) => (
                  <div key={col.id} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "20px", padding: "20px",
                    backdropFilter: "blur(10px)",
                    boxShadow: `0 0 30px ${col.glow}10`,
                  }}>
                    {/* Column header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{
                        width: "10px", height: "10px", borderRadius: "50%",
                        background: col.color,
                        boxShadow: `0 0 12px ${col.color}, 0 0 24px ${col.color}40`,
                      }} />
                      <h2 style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>{col.label}</h2>
                      <span style={{
                        marginLeft: "auto",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#6b7280", fontSize: "12px", fontWeight: 600,
                        padding: "2px 8px", borderRadius: "100px",
                      }}>
                        {getColumnTasks(col.id).length}
                      </span>
                    </div>

                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            minHeight: "400px", display: "flex", flexDirection: "column", gap: "10px",
                            background: snapshot.isDraggingOver ? `${col.glow}08` : "transparent",
                            borderRadius: "12px", transition: "background 0.2s",
                            padding: "4px",
                          }}
                        >
                          {getColumnTasks(col.id).length === 0 && (
                            <div style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              height: "100px", color: "#374151", fontSize: "13px",
                              border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "12px",
                            }}>
                              Drop tasks here
                            </div>
                          )}
                          {getColumnTasks(col.id).map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.85 : 1,
                                    transform: snapshot.isDragging
                                      ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                      : provided.draggableProps.style?.transform,
                                  }}
                                >
                                  <TaskCard
                                    id={task._id}
                                    title={task.title}
                                    description={task.description}
                                    priority={task.priority}
                                    completion={task.stage === "done"}
                                    dueDate={task.dueDate}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          )}

          {/* Activity Feed Container */}
          <div style={{
            width: "280px", flexShrink: 0,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px", padding: "20px",
            height: "fit-content",
            backdropFilter: "blur(10px)",
          }}>
            {/* Header Text */}
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{
                width: "8px", height: "8px", background: "#10b981",
                borderRadius: "50%", display: "inline-block",
                boxShadow: "0 0 8px #10b981, 0 0 16px #10b98140",
              }} />
              Activity Feed
            </h2>

            {/* Custom Control Row (Refresh + Clear All Actions) */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <button
                onClick={fetchLogs}
                disabled={refreshingLogs}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", color: "#9ca3af", fontSize: "12px", fontWeight: 600,
                  padding: "6px 10px", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                {refreshingLogs ? "⏳" : "🔄"} Refresh
              </button>

              <button
                onClick={handleClearAllLogs}
                style={{
                  flex: 1, background: "rgba(239, 68, 68, 0.04)", border: "1px solid rgba(239, 68, 68, 0.15)",
                  borderRadius: "8px", color: "#ef4444", fontSize: "12px", fontWeight: 600,
                  padding: "6px 10px", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.04)"}
              >
                🗑️ Clear All
              </button>
            </div>

            {logs.length === 0 ? (
              <p style={{ color: "#4b5563", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>No activity yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto", paddingRight: "4px" }}>
                {logs.map((log) => (
                  <div key={log._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#d1d5db", lineHeight: 1.5, margin: 0 }}>{getLogMessage(log)}</p>
                    <p style={{ fontSize: "11px", color: "#4b5563", marginTop: "4px", margin: "4px 0 0 0" }}>{formatTime(log.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}