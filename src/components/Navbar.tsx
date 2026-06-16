import Link from "next/link";

export default function Navbar() {
    return (
        <nav style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            position: "sticky", top: 0, zIndex: 50,
            background: "rgba(5,0,16,0.8)", backdropFilter: "blur(20px)",
        }}>
            <Link href="/">
                <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px", cursor: "pointer" }}>
                    <span style={{ color: "#a78bfa" }}>dev</span>
                    <span style={{ color: "white" }}>Chart</span>
                </div>
            </Link>
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
    );
}