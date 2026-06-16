import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#050010", color: "white", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(5,0,16,0.7)", backdropFilter: "blur(20px)",
      }}>
        <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#a78bfa" }}>dev</span>
          <span style={{ color: "white" }}>Chart</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard">
            <button style={{
              padding: "8px 20px", borderRadius: "12px", fontSize: "14px",
              fontWeight: 600, color: "#9ca3af", background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
            }}>Dashboard</button>
          </Link>
          <Link href="/create-task">
            <button style={{
              padding: "8px 20px", borderRadius: "12px", fontSize: "14px",
              fontWeight: 700, color: "#000",
              background: "linear-gradient(135deg, #a78bfa, #ec4899)",
              border: "none", cursor: "pointer",
              boxShadow: "0 0 20px rgba(167,139,250,0.4)",
            }}>+ Create Task</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 65px)", textAlign: "center", padding: "40px 24px" }}>

        {/* Blobs */}
        <div style={{ position: "absolute", top: "10%", left: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "20%", right: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "30%", width: "600px", height: "300px", background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }} />

        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px", pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(139,92,246,0.1)", border: "1px solid rgba(167,139,250,0.25)",
            color: "#a78bfa", fontSize: "11px", fontWeight: 700,
            padding: "6px 16px", borderRadius: "100px", marginBottom: "40px",
            letterSpacing: "2px", textTransform: "uppercase",
          }}>
            <span style={{ width: "6px", height: "6px", background: "#a78bfa", borderRadius: "50%", boxShadow: "0 0 8px #a78bfa" }} />
            Club Collaboration Platform
          </div>

          {/* Heading */}
          <div style={{ fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-4px", marginBottom: "28px" }}>
            <div style={{ color: "white" }}>Manage.</div>
            <div style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #2dd4bf 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Collaborate.</div>
            <div style={{ color: "white" }}>Ship.</div>
          </div>

          <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "500px", margin: "0 auto 48px", lineHeight: 1.7 }}>
            The modern task management platform built for student clubs that move fast and build together.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "80px", flexWrap: "wrap" }}>
            <Link href="/dashboard">
              <button style={{
                padding: "16px 40px", borderRadius: "16px", fontSize: "16px",
                fontWeight: 800, color: "#fff", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 0 40px rgba(124,58,237,0.4), 0 8px 32px rgba(0,0,0,0.4)",
              }}>
                Open Dashboard →
              </button>
            </Link>
            <Link href="/create-task">
              <button style={{
                padding: "16px 40px", borderRadius: "16px", fontSize: "16px",
                fontWeight: 700, color: "white", cursor: "pointer",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                Create First Task
              </button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", maxWidth: "800px", margin: "0 auto" }}>
            {[
              { icon: "🗂️", label: "Kanban Board", desc: "Drag & drop tasks", color: "#7c3aed" },
              { icon: "✨", label: "AI Assist", desc: "Smart descriptions", color: "#ec4899" },
              { icon: "📅", label: "Due Dates", desc: "Never miss deadlines", color: "#2dd4bf" },
              { icon: "⚡", label: "Activity Feed", desc: "Track every move", color: "#f59e0b" },
            ].map((f) => (
              <div key={f.label} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: "20px 16px", textAlign: "left",
                transition: "all 0.2s",
                boxShadow: `0 0 20px ${f.color}10`,
              }}>
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>{f.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "5px" }}>{f.label}</div>
                <div style={{ fontSize: "12px", color: "#4b5563" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}