"use client";

import React from "react";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  priority: string; // "low" | "medium" | "high"
  completion?: boolean;
  dueDate: string | null;
  isSyncing?: boolean; // Ready for the Optimistic UI part later!
}

export default function TaskCard({
  title,
  description,
  priority,
  completion,
  dueDate,
  isSyncing = false,
}: TaskCardProps) {
  
  // Calculate if the task is past its due date and not completed yet
  const isOverdue = React.useMemo(() => {
    if (!dueDate || completion) return false;
    return new Date(dueDate) < new Date();
  }, [dueDate, completion]);

  // Color mapping configurations for our glassmorphic priority badges
  const priorityStyles = React.useMemo(() => {
    const p = priority?.toLowerCase();
    if (p === "high") {
      return {
        bg: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        color: "#f87171",
        textShadow: "0 0 8px rgba(239, 68, 68, 0.6)",
      };
    }
    if (p === "medium") {
      return {
        bg: "rgba(245, 158, 11, 0.1)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        color: "#fbbf24",
        textShadow: "none",
      };
    }
    return {
      bg: "rgba(59, 130, 246, 0.1)",
      border: "1px solid rgba(59, 130, 246, 0.3)",
      color: "#60a5fa",
      textShadow: "none",
    };
  }, [priority]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: isOverdue 
          ? "1px solid rgba(239, 68, 68, 0.4)" 
          : "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "14px",
        padding: "16px",
        backdropFilter: "blur(8px)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: isOverdue ? "0 0 15px rgba(239, 68, 68, 0.2)" : "none",
        animation: isOverdue ? "pulseOverdue 2s infinite ease-in-out" : "none",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Dynamic injection of CSS Keyframes for the glowing crimson pulse */}
      {isOverdue && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulseOverdue {
            0% { box-shadow: 0 0 12px rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); }
            50% { box-shadow: 0 0 22px rgba(239, 68, 68, 0.45); border-color: rgba(239, 68, 68, 0.7); }
            100% { box-shadow: 0 0 12px rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.3); }
          }
        `}} />
      )}

      {/* Sync Loader spinner element wrapper (Ready for Part 4) */}
      {isSyncing && (
        <div style={{
          position: "absolute", top: "16px", right: "16px",
          width: "14px", height: "14px", border: "2px solid transparent",
          borderTopColor: "#a78bfa", borderRadius: "50%",
          animation: "spinCardLoader 0.6s linear infinite"
        }}>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spinCardLoader { to { transform: rotate(360deg); } }
          `}} />
        </div>
      )}

      {/* Top Meta Row: Badges & Due Date */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            padding: "2px 10px",
            borderRadius: "100px",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: priorityStyles.bg,
            border: priorityStyles.border,
            color: priorityStyles.color,
            textShadow: priorityStyles.textShadow,
          }}
        >
          {priority || "low"}
        </span>
        
        {dueDate && (
          <span style={{ fontSize: "11px", color: isOverdue ? "#f87171" : "#6b7280", fontWeight: 500 }}>
            {isOverdue ? "⚠️ Overdue: " : "📅 "}
            {formatDate(dueDate)}
          </span>
        )}
      </div>

      {/* Text Context */}
      <div>
        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "4px" }}>{title}</h4>
        <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.4" }}>{description}</p>
      </div>
    </div>
  );
}