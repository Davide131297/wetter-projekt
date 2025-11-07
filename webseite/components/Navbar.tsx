import Link from "next/link";
import Image from "next/image";
import SearchComponent from "./Search";

export default function Navbar() {
  return (
    <nav className="border-b bg-linear-to-r from-sky-400 to-blue-500 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity text-white"
          >
            <Image
              src="/WeatherLogo.png"
              alt="Wetter-App Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span>Wetter-App</span>
          </Link>
        </div>
        <SearchComponent />
      </div>
    </nav>
  );
}
