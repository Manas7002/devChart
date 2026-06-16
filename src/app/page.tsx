import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
        <h1 className="text-9xl font-bold text-teal-200 mb-6">devChart</h1>
        <p className="text-2xl font-medium text-gray-300 mb-4">
          An easy tool for managing your tasks and collaborating with your team
        </p>
        <p className="text-lg text-gray-400 mb-10">Have a Nice Time Building...</p>
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="bg-teal-400 text-black font-bold px-8 py-3 rounded-xl hover:bg-teal-300 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/create-task"
            className="border-2 border-teal-400 text-teal-400 font-bold px-8 py-3 rounded-xl hover:bg-teal-400 hover:text-black transition"
          >
            Create Task
          </Link>
        </div>
      </div>
    </div>
  );
}