"use client";

import Navbar from '@/components/Navbar';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const CreateTask = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function generateDescription() {
    if (!title) { alert("Enter a task title first!"); return; }
    setGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority }),
      });
      const data = await response.json();
      setDescription(data.description);
    } catch { alert("Failed to generate description."); }
    finally { setGenerating(false); }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title || !description) { alert("Please fill in title and description."); return; }
    setSubmitting(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, dueDate: dueDate || null }),
      });
      router.push("/dashboard");
    } catch { alert("Failed to create task."); }
    finally { setSubmitting(false); }
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "12px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    color: "white", fontSize: "14px", outline: "none",
    fontFamily: "system-ui, sans-serif",
  };

  const labelStyle = {
    fontSize: "13px", fontWeight: 600, color: "#9ca3af",
    marginBottom: "8px", display: "block", letterSpacing: "0.3px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "white", letterSpacing: "-1px", marginBottom: "8px" }}>
            Create Task
          </h1>
          <p style={{ color: "#4b5563", fontSize: "14px" }}>Add a new task to your board</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>TASK TITLE</label>
            <input
              type="text"
              placeholder="e.g. Design the club homepage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>DESCRIPTION</label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generating}
                style={{
                  padding: "6px 14px", borderRadius: "8px", fontSize: "12px",
                  fontWeight: 700, color: "#000",
                  background: generating ? "#1a3a3a" : "linear-gradient(135deg, #2dd4bf, #34d399)",
                  border: "none", cursor: generating ? "not-allowed" : "pointer",
                  opacity: generating ? 0.7 : 1,
                }}
              >
                {generating ? "Generating..." : "✨ AI Generate"}
              </button>
            </div>
            <textarea
              placeholder="Describe the task or click AI Generate..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Priority */}
          <div>
            <label style={labelStyle}>PRIORITY</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[
                { value: "low", label: "Low", color: "#10b981" },
                { value: "medium", label: "Medium", color: "#f59e0b" },
                { value: "high", label: "High", color: "#ef4444" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  style={{
                    padding: "10px", borderRadius: "12px", fontSize: "13px",
                    fontWeight: 700, cursor: "pointer",
                    background: priority === p.value ? `${p.color}20` : "rgba(255,255,255,0.03)",
                    border: priority === p.value ? `1px solid ${p.color}60` : "1px solid rgba(255,255,255,0.06)",
                    color: priority === p.value ? p.color : "#6b7280",
                    transition: "all 0.15s",
                    boxShadow: priority === p.value ? `0 0 12px ${p.color}20` : "none",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label style={labelStyle}>DUE DATE (OPTIONAL)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%", padding: "14px", borderRadius: "14px",
              fontSize: "15px", fontWeight: 800, color: "#000",
              background: submitting ? "#1a3a3a" : "linear-gradient(135deg, #2dd4bf, #34d399)",
              border: "none", cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 0 24px rgba(45,212,191,0.25)",
              marginTop: "8px",
            }}
          >
            {submitting ? "Creating..." : "Create Task →"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateTask;