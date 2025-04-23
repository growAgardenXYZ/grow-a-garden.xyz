import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>Grow a Garden Stock Tracker | Data updates automatically every 30 seconds</p>
        <p className="mt-2 mb-2">
          <Link href="/download">
            <button className="text-yellow-400 hover:text-yellow-500 underline font-medium transition-colors">
              Download Stock Scanner Script
            </button>
          </Link>
        </p>
        <p className="text-gray-400">Not affiliated with Roblox or Grow a Garden game</p>
      </div>
    </footer>
  );
}
