import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800 bg-black sticky top-0 z-50">
            <Link href="/">
                <h1 className="text-2xl font-bold text-teal-300 glow-text tracking-wider">
                    dev<span className="text-white">Chart</span>
                </h1>
            </Link>
            <div className="flex gap-3">
                <Link href="/dashboard">
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold text-teal-300 border border-teal-800 hover:bg-teal-900 hover:border-teal-400 transition-all duration-200">
                        Dashboard
                    </button>
                </Link>
                <Link href="/create-task">
                    <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-400 text-black hover:bg-teal-300 transition-all duration-200">
                        + Create Task
                    </button>
                </Link>
            </div>
        </nav>
    );
}