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
    fontSize: "12px", fontWeight: 700, color: "#6b7280",
    marginBottom: "8px", display: "block", letterSpacing: "1px",
    textTransform: "uppercase" as const,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050010", color: "white", fontFamily: "system-ui, sans-serif" }}>

      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "48px 24px" }}>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>
              Create{" "}
              <span style={{
                background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>Task</span>
            </h1>
            <p style={{ color: "#4b5563", fontSize: "14px" }}>Add a new task to your board</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>Task Title</label>
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
                <label style={{ ...labelStyle, marginBottom: 0 }}>Description</label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={generating}
                  style={{
                    padding: "6px 14px", borderRadius: "8px", fontSize: "12px",
                    fontWeight: 700, color: "#000",
                    background: generating ? "rgba(167,139,250,0.3)" : "linear-gradient(135deg, #a78bfa, #ec4899)",
                    border: "none", cursor: generating ? "not-allowed" : "pointer",
                    boxShadow: generating ? "none" : "0 0 12px rgba(167,139,250,0.3)",
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
              <label style={labelStyle}>Priority</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { value: "low", label: "🟢 Low", color: "#10b981" },
                  { value: "medium", label: "🟡 Medium", color: "#f59e0b" },
                  { value: "high", label: "🔴 High", color: "#ef4444" },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    style={{
                      padding: "10px", borderRadius: "12px", fontSize: "13px",
                      fontWeight: 700, cursor: "pointer",
                      background: priority === p.value ? `${p.color}15` : "rgba(255,255,255,0.03)",
                      border: priority === p.value ? `1px solid ${p.color}50` : "1px solid rgba(255,255,255,0.06)",
                      color: priority === p.value ? p.color : "#6b7280",
                      transition: "all 0.15s",
                      boxShadow: priority === p.value ? `0 0 16px ${p.color}20` : "none",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label style={labelStyle}>Due Date (Optional)</label>
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
                fontSize: "15px", fontWeight: 800, color: "#fff",
                background: submitting ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg, #7c3aed, #ec4899)",
                border: "none", cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 0 30px rgba(124,58,237,0.3)",
                marginTop: "8px",
              }}
            >
              {submitting ? "Creating..." : "Create Task →"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;