"use client";

import Navbar from '@/components/Navbar'
import React, { useState } from "react";

const CreateTask = () => {

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [priority, setPriority] = useState("low");
const [dueDate, setDueDate] = useState("");
const [generating, setGenerating] = useState(false);

async function generateDescription() {
    if (!title) {
        alert("Enter a task title first!");
        return;
    }
    setGenerating(true);
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, priority }),
        });
        const data = await response.json();
        setDescription(data.description);
    } catch (error) {
        alert("Failed to generate description.");
    } finally {
        setGenerating(false);
    }
}

async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, priority, dueDate: dueDate || null }),
        });
        const data = await response.json();
        console.log(data);
        setTitle("");
        setDescription("");
        setPriority("low");
        setDueDate("");
        alert("Task created successfully!");
    } catch (error) {
        console.error("Error creating task:", error);
        alert("Failed to create task.");
    }
}

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-5xl font-bold mb-8 text-teal-200">Create New Task</h1>

                <div className="flex flex-col gap-6">

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Task Title</h3>
                        <input
                            type="text"
                            placeholder="Enter task name..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-300">Description</h3>
                            <button
                                onClick={generateDescription}
                                disabled={generating}
                                className="bg-teal-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-teal-500 transition disabled:opacity-50"
                            >
                                {generating ? "Generating..." : "✨ AI Generate"}
                            </button>
                        </div>
                        <textarea
                            placeholder="Describe the task or click AI Generate..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Priority</h3>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Due Date</h3>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full p-3 bg-teal-500 text-black font-bold rounded-xl hover:bg-teal-400 transition"
                    >
                        Create Task
                    </button>

                </div>
            </div>
        </div>
    )
}

export default CreateTask