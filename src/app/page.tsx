import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>

      {/* Navbar */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(3,7,18,0.8)", backdropFilter: "blur(20px)",
      }}>
        <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#2dd4bf" }}>dev</span>
          <span style={{ color: "white" }}>Chart</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard">
            <button style={{
              padding: "8px 20px", borderRadius: "12px", fontSize: "14px",
              fontWeight: 600, color: "#9ca3af", background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
              transition: "all 0.2s",
            }}>Dashboard</button>
          </Link>
          <Link href="/create-task">
            <button style={{
              padding: "8px 20px", borderRadius: "12px", fontSize: "14px",
              fontWeight: 700, color: "#000", background: "#2dd4bf",
              border: "none", cursor: "pointer",
            }}>+ Create Task</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 65px)", textAlign: "center", padding: "40px 24px" }}>

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: "900px", height: "600px", background: "radial-gradient(ellipse, rgba(20,184,166,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "15%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(45,212,191,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px", pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", width: "100%" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(20,184,166,0.1)", border: "1px solid rgba(45,212,191,0.25)",
            color: "#2dd4bf", fontSize: "11px", fontWeight: 700,
            padding: "6px 16px", borderRadius: "100px", marginBottom: "40px",
            letterSpacing: "2px", textTransform: "uppercase",
          }}>
            <span style={{ width: "6px", height: "6px", background: "#2dd4bf", borderRadius: "50%", boxShadow: "0 0 8px #2dd4bf" }} />
            Club Collaboration Platform
          </div>

          {/* Main heading */}
          <div style={{ fontSize: "clamp(72px, 13vw, 140px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-4px", marginBottom: "32px" }}>
            <span style={{ color: "white" }}>dev</span>
            <span style={{
              background: "linear-gradient(135deg, #2dd4bf 0%, #67e8f9 40%, #34d399 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", filter: "drop-shadow(0 0 40px rgba(45,212,191,0.4))",
            }}>Chart</span>
          </div>

          <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "500px", margin: "0 auto 48px", lineHeight: 1.7 }}>
            The modern way to manage tasks, track progress, and collaborate — built for student clubs that ship fast.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginBottom: "80px", flexWrap: "wrap" }}>
            <Link href="/dashboard">
              <button style={{
                padding: "16px 36px", borderRadius: "16px", fontSize: "16px",
                fontWeight: 800, color: "#000", border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #2dd4bf, #34d399)",
                boxShadow: "0 0 40px rgba(45,212,191,0.35), 0 8px 32px rgba(0,0,0,0.4)",
                transition: "all 0.2s",
              }}>
                Open Dashboard →
              </button>
            </Link>
            <Link href="/create-task">
              <button style={{
                padding: "16px 36px", borderRadius: "16px", fontSize: "16px",
                fontWeight: 700, color: "white", cursor: "pointer",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s",
              }}>
                Create First Task
              </button>
            </Link>
          </div>

          {/* Feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", maxWidth: "800px", margin: "0 auto" }}>
            {[
              { icon: "🗂️", label: "Kanban Board", desc: "Drag & drop tasks between stages" },
              { icon: "✨", label: "AI Assist", desc: "Generate smart task descriptions" },
              { icon: "📅", label: "Due Dates", desc: "Track deadlines with highlights" },
              { icon: "⚡", label: "Activity Feed", desc: "See every move in real time" },
            ].map((f) => (
              <div key={f.label} style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: "20px 16px", textAlign: "left",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{f.icon}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "6px" }}>{f.label}</div>
                <div style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}