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
  { id: "todo", label: "To Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "done", label: "Done" },
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

  useEffect(() => {
    fetchTasks();
    fetchLogs();
  }, []);

  async function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStage = destination.droppableId as Task["stage"];

    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, stage: newStage } : t))
    );

    await fetch(`/api/tasks/${draggableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });

    fetchLogs();
  }

  const getColumnTasks = (stage: string) =>
    tasks.filter((t) => t.stage === stage);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-teal-200">Dashboard</h1>
          <Link
            href="/create-task"
            className="bg-teal-400 text-black font-bold px-6 py-2 rounded-xl hover:bg-teal-300 transition"
          >
            + New Task
          </Link>
        </div>

        <div className="flex gap-6">
          {loading ? (
            <p className="text-gray-400 text-center mt-20">Loading tasks...</p>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-3 gap-6 flex-1">
                {COLUMNS.map((col) => (
                  <div key={col.id} className="bg-gray-900 rounded-2xl p-4">
                    <h2 className="text-xl font-bold text-teal-300 mb-4">
                      {col.label}
                      <span className="ml-2 text-sm text-gray-400">
                        ({getColumnTasks(col.id).length})
                      </span>
                    </h2>
                    <Droppable droppableId={col.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[400px] flex flex-col gap-3"
                        >
                          {getColumnTasks(col.id).length === 0 && (
                            <p className="text-gray-600 text-sm text-center mt-10">
                              No tasks here
                            </p>
                          )}
                          {getColumnTasks(col.id).map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard
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
          <div className="w-72 bg-gray-900 rounded-2xl p-4 h-fit">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Activity Feed</h2>
            {logs.length === 0 ? (
              <p className="text-gray-600 text-sm">No activity yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {logs.map((log) => (
                  <div key={log._id} className="border-b border-gray-700 pb-2">
                    <p className="text-sm text-gray-200">{getLogMessage(log)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(log.createdAt)}</p>
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