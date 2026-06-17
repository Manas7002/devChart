"use client";

import React, { useState } from "react";

type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  priority: string;
  completion: boolean;
  dueDate: string | null;
  assignee?: string; // Enhanced property
  domain?: string;   // Enhanced property
  isSyncing?: boolean;
};

export default function TaskCard({
  id,
  title,
  description,
  priority,
  completion,
  dueDate,
  assignee = "Unassigned",
  domain = "Technical",
  isSyncing,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDesc, setEditDesc] = useState(description);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  };

  const domainColors: Record<string, string> = {
    technical: "#3b82f6",
    design: "#ec4899",
    management: "#10b981",
    media: "#f59e0b",
  };

  const activeColor = priorityColors[priority.toLowerCase()] || "#6b7280";
  const activeDomainColor = domainColors[domain.toLowerCase()] || "#a78bfa";

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
      setIsDeleting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      if (!response.ok) throw new Error("Update failed");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const isOverdue = !completion && dueDate && new Date(dueDate) < new Date();

  if (isEditing) {
    return (
      <div 
        onMouseDown={(e) => e.stopPropagation()} 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px", padding: "16px", backdropFilter: "blur(8px)",
          width: "100%", boxSizing: "border-box"
        }}
      >
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input 
            type="text" 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            required
            style={{
              background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px", padding: "8px 10px", color: "white", fontSize: "13px", outline: "none"
            }}
          />
          <textarea 
            value={editDesc} 
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            style={{
              background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px", padding: "8px 10px", color: "white", fontSize: "12px", outline: "none", resize: "none"
            }}
          />
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
              style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: "12px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none",
                borderRadius: "6px", padding: "6px 14px", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer"
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div 
      style={{
        background: "rgba(255, 255, 255, 0.01)",
        border: `1px solid ${isSyncing ? "rgba(124, 58, 237, 0.4)" : "rgba(255, 255, 255, 0.04)"}`,
        borderLeft: `4px solid ${activeColor}`,
        borderRadius: "14px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        backdropFilter: "blur(12px)",
        opacity: isDeleting ? 0.4 : 1,
        transition: "all 0.2s ease",
        width: "100%",
        boxSizing: "border-box",
        boxShadow: isSyncing ? "0 0 15px rgba(124, 58, 237, 0.1)" : "none",
      }}
    >
      {/* Top Header Row - Badge and Buttons Share This Space Equally */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{
            fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
            color: activeColor, background: `${activeColor}15`,
            padding: "4px 10px", borderRadius: "100px", border: `1px solid ${activeColor}30`
          }}>
            {priority}
          </span>
          <span style={{
            fontSize: "10px", fontWeight: 700, textTransform: "uppercase",
            color: activeDomainColor, background: `${activeDomainColor}15`,
            padding: "4px 10px", borderRadius: "100px", border: `1px solid ${activeDomainColor}30`
          }}>
            🏷️ {domain}
          </span>
        </div>

        {/* Action Panel Isolated Trigger Group */}
        <div 
          onMouseDown={(e) => e.stopPropagation()} 
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          {isSyncing ? (
            <span style={{ fontSize: "12px" }}>⏳</span>
          ) : (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                style={{ 
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", 
                  cursor: "pointer", fontSize: "12px", padding: "4px 8px", borderRadius: "6px", color: "white"
                }}
                title="Edit Task"
              >
                ✏️
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                style={{ 
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", 
                  cursor: "pointer", fontSize: "12px", padding: "4px 8px", borderRadius: "6px", color: "white"
                }}
                title="Delete Task"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Content Text Area */}
      <div>
        <h4 style={{
          fontSize: "14px", fontWeight: 700, color: "white", margin: "0 0 6px 0",
          textDecoration: completion ? "line-through" : "none",
          opacity: completion ? 0.5 : 1
        }}>
          {title}
        </h4>
        <p style={{
          fontSize: "12px", color: "#9ca3af", margin: 0,
          lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
          overflow: "hidden", textDecoration: completion ? "line-through" : "none",
          opacity: completion ? 0.5 : 1
        }}>
          {description}
        </p>
      </div>

      {/* Footer Area - Assignee details alongside Overdue/Due Date parameters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", fontSize: "11px" }}>
        <div style={{ color: "#a78bfa", fontWeight: 600 }}>
          👤 <span style={{ color: "#9ca3af", fontWeight: 500 }}>{assignee}</span>
        </div>

        {dueDate && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "6px", 
            fontWeight: 600, 
            color: isOverdue ? "#ef4444" : "#6b7280"
          }}>
            <span>{isOverdue ? "⚠️ Overdue: " : "📅 "}</span>
            <span>{formatDate(dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}