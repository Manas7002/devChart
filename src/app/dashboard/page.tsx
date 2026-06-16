"use client";

import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import ThreeBackground from "@/components/ThreeBackground";
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
  { id: "todo", label: "To Do", color: "#7c3aed", glow: "rgba(124,58,237,0.3)" },
  { id: "inprogress", label: "In Progress", color: "#ec4899", glow: "rgba(236,72,153,0.3)" },
  { id: "done", label: "Done", color: "#2dd4bf", glow: "rgba(45,212,191,0.3)" },
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
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  async function fetchTasks() {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function fetchLogs() {
    const response = await fetch("/api/activity");
    const data = await response.json();
    setLogs(Array.isArray(data) ? data : []);
  }

  async function clearLogs() {
    await fetch("/api/activity", { method: "DELETE" });
    setLogs([]);
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
    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, stage: newStage } : t))
    );

    const newLog: ActivityLog = {
      _id: Date.now().toString(),
      action: "moved",
      taskTitle: task.title,
      from: task.stage,
      to: newStage,
      createdAt: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 20));

    fetch(`/api/tasks/${draggableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
  }

  const getColumnTasks = (stage: string) => tasks.filter((t) => t.stage === stage);

  const getLogMessage = (log: ActivityLog) => {
    if (log.action === "created") return `✅ "${log.taskTitle}" was created`;
    if (log.action === "moved") return `🔀 "${log.taskTitle}" moved from ${stageLabel[log.from!]} to ${stageLabel[log.to!]}`;
    if (log.action === "deleted") return `🗑️ "${log.taskTitle}" was deleted`;
    return "";
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.stage === "done").length;
  const overdueTasks = tasks.filter((t) => t.dueDate && t.stage !== "done" && new Date(t.dueDate) < new Date()).length;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#050010", color: "white", fontFamily: "system-ui, sans-serif" }}>

      <ThreeBackground />

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "40%", width: "500px", height: "300px", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div style={{ padding: "32px 40px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-1px" }}>Dashboard</h1>
              <p style={{ color: "#4b5563", fontSize: "14px", marginTop: "4px" }}>Manage and track your team's tasks</p>
            </div>
            <Link href="/create-task">
              <button
                style={{
                  padding: "10px 24px", borderRadius: "12px", fontSize: "14px",
                  fontWeight: 700, color: "#fff",
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 0 24px rgba(124,58,237,0.4)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(124,58,237,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(124,58,237,0.4)";
                }}
              >
                + New Task
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px", maxWidth: "600px" }}>
            {[
              { label: "Total Tasks", value: totalTasks, color: "#a78bfa", glow: "rgba(167,139,250,0.2)" },
              { label: "Completed", value: doneTasks, color: "#2dd4bf", glow: "rgba(45,212,191,0.2)" },
              { label: "Overdue", value: overdueTasks, color: "#ef4444", glow: "rgba(239,68,68,0.2)" },
              { label: "Progress", value: `${progress}%`, color: "#ec4899", glow: "rgba(236,72,153,0.2)" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px", padding: "20px",
                  boxShadow: `0 0 20px ${s.glow}`,
                  transition: "all 0.2s", cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 0 30px ${s.glow}`;
                  e.currentTarget.style.border = `1px solid ${s.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = `0 0 20px ${s.glow}`;
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: 900, color: s.color, textShadow: `0 0 20px ${s.color}` }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "32px", maxWidth: "600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>OVERALL PROGRESS</span>
              <span style={{ fontSize: "12px", color: "#a78bfa", fontWeight: 700 }}>{progress}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #ec4899, #2dd4bf)",
                borderRadius: "100px",
                transition: "width 0.5s ease",
                boxShadow: "0 0 10px rgba(124,58,237,0.5)",
              }} />
            </div>
          </div>

          {/* Main */}
          <div style={{ display: "flex", gap: "24px" }}>
            {loading ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "400px" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚡</div>
                  <p style={{ color: "#4b5563" }}>Loading tasks...</p>
                </div>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {COLUMNS.map((col) => (
                    <div
                      key={col.id}
                      onMouseEnter={() => setHoveredCol(col.id)}
                      onMouseLeave={() => setHoveredCol(null)}
                      style={{
                        background: hoveredCol === col.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                        border: hoveredCol === col.id ? `1px solid ${col.color}30` : "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "20px", padding: "20px",
                        backdropFilter: "blur(10px)",
                        boxShadow: hoveredCol === col.id ? `0 0 40px ${col.glow}25` : `0 0 30px ${col.glow}15`,
                        transition: "all 0.3s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                        <div style={{
                          width: "10px", height: "10px", borderRadius: "50%",
                          background: col.color,
                          boxShadow: `0 0 12px ${col.color}, 0 0 24px ${col.color}60`,
                        }} />
                        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>{col.label}</h2>
                        <span style={{
                          marginLeft: "auto",
                          background: hoveredCol === col.id ? `${col.color}20` : "rgba(255,255,255,0.06)",
                          border: hoveredCol === col.id ? `1px solid ${col.color}40` : "1px solid rgba(255,255,255,0.08)",
                          color: hoveredCol === col.id ? col.color : "#6b7280",
                          fontSize: "12px", fontWeight: 600,
                          padding: "2px 8px", borderRadius: "100px",
                          transition: "all 0.3s",
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
                              background: snapshot.isDraggingOver ? `${col.glow}15` : "transparent",
                              borderRadius: "12px", transition: "background 0.2s", padding: "4px",
                              border: snapshot.isDraggingOver ? `1px dashed ${col.color}40` : "1px solid transparent",
                            }}
                          >
                            {getColumnTasks(col.id).length === 0 && (
                              <div style={{
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                height: "100px", color: "#374151", fontSize: "13px",
                                border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "12px", gap: "8px",
                              }}>
                                <span style={{ fontSize: "20px" }}>✦</span>
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
                                        ? `${provided.draggableProps.style?.transform} rotate(2deg) scale(1.02)`
                                        : provided.draggableProps.style?.transform,
                                      filter: snapshot.isDragging ? `drop-shadow(0 0 12px ${col.color}60)` : "none",
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

            {/* Activity Feed */}
            <div style={{
              width: "260px", flexShrink: 0,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "20px", padding: "20px",
              height: "fit-content", backdropFilter: "blur(10px)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{
                    width: "8px", height: "8px", background: "#a78bfa",
                    borderRadius: "50%", display: "inline-block",
                    boxShadow: "0 0 8px #a78bfa, 0 0 16px #a78bfa40",
                  }} />
                  Activity Feed
                </h2>
                {logs.length > 0 && (
                  <button
                    onClick={clearLogs}
                    style={{
                      padding: "4px 10px", borderRadius: "8px", fontSize: "11px",
                      fontWeight: 600, color: "#ef4444",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
                    }}
                  >
                    🗑️ Clear
                  </button>
                )}
              </div>
              {logs.length === 0 ? (
                <p style={{ color: "#374151", fontSize: "13px" }}>No activity yet</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                  {logs.map((log) => (
                    <div key={log._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "12px" }}>
                      <p style={{ fontSize: "12px", color: "#d1d5db", lineHeight: 1.5 }}>{getLogMessage(log)}</p>
                      <p style={{ fontSize: "11px", color: "#374151", marginTop: "4px" }}>{formatTime(log.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}