"use client";

import Navbar from '@/components/Navbar';
import ThreeBackground from "@/components/ThreeBackground"; // Imported to sync background styles
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const CreateTask = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState(""); // New State
  const [domain, setDomain] = useState("Technical"); // New State
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Focus and hover active styles tracking
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [aiHovered, setAiHovered] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);

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
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          priority, 
          columnId: "todo", // Forces newly created cards directly into your "To Do" track
          assignee: assignee.trim() || "Unassigned", // New dynamic property
          domain, // New dynamic property
          dueDate: dueDate ? new Date(dueDate).toISOString() : null 
        }),
      });
      
      if (!response.ok) throw new Error("Creation failed");
      
      router.push("/dashboard");
      router.refresh();
    } catch { 
      alert("Failed to create task."); 
    } finally { 
      setSubmitting(false); 
    }
  }

  // Consistent dynamic layout inputs matching dashboard properties
  const getInputStyle = (fieldName: string) => ({
    width: "100%", 
    padding: "12px 16px", 
    borderRadius: "12px",
    background: focusedInput === fieldName ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", 
    border: focusedInput === fieldName ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.06)",
    color: "white", 
    fontSize: "14px", 
    outline: "none",
    fontFamily: "system-ui, sans-serif",
    boxShadow: focusedInput === fieldName ? "0 0 20px rgba(124,58,237,0.15)" : "none",
    transition: "all 0.2s ease",
  });

  const labelStyle = {
    fontSize: "12px", 
    fontWeight: 700, 
    color: "#6b7280",
    marginBottom: "8px", 
    display: "block", 
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050010", color: "white", fontFamily: "system-ui, sans-serif" }}>

      {/* Synchronized Canvas Engine View */}
      <ThreeBackground />

      {/* Background blobs matching dashboard layers */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>

          {/* Core Container Card Wrapper */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "24px", 
            padding: "40px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 40px rgba(124,58,237,0.05)",
          }}>

            {/* Header */}
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>
                Create{" "}
                <span style={{
                  background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>Task</span>
              </h1>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>Add a new task to your interactive board</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Title Input */}
              <div>
                <label style={labelStyle}>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design the club homepage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocusedInput("title")}
                  onBlur={() => setFocusedInput(null)}
                  style={getInputStyle("title")}
                  required
                />
              </div>

              {/* Description Textarea Field */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Description</label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={generating}
                    onMouseEnter={() => setAiHovered(true)}
                    onMouseLeave={() => setAiHovered(false)}
                    style={{
                      padding: "6px 14px", 
                      borderRadius: "8px", 
                      fontSize: "12px",
                      fontWeight: 700, 
                      color: generating ? "rgba(255,255,255,0.4)" : "#fff",
                      background: generating 
                        ? "rgba(167,139,250,0.1)" 
                        : aiHovered 
                          ? "linear-gradient(135deg, #b39ddb, #f06292)" 
                          : "linear-gradient(135deg, #7c3aed, #ec4899)",
                      border: "none", 
                      cursor: generating ? "not-allowed" : "pointer",
                      boxShadow: generating ? "none" : aiHovered ? "0 0 20px rgba(236,72,153,0.5)" : "0 0 12px rgba(124,58,237,0.3)",
                      transform: aiHovered && !generating ? "translateY(-1px)" : "translateY(0)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {generating ? "✨ Thinking..." : "✨ AI Generate"}
                  </button>
                </div>
                <textarea
                  placeholder="Describe the task or click AI Generate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setFocusedInput("description")}
                  onBlur={() => setFocusedInput(null)}
                  rows={4}
                  style={{ ...getInputStyle("description"), resize: "vertical" }}
                  required
                />
              </div>

              {/* Task Assignee Input */}
              <div>
                <label style={labelStyle}>Assignee / Responsible Team</label>
                <input
                  type="text"
                  placeholder="e.g. Hema, Design Core, Web Dev Team"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  onFocus={() => setFocusedInput("assignee")}
                  onBlur={() => setFocusedInput(null)}
                  style={getInputStyle("assignee")}
                />
              </div>

              {/* Club Domain Picker */}
              <div>
                <label style={labelStyle}>Club Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onFocus={() => setFocusedInput("domain")}
                  onBlur={() => setFocusedInput(null)}
                  style={{ ...getInputStyle("domain"), colorScheme: "dark", cursor: "pointer" }}
                >
                  <option value="Technical">💻 Technical</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Management">📊 Management</option>
                  <option value="Media">📸 Media & Publicity</option>
                </select>
              </div>

              {/* Priority Radio Buttons Layer */}
              <div>
                <label style={labelStyle}>Priority</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                  {[
                    { value: "low", label: "🟢 Low", color: "#10b981", glow: "rgba(16,185,129,0.3)" },
                    { value: "medium", label: "🟡 Medium", color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
                    { value: "high", label: "🔴 High", color: "#ef4444", glow: "rgba(239,68,68,0.3)" },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      style={{
                        padding: "12px", 
                        borderRadius: "12px", 
                        fontSize: "13px",
                        fontWeight: 700, 
                        cursor: "pointer",
                        background: priority === p.value ? `${p.color}15` : "rgba(255,255,255,0.02)",
                        border: priority === p.value ? `1px solid ${p.color}` : "1px solid rgba(255,255,255,0.06)",
                        color: priority === p.value ? p.color : "#6b7280",
                        transition: "all 0.2s ease",
                        boxShadow: priority === p.value ? `0 0 20px ${p.glow}` : "none",
                        transform: priority === p.value ? "translateY(-1px)" : "translateY(0)",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date Element */}
              <div>
                <label style={labelStyle}>Due Date (Optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  onFocus={() => setFocusedInput("dueDate")}
                  onBlur={() => setFocusedInput(null)}
                  style={{ ...getInputStyle("dueDate"), colorScheme: "dark" }}
                />
              </div>

              {/* Navigation Actions Row */}
              <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  onMouseEnter={() => setCancelHovered(true)}
                  onMouseLeave={() => setCancelHovered(false)}
                  style={{
                    flex: "1",
                    padding: "14px",
                    borderRadius: "14px",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: cancelHovered ? "white" : "#6b7280",
                    background: cancelHovered ? "rgba(255,255,255,0.05)" : "transparent",
                    border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  onMouseEnter={() => setSubmitHovered(true)}
                  onMouseLeave={() => setSubmitHovered(false)}
                  style={{
                    flex: "2", 
                    padding: "14px", 
                    borderRadius: "14px",
                    fontSize: "15px", 
                    fontWeight: 800, 
                    color: "#fff",
                    background: submitting 
                      ? "rgba(124,58,237,0.3)" 
                      : submitHovered 
                        ? "linear-gradient(135deg, #8b5cf6, #f43f5e)" 
                        : "linear-gradient(135deg, #7c3aed, #ec4899)",
                    border: "none", 
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : submitHovered ? "0 0 40px rgba(124,58,237,0.6)" : "0 0 24px rgba(124,58,237,0.4)",
                    transform: submitHovered && !submitting ? "translateY(-2px)" : "translateY(0)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {submitting ? "Creating Custom Instance..." : "Create Task →"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;